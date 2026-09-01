import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

export interface AuthUserContext {
  user: User;
  userId: string;
}

/**
 * Resolves the currently authenticated user from the request context.
 * Supports:
 * 1. Request header 'x-user-id' or 'x-sales-id'
 * 2. Authorization Bearer token (if user ID or JWT provided)
 * 3. Default/Active authenticated user in the database (with auto-provisioning for Budi Sales in bypass/local mode)
 */
export async function getCurrentUser(request?: Request | NextRequest): Promise<User> {
  let userId: string | null = null;

  if (request) {
    const headers = request.headers;
    userId = headers.get('x-user-id') || headers.get('x-sales-id') || null;

    if (!userId) {
      const authHeader = headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        // If token maps to a user ID or known session
        if (token && !token.includes('.')) {
          userId = token;
        }
      }
    }
  }

  // 1. If explicit user ID provided in request, find that exact user
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (user) return user;
  }

  // 2. Resolve default active sales user
  let defaultUser = await prisma.user.findFirst({
    where: { email: 'budi.sales@perusahaan.co.id' },
  });

  if (!defaultUser) {
    defaultUser = await prisma.user.findFirst();
  }

  if (!defaultUser) {
    defaultUser = await prisma.user.create({
      data: {
        name: 'Budi Sales',
        email: 'budi.sales@perusahaan.co.id',
        phone: '081288991234',
        role: 'Sales',
        monthlyTarget: 20,
      },
    });
  }

  return defaultUser;
}

/**
 * Validates ownership of a lead for the current user.
 * Returns the lead if owned by the user, or null/error if unauthorized.
 */
export async function verifyLeadOwnership(leadId: string, userId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      product: true,
      followUps: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!lead || lead.isDeleted) {
    return { status: 404, error: 'Lead tidak ditemukan', lead: null };
  }

  if (lead.salesId !== userId) {
    return {
      status: 403,
      error: 'Akses ditolak: Anda tidak memiliki izin untuk mengakses data lead pengguna lain.',
      lead: null,
    };
  }

  return { status: 200, error: null, lead };
}
