import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';
import { checkRateLimit } from '@/lib/license/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const body = await req.json().catch(() => ({}));
    const { licenseKey, deviceId, deviceName, browser, operatingSystem } = body;

    const rateLimitKey = `${ip}:${deviceId || 'unknown'}`;
    const rateCheck = checkRateLimit(rateLimitKey, 10, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan aktivasi. Silakan coba lagi dalam ${rateCheck.retryAfterSeconds} detik.`,
        },
        { status: 429 }
      );
    }

    const result = LicenseService.activate({
      licenseKey,
      deviceId,
      deviceName,
      browser,
      operatingSystem,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        token: result.token,
        license: result.license,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('License activate error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server saat aktivasi lisensi.' },
      { status: 500 }
    );
  }
}
