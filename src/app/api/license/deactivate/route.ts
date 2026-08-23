import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { activationToken, deviceId } = body;

    const result = LicenseService.deactivate({
      activationToken,
      deviceId,
    });

    return NextResponse.json(result, { status: result.status });
  } catch (error: any) {
    console.error('License deactivate error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan saat melepaskan perangkat.' },
      { status: 500 }
    );
  }
}
