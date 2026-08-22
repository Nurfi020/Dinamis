import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Nama lengkap wajib diisi').max(100).optional(),
  email: z.string().email('Format email tidak valid').optional(),
  phone: z.string().min(9, 'Nomor telepon minimal 9 digit').max(20).optional(),
  monthlyTarget: z.number().int().min(1, 'Target minimal 1 closing').max(1000).optional(),
});
