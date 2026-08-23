import { NextRequest, NextResponse } from 'next/server';
import { LicenseService } from '@/lib/license/licenseService';
import { verifyAdminAuth } from '@/lib/auth/adminAuth';

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.isAdmin) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized. Akses khusus admin.' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { notes, prefix } = body;

    const result = await LicenseService.createNewKey(
      notes || 'Generated License Key',
      prefix || 'DINA'
    );

    return NextResponse.json({
      success: true,
      key: result.key,
      license: {
        id: result.license.id,
        plan: result.license.plan,
        status: result.license.status,
        productCode: result.license.productCode,
        licenseKeyLast4: result.license.licenseKeyLast4,
        maxDevices: result.license.maxDevices,
        notes: result.license.notes,
        createdAt: result.license.createdAt,
        expiresAt: result.license.expiresAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Gagal membuat license key baru.' },
      { status: 500 }
    );
  }
}
