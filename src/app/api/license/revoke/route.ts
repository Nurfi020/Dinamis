import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { licenseId } = body;

    if (!licenseId) {
      return NextResponse.json(
        { success: false, error: 'licenseId is required.' },
        { status: 400 }
      );
    }

    const success = await LicenseService.updateStatusByAdmin(licenseId, 'revoked');

    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal mencabut lisensi.' },
      { status: 500 }
    );
  }
}
