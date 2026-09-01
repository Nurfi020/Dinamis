import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDateToday } from '@/utils/helpers';
import { getCurrentUser } from '@/lib/auth/userAuth';

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
    const hotLeads = leads.filter((l) => l.status === 'Hot').length;
    const warmLeads = leads.filter((l) => l.status === 'Warm').length;
    const coldLeads = leads.filter((l) => l.status === 'Cold').length;
    const closingLeads = leads.filter((l) => l.status === 'Closing').length;
    const lostLeads = leads.filter((l) => l.status === 'Tidak Berhasil').length;

    const todayFollowUps = leads.filter((l) => {
      return l.nextFollowUpDate && l.status !== 'Closing' && l.status !== 'Tidak Berhasil' && isDateToday(l.nextFollowUpDate);
    });

    const followUpCount = todayFollowUps.length;
    const totalCalc = totalLeads > 0 ? totalLeads : 1;

    const statusDistribution = [
      { status: 'Cold', count: coldLeads, pct: `${totalLeads > 0 ? Math.round((coldLeads / totalCalc) * 100) : 0}%`, color: '#64748B' },
      { status: 'Warm', count: warmLeads, pct: `${totalLeads > 0 ? Math.round((warmLeads / totalCalc) * 100) : 0}%`, color: '#F59E0B' },
      { status: 'Hot', count: hotLeads, pct: `${totalLeads > 0 ? Math.round((hotLeads / totalCalc) * 100) : 0}%`, color: '#EF4444' },
      { status: 'Closing', count: closingLeads, pct: `${totalLeads > 0 ? Math.round((closingLeads / totalCalc) * 100) : 0}%`, color: '#10B981' },
      { status: 'Tidak Berhasil', count: lostLeads, pct: `${totalLeads > 0 ? Math.round((lostLeads / totalCalc) * 100) : 0}%`, color: '#6B7280' },
    ];

    const sources = ['WhatsApp', 'Instagram', 'Facebook', 'Website', 'Referral', 'TikTok', 'Lainnya'];
    const bestSources = sources.map((s) => {
      const sLeads = leads.filter((l) => l.source === s);
      const sClosing = sLeads.filter((l) => l.status === 'Closing').length;
      const rateNum = sLeads.length > 0 ? (sClosing / sLeads.length) * 100 : 0;
      return {
        source: s,
        leads: sLeads.length,
        closing: sClosing,
        rate: `${rateNum.toFixed(1).replace('.', ',')}%`,
      };
    }).sort((a, b) => b.leads - a.leads);

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    const newLeadsThisWeek = leads.filter((l) => new Date(l.createdAt) >= oneWeekAgo).length;

    const chartDataWeekly = [
      { label: '3 Mgg Lalu', value: 0 },
      { label: '2 Mgg Lalu', value: 0 },
      { label: 'Mgg Lalu', value: 0 },
      { label: 'Mgg Ini', value: newLeadsThisWeek },
    ];

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalLeads,
          newLeadsThisWeek,
          needFollowUpToday: followUpCount,
          hotLeads,
          closingLeads,
        },
        chartDataWeekly,
        statusDistribution,
        bestSources,
        todayFollowUps: todayFollowUps.slice(0, 4).map((l) => ({
          id: l.id,
          name: l.name,
          phone: l.phone,
          city: l.city,
          product: l.product?.name || 'Produk A',
          status: l.status,
          nextFollowUpTime: l.nextFollowUpTime || '10:00',
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard reports:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data dashboard' },
      { status: 500 }
    );
  }
}
