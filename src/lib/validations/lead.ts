import { z } from 'zod';

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Nama calon pelanggan wajib diisi').max(100),
  phone: z.string().min(9, 'Nomor WhatsApp minimal 9 digit').max(20),
  city: z.string().min(1, 'Kota domisili wajib dipilih'),
  source: z.enum([
    'WhatsApp',
    'Facebook',
    'Instagram',
    'TikTok',
    'Website',
    'Referral',
    'Marketplace',
    'Lainnya',
  ]),
  productId: z.string().min(1, 'Produk wajib dipilih'),
  status: z.enum(['Cold', 'Warm', 'Hot', 'Closing', 'Tidak Berhasil']).default('Cold'),
  initialNotes: z.string().max(500).optional(),
  nextFollowUpDate: z.string().optional(),
  nextFollowUpTime: z.string().optional(),
});

export const updateLeadSchema = createLeadSchema.partial();
