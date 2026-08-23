import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { notes } = body;

    const result = await LicenseService.createNewKey(notes || 'API Generated Lifetime Key');

    return NextResponse.json({
      success: true,
      key: result.key,
      license: result.license,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal membuat license key baru.' },
      { status: 500 }
    );
  }
}
