export type DigitalProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: 'business' | 'productivity' | 'ai' | 'templates' | 'guides' | 'creative';
  price: number;
  formattedPrice: string;
  status: 'available' | 'coming-soon';
  href: string;
  externalUrl?: string;
  maintenanceLevel: 'low' | 'medium';
  deliveryType: 'instant' | 'digital';
  badge?: string;
  whatYouGet: string[];
  previewHighlights: string[];
  targetAudience: string;
};

export const DIGITAL_PRODUCTS: DigitalProduct[] = [
  {
    id: 'whatsapp-followup-kit',
    slug: 'whatsapp-followup-kit',
    name: 'WhatsApp Follow-Up Kit',
    tagline: '35+ Skrip Pesan Follow-Up Anti-Ghosting Siap Pakai',
    description:
      'Kumpulan template pesan WhatsApp profesional yang dirancang untuk mengatasi berbagai situasi prospek: belum balas chat, ragu harga, minta diskon berlebih, hingga reminder tagihan termin tanpa terkesan memaksa.',
    category: 'templates',
    price: 67000,
    formattedPrice: 'Rp 67.000',
    status: 'available',
    href: '/digital-products/whatsapp-followup-kit',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    deliveryType: 'instant',
    badge: 'Paling Populer',
    whatYouGet: [
      '35+ Template Skrip WhatsApp siap copy-paste',
      'Format Word (.docx), Notepad (.txt), & PDF',
      'Panduan Timing & Frekuensi Follow-Up yang Tepat',
      'Bonus Checklist Handling Objection Penolakan Harga',
    ],
    previewHighlights: [
      'Skrip 1: Follow-Up Pasca Kirim RAB / Penawaran',
      'Skrip 2: Respon Ketika Prospek Berkata "Kemahalan"',
      'Skrip 3: Pengingat Halus Pasca Survei Lokasi',
      'Skrip 4: Re-engagement Prospek yang Lama Menghilang',
    ],
    targetAudience: 'Owner bisnis, sales executive, kontraktor, agen properti, dan tim customer service.',
  },
  {
    id: 'customer-database-template',
    slug: 'customer-database-template',
    name: 'Customer Database Template',
    tagline: 'Format Spreadsheet Otomatis Pencatatan Prospek & Klien',
    description:
      'Template spreadsheet rapi berbasis formula otomatis untuk mendokumentasikan kontak customer, kategori prospek (Cold/Warm/Hot/Deal), tanggal kontak terakhir, nilai potensi transaksi, dan log follow-up harian.',
    category: 'templates',
    price: 49000,
    formattedPrice: 'Rp 49.000',
    status: 'available',
    href: '/digital-products/customer-database-template',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    deliveryType: 'instant',
    badge: 'Praktis',
    whatYouGet: [
      'File Master Google Sheets & Microsoft Excel (.xlsx)',
      'Formula Otomatis Status Kualifikasi Lead & Reminder',
      'Dashboard Ringkasan Omset & Rasio Closing',
      'Panduan Video Singkat Penggunaan 5 Menit',
    ],
    previewHighlights: [
      'Tab 1: Database Kontak & Profil Lengkap Klien',
      'Tab 2: Log Riwayat Follow-Up & Catatan Negosiasi',
      'Tab 3: Rekap Nilai Proyek & Estimasi Closing',
      'Tab 4: Visual Ringkasan Grafik Performa Sales',
    ],
    targetAudience: 'Bisnis yang ingin merapikan data pelanggan dari catatan fisik atau grup chat tanpa software rumit.',
  },
  {
    id: 'sales-pipeline-template',
    slug: 'sales-pipeline-template',
    name: 'Sales Pipeline Template',
    tagline: 'Papan Manajemen Deals Visual untuk Memantau Progres Penjualan',
    description:
      'Papan visual alur penjualan untuk memantau perjalanan prospek dari lead masuk, survei, penawaran, negosiasi, hingga deal tanda tangan kontrak agar tidak ada transaksi yang terlewat.',
    category: 'productivity',
    price: 39000,
    formattedPrice: 'Rp 39.000',
    status: 'available',
    href: '/digital-products/sales-pipeline-template',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    deliveryType: 'instant',
    badge: 'Efisien',
    whatYouGet: [
      'Template Notion Workspace Siap Duplikasi',
      'Versi Google Sheets Kanban Board',
      'Panduan Kualifikasi Prospek Berdasarkan Probabilitas Deal',
      'Checklist Verifikasi Kelengkapan Dokumen SPK',
    ],
    previewHighlights: [
      'Kolom 1: Lead Masuk (Inquiry Baru)',
      'Kolom 2: Terjadwal Survei / Diskusi Awal',
      'Kolom 3: Penawaran Harga / RAB Terkirim',
      'Kolom 4: Negosiasi Final & Tanda Tangan SPK',
    ],
    targetAudience: 'Project Manager, Account Executive, dan pimpinan tim penjualan.',
  },
  {
    id: 'marketing-toolkit',
    slug: 'marketing-toolkit',
    name: 'Marketing & Sales Toolkit',
    tagline: 'Paket SOP Penjualan, Checklist Survei, & Kalkulator Margin',
    description:
      'Bundel panduan operasional komprehensif yang memuat Standard Operating Procedure (SOP) tim penjualan, lembar checklist survei kebutuhan klien, template surat penawaran harga resmi, dan kalkulator margin keuntungan.',
    category: 'business',
    price: 67000,
    formattedPrice: 'Rp 67.000',
    status: 'available',
    href: '/digital-products/marketing-toolkit',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    deliveryType: 'instant',
    badge: 'Paket Lengkap',
    whatYouGet: [
      'Dokumen SOP Penanganan Lead & Pelayanan Customer',
      'Checklist Form Survei Lapangan Siap Cetak & Digital',
      'Template Surat Penawaran Resmi (.docx)',
      'Bonus Spreadsheet Kalkulator Margin & Markup',
    ],
    previewHighlights: [
      'Modul A: Standard Respon Cepat Prospek < 15 Menit',
      'Modul B: Protokol Pengukuran & Survei Kebutuhan',
      'Modul C: Format Surat Penawaran & Syarat Termin',
      'Modul D: Simulasi Perhitungan Biaya Modal vs Laba',
    ],
    targetAudience: 'Pemilik bisnis dan tim operasional yang ingin standardisasi alur kerja tim agar rapi.',
  },
];
