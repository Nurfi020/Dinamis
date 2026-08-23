import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { notes } = body;

    const created = await LicenseService.createNewKey(notes);

    return NextResponse.json({
      success: true,
      key: created.key,
      license: created.license,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal membuat license key.' },
      { status: 500 }
    );
  }
}
