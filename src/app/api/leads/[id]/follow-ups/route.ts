import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createFollowUpSchema } from '@/lib/validations/followup';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = createFollowUpSchema.parse(body);

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead || lead.isDeleted) {
      return NextResponse.json(
        { success: false, error: 'Lead tidak ditemukan' },
        { status: 404 }
      );
    }

    const isClosing = validatedData.newStatus === 'Closing';
    const isLost = validatedData.newStatus === 'Tidak Berhasil';
    const isReopening = lead.status === 'Tidak Berhasil' && (validatedData.newStatus === 'Warm' || validatedData.newStatus === 'Hot' || validatedData.newStatus === 'Cold');

    // 1. Create Follow Up log (Append-only)
    const newLog = await prisma.followUp.create({
      data: {
        leadId: lead.id,
        salesId: lead.salesId,
        date: validatedData.date,
        time: validatedData.time,
        method: validatedData.method,
        result: isReopening ? 'Buka Kembali' : validatedData.result,
        notes: validatedData.notes?.trim() || null,
        oldStatus: lead.status,
        newStatus: validatedData.newStatus,
        lostReason: isLost ? (validatedData.lostReason || null) : null,
        nextFollowUpDate: (isClosing || isLost) ? null : (validatedData.nextFollowUpDate || null),
        nextFollowUpTime: (isClosing || isLost) ? null : (validatedData.nextFollowUpTime || null),
      },
    });

    // 2. Update Lead status and timestamps
    const updatedLead = await prisma.lead.update({
      where: { id: lead.id },
      data: {
        status: validatedData.newStatus,
        lastFollowUpDate: validatedData.date,
        nextFollowUpDate: (isClosing || isLost) ? null : (validatedData.nextFollowUpDate || null),
        nextFollowUpTime: (isClosing || isLost) ? null : (validatedData.nextFollowUpTime || null),
        closedAt: isClosing ? new Date() : lead.closedAt,
        lostAt: isLost ? new Date() : (isReopening ? null : lead.lostAt),
        lostReason: isLost ? (validatedData.lostReason || null) : (isReopening ? null : lead.lostReason),
      },
      include: {
        product: true,
        followUps: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        log: {
          id: newLog.id,
          date: newLog.date,
          time: newLog.time,
          method: newLog.method,
          result: newLog.result,
          notes: newLog.notes || undefined,
          oldStatus: newLog.oldStatus || undefined,
          newStatus: newLog.newStatus,
          lostReason: newLog.lostReason || undefined,
          nextFollowUpDate: newLog.nextFollowUpDate || undefined,
          nextFollowUpTime: newLog.nextFollowUpTime || undefined,
          createdAt: newLog.createdAt.toISOString().split('T')[0],
        },
        lead: {
          id: updatedLead.id,
          salesId: updatedLead.salesId,
          name: updatedLead.name,
          phone: updatedLead.phone,
          city: updatedLead.city,
          source: updatedLead.source,
          productId: updatedLead.productId,
          product: updatedLead.product?.name || 'Produk A',
          status: updatedLead.status,
          initialNotes: updatedLead.initialNotes || undefined,
          lostReason: updatedLead.lostReason || undefined,
          createdAt: updatedLead.createdAt.toISOString().split('T')[0],
          updatedAt: updatedLead.updatedAt.toISOString().split('T')[0],
          lastFollowUpDate: updatedLead.lastFollowUpDate || undefined,
          nextFollowUpDate: updatedLead.nextFollowUpDate || undefined,
          nextFollowUpTime: updatedLead.nextFollowUpTime || undefined,
        },
      },
      message: isClosing
        ? '🎉 Selamat! Lead berhasil Closing'
        : 'Follow up berhasil dicatat',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error logging follow up:', error);
    if (error.errors) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Data follow up tidak valid' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Gagal mencatat follow up' },
      { status: 500 }
    );
  }
}
