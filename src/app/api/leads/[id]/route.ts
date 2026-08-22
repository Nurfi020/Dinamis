import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateLeadSchema } from '@/lib/validations/lead';
import { cleanPhoneNumber } from '@/utils/helpers';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        product: true,
        followUps: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lead || lead.isDeleted) {
      return NextResponse.json(
        { success: false, error: 'Lead tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: lead.id,
        salesId: lead.salesId,
        name: lead.name,
        phone: lead.phone,
        city: lead.city,
        source: lead.source,
        productId: lead.productId,
        product: lead.product?.name || 'Produk A',
        status: lead.status,
        initialNotes: lead.initialNotes || undefined,
        lostReason: lead.lostReason || undefined,
        createdAt: lead.createdAt.toISOString().split('T')[0],
        updatedAt: lead.updatedAt.toISOString().split('T')[0],
        lastFollowUpDate: lead.lastFollowUpDate || undefined,
        nextFollowUpDate: lead.nextFollowUpDate || undefined,
        nextFollowUpTime: lead.nextFollowUpTime || undefined,
        closedAt: lead.closedAt ? lead.closedAt.toISOString().split('T')[0] : undefined,
        lostAt: lead.lostAt ? lead.lostAt.toISOString().split('T')[0] : undefined,
        followUps: lead.followUps.map((f) => ({
          id: f.id,
          date: f.date,
          time: f.time,
          method: f.method,
          result: f.result,
          notes: f.notes || undefined,
          oldStatus: f.oldStatus || undefined,
          newStatus: f.newStatus,
          lostReason: f.lostReason || undefined,
          nextFollowUpDate: f.nextFollowUpDate || undefined,
          nextFollowUpTime: f.nextFollowUpTime || undefined,
          createdAt: f.createdAt.toISOString().split('T')[0],
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching lead detail:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil detail lead' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateLeadSchema.parse(body);

    const updatePayload: any = { ...validatedData };
    if (validatedData.phone) {
      updatePayload.phone = cleanPhoneNumber(validatedData.phone);
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updatePayload,
      include: {
        product: true,
        followUps: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
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
      message: 'Data lead berhasil diperbarui',
    });
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    // Soft delete according to Section 7 in 04-database.md
    await prisma.lead.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead berhasil dihapus',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus lead' },
      { status: 500 }
    );
  }
}
