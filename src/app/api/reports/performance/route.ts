import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/userAuth';
import { PRODUCTS_LIST } from '@/data/mockData';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);

    // Strict Data Isolation: only retrieve leads owned by the authenticated user
    const leads = await prisma.lead.findMany({
      where: { 
        salesId: currentUser.id,
        isDeleted: false 
      },
      include: { product: true },
    });

    const totalLeads = leads.length;
    const coldCount = leads.filter((l) => l.status === 'Cold').length;
    const warmCount = leads.filter((l) => l.status === 'Warm').length;
    const hotCount = leads.filter((l) => l.status === 'Hot').length;
    const closingCount = leads.filter((l) => l.status === 'Closing').length;
    const failedCount = leads.filter((l) => l.status === 'Tidak Berhasil').length;

    const closingRate = totalLeads > 0 
      ? ((closingCount / totalLeads) * 100).toFixed(2).replace('.', ',')
      : '0,00';

    const sources = ['WhatsApp', 'Instagram', 'Facebook', 'Website', 'Referral', 'TikTok', 'Lainnya'];
    const sourceStats = sources.map((s) => {
      const sLeads = leads.filter((l) => l.source === s);
      const sClosing = sLeads.filter((l) => l.status === 'Closing').length;
      const rate = sLeads.length > 0 ? (sClosing / sLeads.length) * 100 : 0;
      return {
        source: s,
        leads: sLeads.length,
        closing: sClosing,
        rate: `${rate.toFixed(1).replace('.', ',')}%`,
      };
    }).sort((a, b) => b.leads - a.leads);

    const productStats = PRODUCTS_LIST.map((prod) => {
      const pLeads = leads.filter((l) => (l.product?.name || '').startsWith(prod.split('—')[0].trim()));
      const pClosing = pLeads.filter((l) => l.status === 'Closing').length;
      const pct = totalLeads > 0 ? Math.round((pLeads.length / totalLeads) * 100) : 0;
      return {
        name: prod,
        count: pLeads.length,
        closing: pClosing,
        pct: `${pct}%`,
      };
    }).sort((a, b) => b.count - a.count);

    const cities = Array.from(new Set(leads.map((l) => l.city)));
    const cityStats = cities.map((c) => {
      const cLeads = leads.filter((l) => l.city === c);
      const cClosing = cLeads.filter((l) => l.status === 'Closing').length;
      const rate = cLeads.length > 0 ? (cClosing / cLeads.length) * 100 : 0;
      return {
        city: c,
        leads: cLeads.length,
        closing: cClosing,
        rate: `${rate.toFixed(1).replace('.', ',')}%`,
      };
    }).sort((a, b) => b.leads - a.leads);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalLeads,
          coldCount,
          warmCount,
          hotCount,
          closingCount,
          failedCount,
          closingRate,
        },
        sourceStats,
        productStats,
        cityStats,
      },
    });
  } catch (error) {
    console.error('Error fetching performance reports:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data laporan performa' },
      { status: 500 }
    );
  }
}
