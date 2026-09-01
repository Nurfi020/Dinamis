import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDateOverdue, isDateToday, isDateUpcoming } from '@/utils/helpers';
import { getCurrentUser } from '@/lib/auth/userAuth';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);

    const leads = await prisma.lead.findMany({
      where: {
        salesId: currentUser.id,
        isDeleted: false,
        status: { notIn: ['Closing', 'Tidak Berhasil'] },
        nextFollowUpDate: { not: null },
      },
      include: {
        product: true,
      },
      orderBy: { nextFollowUpDate: 'asc' },
    });

    const overdue = leads.filter((l) => isDateOverdue(l.nextFollowUpDate || undefined));
    const today = leads.filter((l) => isDateToday(l.nextFollowUpDate || undefined));
    const upcoming = leads.filter((l) => isDateUpcoming(l.nextFollowUpDate || undefined));

    const formatLead = (l: any) => ({
      id: l.id,
      name: l.name,
      phone: l.phone,
      city: l.city,
      source: l.source,
      product: l.product?.name || 'Produk A',
      status: l.status,
      initialNotes: l.initialNotes || undefined,
      nextFollowUpDate: l.nextFollowUpDate || undefined,
      nextFollowUpTime: l.nextFollowUpTime || undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        total: leads.length,
        overdue: overdue.map(formatLead),
        today: today.map(formatLead),
        upcoming: upcoming.map(formatLead),
      },
    });
  } catch (error) {
    console.error('Error fetching follow up summary:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil ringkasan follow up' },
      { status: 500 }
    );
  }
}
