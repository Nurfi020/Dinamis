import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const activationToken = body.activationToken || req.headers.get('authorization')?.replace('Bearer ', '');
    const deviceId = body.deviceId || req.headers.get('x-device-id');
    const productCode = body.productCode || 'KEL0LA-LEAD';

    const result = await LicenseService.verify({
      activationToken: activationToken || '',
      deviceId: deviceId || '',
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
    return NextResponse.json(
      { valid: false, error: 'Terjadi kesalahan saat memvalidasi lisensi.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activationToken = searchParams.get('token') || req.headers.get('authorization')?.replace('Bearer ', '') || '';
    const deviceId = searchParams.get('deviceId') || req.headers.get('x-device-id') || '';

    const result = await LicenseService.verify({
      activationToken,
      deviceId,
      productCode: 'KEL0LA-LEAD',
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
    return NextResponse.json(
      { valid: false, error: 'Terjadi kesalahan saat memvalidasi lisensi.' },
      { status: 500 }
    );
  }
}
