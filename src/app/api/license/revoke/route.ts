import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';
import { verifyAdminAuth } from '@/lib/auth/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized. Akses khusus admin.' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { licenseId } = body;

    if (!licenseId) {
      return NextResponse.json(
        { success: false, error: 'licenseId wajib diisi.' },
        { status: 400 }
      );
    }

    const success = await LicenseService.updateStatusByAdmin(licenseId, 'revoked');

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Lisensi tidak ditemukan.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lisensi berhasil dicabut (revoked).',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal mencabut lisensi.' },
      { status: 500 }
    );
  }
}
