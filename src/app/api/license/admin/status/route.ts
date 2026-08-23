import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { licenseId, status } = body;

    if (!licenseId || !status) {
      return NextResponse.json(
        { success: false, error: 'licenseId and status are required.' },
        { status: 400 }
      );
    }

    const success = LicenseService.updateStatusByAdmin(licenseId, status);

    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui status.' },
      { status: 500 }
    );
  }
}
