import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateProfileSchema } from '@/lib/validations/profile';

export async function GET() {
  try {
    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Budi Sales',
          email: 'budi.sales@perusahaan.co.id',
          phone: '081288991234',
          role: 'Senior Sales Executive',
          monthlyTarget: 20,
        },
      });
    }

    // Count actual closing count
    const closingCount = await prisma.lead.count({
      where: {
        salesId: user.id,
        status: 'Closing',
        isDeleted: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        monthlyTarget: user.monthlyTarget,
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
    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    let user = await prisma.user.findFirst();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
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
