export type FreeTool = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: 'kalkulator' | 'generator' | 'template';
  categoryLabel: string;
  status: 'ready' | 'beta';
  href: string;
  badge?: string;
  timeSaved: string;
  isPopular?: boolean;
};

export const FREE_TOOLS: FreeTool[] = [
  {
    id: 'kalkulator-margin',
    slug: 'kalkulator-margin',
    name: 'Kalkulator Margin & Markup',
    tagline: 'Hitung margin keuntungan kotor, laba bersih, dan persentase markup instan',
    description:
      'Alat bantu hitung cepat untuk mengetahui selisih harga modal (HPP) terhadap harga jual dan persentase margin keuntungan bersih tanpa rumus excel yang rumit.',
    category: 'kalkulator',
    categoryLabel: 'Finansial & Margin',
    status: 'ready',
    href: '/free-tools/kalkulator-margin',
    badge: 'Paling Sering Digunakan',
    timeSaved: 'Hasil instan < 5 detik',
    isPopular: true,
  },
  {
    id: 'kalkulator-bep',
    slug: 'kalkulator-bep',
    name: 'Kalkulator Break-Even Point (BEP)',
    tagline: 'Ketahui titik impas unit dan nominal omset minimal penutup biaya operasional',
    description:
      'Kalkulasi titik impas operasional bisnis berdasarkan biaya tetap (fixed cost), biaya variabel per unit, dan target harga jual untuk mengukur kelayakan target bulanan.',
    category: 'kalkulator',
    categoryLabel: 'Analisis Kelayakan',
    status: 'ready',
    href: '/free-tools/kalkulator-bep',
    badge: 'Praktis',
    timeSaved: 'Perhitungan otomatis',
    isPopular: true,
  },
  {
    id: 'kalkulator-harga-jual',
    slug: 'kalkulator-harga-jual',
    name: 'Kalkulator Harga Jual (Cost-Plus)',
    tagline: 'Tentukan harga jual produk/jasa ideal berdasarkan target margin keuntungan',
    description:
      'Hitung rekomendasi harga penawaran ke customer berdasarkan total biaya modal HPP ditambah target persentase margin laba yang ingin Anda amankan.',
    category: 'kalkulator',
    categoryLabel: 'Penetapan Harga',
    status: 'ready',
    href: '/free-tools/kalkulator-harga-jual',
    badge: 'Akurat',
    timeSaved: 'Cegah salah harga',
    isPopular: true,
  },
  {
    id: 'whatsapp-followup-generator',
    slug: 'whatsapp-followup-generator',
    name: 'Generator Follow-Up WhatsApp',
    tagline: 'Buat pesan follow-up customer persuasif dan sopan dalam berbagai situasi',
    description:
      'Hasilkan draft pesan chat WhatsApp ramah dan profesional untuk mengingatkan penawaran, menanyakan kabar prospek yang pending, atau konfirmasi jadwal pertemuan.',
    category: 'generator',
    categoryLabel: 'Komunikasi Sales',
    status: 'ready',
    href: '/free-tools/whatsapp-followup-generator',
    badge: 'Populer',
    timeSaved: 'Hemat 10 menit menyusun chat',
    isPopular: true,
  },
  {
    id: 'proposal-generator',
    slug: 'proposal-generator',
    name: 'Generator Draft Proposal',
    tagline: 'Susun kerangka surat penawaran kerja sama dan lingkup pekerjaan kilat',
    description:
      'Template generator cepat untuk membuat draft proposal penawaran jasa atau proyek bisnis lengkap dengan ruang lingkup, estimasi timeline, dan syarat termin pembayaran.',
    category: 'generator',
    categoryLabel: 'Dokumen Bisnis',
    status: 'ready',
    href: '/free-tools/proposal-generator',
    badge: 'Terstruktur',
    timeSaved: 'Siap copy-paste ke Word/PDF',
    isPopular: false,
  },
  {
    id: 'caption-generator',
    slug: 'caption-generator',
    name: 'Generator Caption Bisnis & Promosi',
    tagline: 'Buat teks promosi media sosial yang memikat dengan struktur hook dan CTA',
    description:
      'Menyusun teks promosi produk atau jasa dengan formula copywriting sederhana (Hook, Problem, Solution, CTA) untuk postingan WhatsApp Story, Instagram, dan LinkedIn.',
    category: 'generator',
    categoryLabel: 'Marketing & Promosi',
    status: 'ready',
    href: '/free-tools/caption-generator',
    badge: 'Kreatif',
    timeSaved: 'Ide konten instan',
    isPopular: false,
  },
];
