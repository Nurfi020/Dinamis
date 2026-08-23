import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { activationToken, deviceId, productCode } = body;

    const result = LicenseService.verify({
      activationToken,
      deviceId,
      productCode,
    });

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(
      { valid: true, license: result.license },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('License verify error:', error);
    return NextResponse.json(
      { valid: false, error: 'Terjadi kesalahan saat memverifikasi lisensi.' },
      { status: 500 }
    );
  }
}
