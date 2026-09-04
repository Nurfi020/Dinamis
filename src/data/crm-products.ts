export type CRMProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  status: 'available' | 'coming-soon';
  href: string;
  demoHref?: string;
  maintenanceLevel: 'low' | 'medium';
  automationLevel: 'manual' | 'assisted' | 'automated';
  badge?: string;
  features: string[];
  highlights: string[];
  ctaText: string;
  isPrimary?: boolean;
};

export const CRM_PRODUCTS: CRMProduct[] = [
  {
    id: 'business-crm',
    slug: 'business',
    name: 'Business CRM',
    tagline: 'CRM Sederhana untuk Mengelola Customer & Sales',
    description:
      'Sistem CRM praktis untuk membantu bisnis mengelola lead, customer, follow-up, sales pipeline, dan riwayat aktivitas dalam satu tempat yang lebih rapi.',
    category: 'UMKM & Bisnis Umum',
    status: 'available',
    href: '/crm/business',
    demoHref: '/crm/business/demo',
    maintenanceLevel: 'low',
    automationLevel: 'automated',
    badge: 'Tersedia',
    features: [
      'Database Lead & Customer Terpusat',
      'Sales Pipeline & Tahapan Deals',
      'Riwayat Aktivitas & Catatan Customer',
      'Reminder Jadwal Follow-up Otomatis',
      'Dashboard Ringkasan Penjualan',
    ],
    highlights: [
      'Low Setup & Mudah Digunakan Tim',
      'Role-based Access & Keamanan Data',
    ],
    ctaText: 'Lihat Business CRM',
    isPrimary: false,
  },
  {
    id: 'contractor-crm',
    slug: 'contractor',
    name: 'Contractor CRM',
    tagline: 'Sistem Operasional & Pipeline Proyek Kontraktor',
    description:
      'Sistem CRM terintegrasi untuk kontraktor, renovasi, dan interior. Mengelola alur lead masuk, survei GPS, RAB, material purchasing, SPK, hingga laporan proyek dalam satu alur terpusat.',
    category: 'Konstruksi & Renovasi',
    status: 'available',
    href: '/crm/contractor',
    demoHref: '/crm/contractor/demo',
    maintenanceLevel: 'low',
    automationLevel: 'automated',
    badge: 'Tersedia',
    features: [
      'Pipeline 7-Tahap Proyek & SPK',
      'Survei GPS Lokasi & Upload RAB',
      'Kontrol Belanja Material & Logistik',
      'Manajemen Penugasan Tim & RBAC',
      'Audit Log & Rekap Laporan Keuangan',
    ],
    highlights: [
      'Dirancang khusus alur lapangan kontraktor',
      'Akses mandor & supervisor via mobile browser',
      'Data real-time tersinkronisasi otomatis',
    ],
    ctaText: 'Lihat Contractor CRM',
    isPrimary: true,
  },
  {
    id: 'property-crm',
    slug: 'property',
    name: 'Property CRM',
    tagline: 'Manajemen Listing & Prospek Calon Pembeli',
    description:
      'Sistem CRM untuk developer dan agen properti. Mengelola database ketersediaan unit, jadwal site visit viewing, dan tracking performa penjualan marketing.',
    category: 'Real Estate & Properti',
    status: 'coming-soon',
    href: '/crm#property',
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    badge: 'Segera Hadir',
    features: [
      'Database Ketersediaan Unit Listing',
      'Jadwal Site Visit Calon Pembeli',
      'Tracking Komisi & Agen Marketing',
      'Follow-up Reminder Otomatis',
    ],
    highlights: [
      'Minim input manual untuk agen lapangan',
      'Integrasi reminder jadwal viewing WhatsApp',
    ],
    ctaText: 'Pelajari Alur',
    isPrimary: false,
  },
  {
    id: 'service-crm',
    slug: 'service-business',
    name: 'Service Business CRM',
    tagline: 'Manajemen Order Jasa & Invoice Termin',
    description:
      'Sistem pengelolaan antrean pekerjaan jasa profesional, penerbitan invoice termin bertahap, dan notifikasi status pengerjaan otomatis kepada klien.',
    category: 'Jasa & Layanan',
    status: 'coming-soon',
    href: '/crm#service',
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    badge: 'Segera Hadir',
    features: [
      'Antrean Order & Timeline Pengerjaan',
      'Pencatatan Invoice & Tagihan Termin',
      'Notifikasi Status via WhatsApp',
      'Database Profil & Riwayat Klien',
    ],
    highlights: [
      'Mengurangi pertanyaan manual status order',
      'Pengingat tagihan termin otomatis',
    ],
    ctaText: 'Pelajari Alur',
    isPrimary: false,
  },
  {
    id: 'agency-crm',
    slug: 'agency',
    name: 'Agency CRM',
    tagline: 'Manajemen Retainer Client & Proposal Pitch',
    description:
      'Sistem CRM untuk agensi kreatif dan digital. Memantau deals penawaran pitch, approval brief klien, dan laporan produktivitas account executive.',
    category: 'Agensi & Kreatif',
    status: 'coming-soon',
    href: '/crm#agency',
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    badge: 'Segera Hadir',
    features: [
      'Tracking Pitch Proposal Deals',
      'Manajemen Brief & Approval Klien',
      'Retainer Contract Tracker',
      'Laporan Closing Bulanan Tim AE',
    ],
    highlights: [
      'Dokumentasi proposal tanpa tercecer',
      'Visibilitas target omset agensi',
    ],
    ctaText: 'Pelajari Alur',
    isPrimary: false,
  },
  {
    id: 'custom-web-app',
    slug: 'custom-web-app',
    name: 'Custom Web App',
    tagline: 'Pengembangan Aplikasi Web Khusus Sesuai Alur Bisnis',
    description:
      'Sistem aplikasi web dan operasional yang dirancang khusus mengikuti proses kerja unik, approval bertingkat, dan integrasi sistem yang dibutuhkan perusahaan Anda.',
    category: 'Solusi Khusus',
    status: 'available',
    href: 'https://wa.me/6281234567890?text=Halo%20DINAMIS,%20saya%20tertarik%20konsultasi%20pembuatan%20Custom%20Web%20App.',
    maintenanceLevel: 'low',
    automationLevel: 'automated',
    badge: 'Konsultasi',
    features: [
      'Struktur Database & Modul Terdedikasi',
      'Integrasi Alur Kerja & Notifikasi Tim',
      'Role-based Access & Keamanan Data',
      'UI/UX Rapi & Responsif Mobile Browser',
    ],
    highlights: [
      'Disesuaikan dengan SOP internal bisnis',
      'Dukungan konsultasi langsung via WhatsApp',
    ],
    ctaText: 'Konsultasikan Kebutuhan',
    isPrimary: false,
  },
];
