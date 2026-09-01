import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateProfileSchema } from '@/lib/validations/profile';
import { getCurrentUser } from '@/lib/auth/userAuth';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);

    // Count actual closing count specifically for this authenticated sales user
    const closingCount = await prisma.lead.count({
      where: {
        salesId: currentUser.id,
        status: 'Closing',
        isDeleted: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        role: currentUser.role,
        avatarUrl: currentUser.avatarUrl,
        monthlyTarget: currentUser.monthlyTarget,
        closingCount: closingCount,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data profil' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: validatedData,
    });

    const closingCount = await prisma.lead.count({
      where: {
        salesId: updatedUser.id,
        status: 'Closing',
        isDeleted: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        monthlyTarget: updatedUser.monthlyTarget,
        closingCount: closingCount,
      },
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    if (error.errors) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Validasi gagal' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Gagal memperbarui data profil' },
      { status: 500 }
    );
  }
}
