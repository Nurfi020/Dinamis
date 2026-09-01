import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateLeadSchema } from '@/lib/validations/lead';
import { cleanPhoneNumber } from '@/utils/helpers';
import { getCurrentUser, verifyLeadOwnership } from '@/lib/auth/userAuth';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const currentUser = await getCurrentUser(request);
    const { id } = await params;

    // IDOR Protection: verify that the lead exists and belongs to the authenticated user
    const ownership = await verifyLeadOwnership(id, currentUser.id);
    if (ownership.status !== 200 || !ownership.lead) {
      return NextResponse.json(
        { success: false, error: ownership.error },
        { status: ownership.status }
      );
    }

    const lead = ownership.lead;

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
        value: (lead as any).value || (lead.product?.name?.includes('Enterprise') ? 75000000 : lead.product?.name?.includes('Pro') ? 35000000 : 15000000),
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
    const currentUser = await getCurrentUser(request);
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateLeadSchema.parse(body);

    // IDOR Protection: ensure target lead is owned by currentUser
    const ownership = await verifyLeadOwnership(id, currentUser.id);
    if (ownership.status !== 200 || !ownership.lead) {
      return NextResponse.json(
        { success: false, error: ownership.error },
        { status: ownership.status }
      );
    }

    const updatePayload: any = { ...validatedData };
    if (validatedData.phone) {
      updatePayload.phone = cleanPhoneNumber(validatedData.phone);
    }

    // Explicitly prevent tampering with salesId
    delete updatePayload.salesId;

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
    if (error.errors) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Data update tidak valid' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const currentUser = await getCurrentUser(request);
    const { id } = await params;

    // IDOR Protection: only owner can delete lead
    const ownership = await verifyLeadOwnership(id, currentUser.id);
    if (ownership.status !== 200 || !ownership.lead) {
      return NextResponse.json(
        { success: false, error: ownership.error },
        { status: ownership.status }
      );
    }

    // Soft delete
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
