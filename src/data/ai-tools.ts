export type AITool = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: 'sales' | 'customer' | 'business' | 'productivity';
  status: 'available' | 'coming-soon';
  href: string;
  externalUrl?: string;
  maintenanceLevel: 'low' | 'medium';
  automationLevel: 'manual' | 'assisted' | 'automated';
  deliveryType: 'instant' | 'tool';
  badge?: string;
  useCase: string;
  timeSaved: string;
  isPriority?: boolean;
};

export const AI_TOOLS: AITool[] = [
  {
    id: 'ai-followup-assistant',
    slug: 'ai-followup-assistant',
    name: 'AI Follow-up Assistant',
    tagline: 'Siapkan pesan follow-up persuasif tanpa menulis dari nol',
    description:
      'Menganalisis kondisi respon prospek dan menghasilkan draft pesan follow-up yang sopan, solutif, dan relevan dengan alur penawaran bisnis Anda.',
    category: 'sales',
    status: 'coming-soon',
    href: '/ai-tools#followup',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    deliveryType: 'instant',
    badge: 'Prioritas 1',
    useCase: 'Follow-up prospek yang ragu harga, belum balas chat, atau minta perpanjangan waktu.',
    timeSaved: 'Hemat 15 menit per prospek',
    isPriority: true,
  },
  {
    id: 'ai-whatsapp-response',
    slug: 'ai-whatsapp-response',
    name: 'AI WhatsApp Response',
    tagline: 'Draft balasan chat customer instan dan terstruktur',
    description:
      'Menjawab pertanyaan customer seputar harga, jadwal survei, atau spesifikasi layanan dalam format percakapan WhatsApp yang ramah dan profesional.',
    category: 'customer',
    status: 'coming-soon',
    href: '/ai-tools#whatsapp',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    deliveryType: 'instant',
    badge: 'Prioritas 2',
    useCase: 'Menjawab chat customer masuk di luar jam kerja atau saat tim sales sedang sibuk.',
    timeSaved: 'Respon 10x lebih cepat',
    isPriority: true,
  },
  {
    id: 'ai-proposal-generator',
    slug: 'ai-proposal-generator',
    name: 'AI Proposal Generator',
    tagline: 'Susun draft proposal penawaran proyek dalam hitungan detik',
    description:
      'Mengubah poin kesepakatan survei menjadi draft proposal penawaran terstruktur lengkap dengan cakupan pekerjaan, syarat termin, dan estimasi waktu.',
    category: 'sales',
    status: 'coming-soon',
    href: '/ai-tools#proposal',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    deliveryType: 'tool',
    badge: 'Prioritas 3',
    useCase: 'Membuat proposal tender proyek renovasi, desain, atau pengadaan jasa.',
    timeSaved: 'Hemat 2 jam penyusunan proposal',
    isPriority: true,
  },
  {
    id: 'ai-sales-assistant',
    slug: 'ai-sales-assistant',
    name: 'AI Sales Assistant',
    tagline: 'Panduan handling objection & strategi closing',
    description:
      'Memberikan rekomendasi sudut pandang dan argumen persuasif saat prospek membandingkan harga dengan kompetitor atau meminta diskon berlebihan.',
    category: 'sales',
    status: 'coming-soon',
    href: '/ai-tools#sales',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    deliveryType: 'instant',
    badge: 'Prioritas 4',
    useCase: 'Bantuan instan untuk tim sales saat menghadapi negosiasi alot.',
    timeSaved: 'Meningkatkan rasio deal closing',
    isPriority: true,
  },
  {
    id: 'ai-customer-reply',
    slug: 'ai-customer-reply',
    name: 'AI Customer Reply',
    tagline: 'Standardisasi respon komplain & kendala customer',
    description:
      'Membantu merumuskan jawaban yang menenangkan, berempati, dan solutif saat menangani keluhan atau pertanyaan garansi pasca-proyek.',
    category: 'customer',
    status: 'coming-soon',
    href: '/ai-tools#reply',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    deliveryType: 'instant',
    badge: 'Segera Hadir',
    useCase: 'Penanganan keluhan pelanggan agar standar pelayanan tetap konsisten.',
    timeSaved: 'Mencegah eskalasi konflik',
    isPriority: false,
  },
  {
    id: 'ai-meeting-summary',
    slug: 'ai-meeting-summary',
    name: 'AI Meeting Summary',
    tagline: 'Ubah catatan rapat menjadi action items & PIC tim',
    description:
      'Meringkas poin hasil pertemuan dengan klien atau rapat internal proyek menjadi daftar tugas terstruktur dengan penanggung jawab dan tenggat waktu.',
    category: 'business',
    status: 'coming-soon',
    href: '/ai-tools#meeting',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    deliveryType: 'instant',
    badge: 'Segera Hadir',
    useCase: 'Dokumentasi notulensi rapat kickoff proyek dan kesepakatan klien.',
    timeSaved: 'Hemat 30 menit setelah rapat',
    isPriority: false,
  },
  {
    id: 'ai-email-writer',
    slug: 'ai-email-writer',
    name: 'AI Email Writer',
    tagline: 'Tulis email bisnis formal dan penagihan invoice resmi',
    description:
      'Menyusun email formal untuk pengiriman dokumen SPK, penagihan termin invoice, atau permohonan kerja sama vendor dengan tata bahasa profesional.',
    category: 'productivity',
    status: 'coming-soon',
    href: '/ai-tools#email',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    deliveryType: 'instant',
    badge: 'Segera Hadir',
    useCase: 'Komunikasi email resmi B2B dan penagihan termin pembayaran.',
    timeSaved: 'Penulisan email dalam 1 menit',
    isPriority: false,
  },
  {
    id: 'ai-task-planner',
    slug: 'ai-task-planner',
    name: 'AI Task Planner',
    tagline: 'Pecah milestone proyek menjadi checklist harian',
    description:
      'Membantu supervisor memecah tahapan proyek konstruksi/pekerjaan menjadi urutan tugas harian yang terstruktur untuk mandor dan tim pelaksana.',
    category: 'productivity',
    status: 'coming-soon',
    href: '/ai-tools#planner',
    externalUrl: undefined,
    maintenanceLevel: 'low',
    automationLevel: 'assisted',
    deliveryType: 'tool',
    badge: 'Segera Hadir',
    useCase: 'Penyusunan jadwal harian pekerjaan lapangan.',
    timeSaved: 'Perencanaan proyek lebih rapi',
    isPriority: false,
  },
];
