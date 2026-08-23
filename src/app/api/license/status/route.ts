import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activationToken = searchParams.get('token') || req.headers.get('authorization')?.replace('Bearer ', '');
    const deviceId = searchParams.get('deviceId') || req.headers.get('x-device-id');

    if (activationToken && deviceId) {
      const result = await LicenseService.verify({
        activationToken,
        deviceId,
        productCode: 'KEL0LA-LEAD',
      });

      return NextResponse.json({
        service: 'active',
        plan: 'lifetime',
        devicePolicy: '1 User 1 Device',
        active: result.valid,
        license: result.valid ? result.license : null,
      });
    }

    return NextResponse.json({
      service: 'active',
      app: 'Kelola Lead Sales CRM',
      plan: 'lifetime',
      devicePolicy: '1 User 1 Device',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Gagal memeriksa status lisensi' },
      { status: 500 }
    );
  }
}
