import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const list = await LicenseService.listAll({ search, status });

    return NextResponse.json({
      success: true,
      licenses: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memuat daftar lisensi.' },
      { status: 500 }
    );
  }
}
