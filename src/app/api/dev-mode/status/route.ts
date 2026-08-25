import { NextRequest, NextResponse } from 'next/server';
import { checkServerDevMode } from '@/lib/devMode/devModeServer';

export async function GET(req: NextRequest) {
  // If NODE_ENV is production, instantly return isDevMode: false
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { isDevMode: false, reason: 'Production environment' },
      { status: 200 }
    );
  }

  const host = req.headers.get('host') || req.headers.get('x-forwarded-host') || '';
  const status = checkServerDevMode(host);

  return NextResponse.json(status, { status: 200 });
}