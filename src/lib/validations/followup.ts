import { z } from 'zod';

export const createFollowUpSchema = z.object({
  date: z.string().min(1, 'Tanggal follow up wajib diisi'),
  time: z.string().min(1, 'Waktu follow up wajib diisi'),
  method: z.enum(['WhatsApp', 'Telepon', 'Meeting', 'Email', 'Lainnya']),
  result: z.enum([
    'Tertarik',
    'Minta Harga',
    'Minta Detail',
    'Masih Pertimbangkan',
    'Siap Membeli',
    'Tidak Tertarik',
    'Tidak Bisa Dihubungi',
    'Buka Kembali',
    'Lainnya',
  ]),
  notes: z.string().max(500).optional(),
  oldStatus: z.enum(['Cold', 'Warm', 'Hot', 'Closing', 'Tidak Berhasil']).optional(),
  newStatus: z.enum(['Cold', 'Warm', 'Hot', 'Closing', 'Tidak Berhasil']),
  lostReason: z.string().optional(),
  nextFollowUpDate: z.string().optional(),
  nextFollowUpTime: z.string().optional(),
});
