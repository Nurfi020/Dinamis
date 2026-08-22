import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];

const getRelativeDate = (offsetDays: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  return formatDate(d);
};

async function main() {
  console.log('🌱 Memulai proses database seeding...');

  // 1. Clean existing records (in reverse relation order)
  await prisma.followUp.deleteMany({});
  await prisma.lead.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Default Sales User
  const salesUser = await prisma.user.create({
    data: {
      name: 'Budi Sales',
      email: 'budi.sales@perusahaan.co.id',
      phone: '081288991234',
      role: 'Senior Sales Executive',
      monthlyTarget: 20,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  console.log(`✅ User Sales dibuat: ${salesUser.name} (${salesUser.id})`);

  // 3. Create Products
  const products = await Promise.all([
    prisma.product.create({ data: { name: 'Produk A — Starter Plan' } }),
    prisma.product.create({ data: { name: 'Produk B — Pro Business' } }),
    prisma.product.create({ data: { name: 'Produk C — Enterprise Suite' } }),
    prisma.product.create({ data: { name: 'Produk D — Custom Solution' } }),
  ]);

  console.log(`✅ ${products.length} Master Produk berhasil dibuat.`);

  const prodA = products[0].id;
  const prodB = products[1].id;
  const prodC = products[2].id;
  const prodD = products[3].id;

  // 4. Create Initial Leads with FollowUps
  const leadsData = [
    {
      name: 'Budi Santoso',
      phone: '081289123456',
      city: 'Jakarta',
      source: 'WhatsApp',
      productId: prodA,
      status: 'Hot',
      initialNotes: 'Customer menanyakan paket terlengkap dan metode pembayaran cicilan.',
      createdAt: new Date(getRelativeDate(-4)),
      lastFollowUpDate: getRelativeDate(-1),
      nextFollowUpDate: getRelativeDate(0),
      nextFollowUpTime: '09:00',
      followUps: [
        {
          date: getRelativeDate(-4),
          time: '14:20',
          method: 'WhatsApp',
          result: 'Minta Detail',
          notes: 'Inquiry awal masuk dari iklan WhatsApp blast.',
          oldStatus: 'Cold',
          newStatus: 'Warm',
          nextFollowUpDate: getRelativeDate(-2),
          nextFollowUpTime: '10:00',
        },
        {
          date: getRelativeDate(-1),
          time: '15:30',
          method: 'Telepon',
          result: 'Minta Harga',
          notes: 'Sudah dijelaskan perbandingan fitur. Minta proposal resmi untuk bosnya.',
          oldStatus: 'Warm',
          newStatus: 'Hot',
          nextFollowUpDate: getRelativeDate(0),
          nextFollowUpTime: '09:00',
        },
      ],
    },
    {
      name: 'Andi Nugroho',
      phone: '081398765432',
      city: 'Bandung',
      source: 'Facebook',
      productId: prodB,
      status: 'Warm',
      initialNotes: 'Tertarik implementasi untuk kantor cabang Bandung.',
      createdAt: new Date(getRelativeDate(-5)),
      lastFollowUpDate: getRelativeDate(-3),
      nextFollowUpDate: getRelativeDate(0),
      nextFollowUpTime: '13:00',
      followUps: [
        {
          date: getRelativeDate(-3),
          time: '11:00',
          method: 'WhatsApp',
          result: 'Masih Pertimbangkan',
          notes: 'Masih menunggu approval budget direksi akhir bulan ini.',
          oldStatus: 'Cold',
          newStatus: 'Warm',
          nextFollowUpDate: getRelativeDate(0),
          nextFollowUpTime: '13:00',
        },
      ],
    },
    {
      name: 'Siti Rahmawati',
      phone: '082155667788',
      city: 'Surabaya',
      source: 'Instagram',
      productId: prodA,
      status: 'Hot',
      initialNotes: 'Melihat review di Reels Instagram dan butuh secepatnya.',
      createdAt: new Date(getRelativeDate(-3)),
      lastFollowUpDate: getRelativeDate(-2),
      nextFollowUpDate: getRelativeDate(0),
      nextFollowUpTime: '15:00',
      followUps: [
        {
          date: getRelativeDate(-2),
          time: '16:15',
          method: 'WhatsApp',
          result: 'Siap Membeli',
          notes: 'Sudah setuju harga, menunggu pengiriman invoice dan nomor rekening.',
          oldStatus: 'Warm',
          newStatus: 'Hot',
          nextFollowUpDate: getRelativeDate(0),
          nextFollowUpTime: '15:00',
        },
      ],
    },
    {
      name: 'Ahmad Fauzi',
      phone: '085711223344',
      city: 'Semarang',
      source: 'TikTok',
      productId: prodC,
      status: 'Cold',
      initialNotes: 'Klik link bio TikTok, tanya-tanya harga paket basic.',
      createdAt: new Date(getRelativeDate(-6)),
      lastFollowUpDate: getRelativeDate(-4),
      nextFollowUpDate: getRelativeDate(-2), // Terlambat
      nextFollowUpTime: '10:30',
      followUps: [
        {
          date: getRelativeDate(-4),
          time: '09:45',
          method: 'WhatsApp',
          result: 'Tidak Bisa Dihubungi',
          notes: 'Pesan terkirim centang dua tapi belum dibaca.',
          oldStatus: 'Cold',
          newStatus: 'Cold',
          nextFollowUpDate: getRelativeDate(-2),
          nextFollowUpTime: '10:30',
        },
      ],
    },
    {
      name: 'Dewi Lestari',
      phone: '087899001122',
      city: 'Yogyakarta',
      source: 'Referral',
      productId: prodB,
      status: 'Closing',
      initialNotes: 'Rekomendasi dari Pak Hendra (klien loyal).',
      createdAt: new Date(getRelativeDate(-7)),
      lastFollowUpDate: getRelativeDate(-1),
      closedAt: new Date(getRelativeDate(-1)),
      followUps: [
        {
          date: getRelativeDate(-5),
          time: '13:00',
          method: 'Meeting',
          result: 'Tertarik',
          notes: 'Meeting presentasi online, antusias dengan fitur reporting.',
          oldStatus: 'Cold',
          newStatus: 'Hot',
          nextFollowUpDate: getRelativeDate(-1),
        },
        {
          date: getRelativeDate(-1),
          time: '10:00',
          method: 'WhatsApp',
          result: 'Siap Membeli',
          notes: 'Transfer pembayaran lunas telah diterima. Onboarding dimulai.',
          oldStatus: 'Hot',
          newStatus: 'Closing',
        },
      ],
    },
    {
      name: 'Hendra Gunawan',
      phone: '081122334455',
      city: 'Jakarta',
      source: 'Website',
      productId: prodD,
      status: 'Tidak Berhasil',
      lostReason: 'Memilih kompetitor',
      initialNotes: 'Isi form contact us di landing page.',
      createdAt: new Date(getRelativeDate(-10)),
      lastFollowUpDate: getRelativeDate(-6),
      lostAt: new Date(getRelativeDate(-6)),
      followUps: [
        {
          date: getRelativeDate(-6),
          time: '11:20',
          method: 'Telepon',
          result: 'Tidak Tertarik',
          lostReason: 'Memilih kompetitor',
          notes: 'Sudah tanda tangan kontrak dengan vendor lain karena butuh fitur onsite server.',
          oldStatus: 'Warm',
          newStatus: 'Tidak Berhasil',
        },
      ],
    },
    {
      name: 'Rina Permata',
      phone: '081234567890',
      city: 'Surabaya',
      source: 'WhatsApp',
      productId: prodB,
      status: 'Warm',
      initialNotes: 'Tanya promo diskon tahunan untuk tim 15 orang.',
      createdAt: new Date(getRelativeDate(-2)),
      lastFollowUpDate: getRelativeDate(-1),
      nextFollowUpDate: getRelativeDate(2), // Mendatang
      nextFollowUpTime: '14:00',
      followUps: [
        {
          date: getRelativeDate(-1),
          time: '14:00',
          method: 'WhatsApp',
          result: 'Minta Harga',
          notes: 'Quotation promo sudah dikirim, akan dipelajari dengan tim finance.',
          oldStatus: 'Cold',
          newStatus: 'Warm',
          nextFollowUpDate: getRelativeDate(2),
          nextFollowUpTime: '14:00',
        },
      ],
    },
  ];

  for (const item of leadsData) {
    const { followUps, ...leadFields } = item;
    const lead = await prisma.lead.create({
      data: {
        ...leadFields,
        salesId: salesUser.id,
      },
    });

    if (followUps && followUps.length > 0) {
      for (const fu of followUps) {
        await prisma.followUp.create({
          data: {
            ...fu,
            leadId: lead.id,
            salesId: salesUser.id,
          },
        });
      }
    }
  }

  console.log(`✅ ${leadsData.length} Lead dan riwayat follow up berhasil di-seed.`);
  console.log('🎉 Seeding database selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
