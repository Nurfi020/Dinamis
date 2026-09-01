import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createLeadSchema } from '@/lib/validations/lead';
import { cleanPhoneNumber } from '@/utils/helpers';
import { getCurrentUser } from '@/lib/auth/userAuth';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const product = searchParams.get('product') || 'all';
    const city = searchParams.get('city') || 'all';
    const source = searchParams.get('source') || 'all';
    const period = searchParams.get('period') || 'all';
    const sortBy = searchParams.get('sortBy') || 'latest';

    // Strict Data Isolation: only retrieve leads owned by the authenticated user
    const where: any = {
      isDeleted: false,
      salesId: currentUser.id,
    };

    if (status !== 'all') {
      where.status = status;
    }

    if (city !== 'all') {
      where.city = city;
    }

    if (source !== 'all') {
      where.source = source;
    }

    if (product !== 'all') {
      where.product = {
        name: { contains: product },
      };
    }

    if (search.trim()) {
      where.AND = [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search } },
            { city: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    // Period filter
    const now = new Date();
    if (period === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      where.createdAt = { gte: startOfDay };
    } else if (period === 'this_week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      where.createdAt = { gte: startOfWeek };
    } else if (period === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      where.createdAt = { gte: startOfMonth };
    }

    // Sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'oldest') {
      orderBy = { createdAt: 'asc' };
    } else if (sortBy === 'name') {
      orderBy = { name: 'asc' };
    } else if (sortBy === 'next_followup') {
      orderBy = { nextFollowUpDate: 'asc' };
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        product: true,
        followUps: {
          orderBy: { date: 'desc' },
        },
      },
      orderBy,
    });

    // Format response to match frontend interface
    const formattedLeads = leads.map((l) => ({
      id: l.id,
      salesId: l.salesId,
      name: l.name,
      phone: l.phone,
      city: l.city,
      source: l.source,
      productId: l.productId,
      product: l.product?.name || 'Produk A',
      status: l.status,
      initialNotes: l.initialNotes || undefined,
      lostReason: l.lostReason || undefined,
      createdAt: l.createdAt.toISOString().split('T')[0],
      updatedAt: l.updatedAt.toISOString().split('T')[0],
      lastFollowUpDate: l.lastFollowUpDate || undefined,
      nextFollowUpDate: l.nextFollowUpDate || undefined,
      nextFollowUpTime: l.nextFollowUpTime || undefined,
      closedAt: l.closedAt ? l.closedAt.toISOString().split('T')[0] : undefined,
      lostAt: l.lostAt ? l.lostAt.toISOString().split('T')[0] : undefined,
      followUps: l.followUps.map((f) => ({
        id: f.id,
        date: f.date,
        time: f.time,
        method: f.method,
        result: f.result,
        notes: f.notes || undefined,
        oldStatus: f.oldStatus || undefined,
        newStatus: f.newStatus,
        lostReason: f.lostReason || undefined,
        nextFollowUpDate: f.nextFollowUpDate || undefined,
        nextFollowUpTime: f.nextFollowUpTime || undefined,
        createdAt: f.createdAt.toISOString().split('T')[0],
      })),
    }));

    return NextResponse.json({
      success: true,
      data: formattedLeads,
      total: formattedLeads.length,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil daftar lead' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    const body = await request.json();
    const validatedData = createLeadSchema.parse(body);

    // Resolve product ID (by name or ID)
    let product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: validatedData.productId },
          { name: validatedData.productId },
        ],
      },
    });

    if (!product) {
      product = await prisma.product.findFirst();
    }

    if (!product) {
      product = await prisma.product.create({
        data: { name: 'Produk A — Starter Plan' },
      });
    }

    const cleanedPhone = cleanPhoneNumber(validatedData.phone);
    const todayStr = new Date().toISOString().split('T')[0];

    // Ownership guaranteed: salesId bound to authenticated user
    const newLead = await prisma.lead.create({
      data: {
        salesId: currentUser.id,
        name: validatedData.name.trim(),
        phone: cleanedPhone,
        city: validatedData.city,
        source: validatedData.source,
        productId: product.id,
        status: validatedData.status,
        initialNotes: validatedData.initialNotes?.trim() || null,
        nextFollowUpDate: validatedData.nextFollowUpDate || todayStr,
        nextFollowUpTime: validatedData.nextFollowUpTime || '10:00',
      },
      include: {
        product: true,
        followUps: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newLead.id,
        salesId: newLead.salesId,
        name: newLead.name,
        phone: newLead.phone,
        city: newLead.city,
        source: newLead.source,
        productId: newLead.productId,
        product: newLead.product?.name || 'Produk A',
        status: newLead.status,
        initialNotes: newLead.initialNotes || undefined,
        createdAt: newLead.createdAt.toISOString().split('T')[0],
        updatedAt: newLead.updatedAt.toISOString().split('T')[0],
        nextFollowUpDate: newLead.nextFollowUpDate || undefined,
        nextFollowUpTime: newLead.nextFollowUpTime || undefined,
        followUps: [],
      },
      message: 'Lead berhasil ditambahkan',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    if (error.errors) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || 'Data lead tidak valid' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Gagal menambahkan lead baru' },
      { status: 500 }
    );
  }
}
