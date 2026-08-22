import { NextResponse } from 'next/server';
import { CITIES_LIST } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: CITIES_LIST,
  });
}
