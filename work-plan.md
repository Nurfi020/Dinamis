# Work Plan & Checklist Komprehensif: Aplikasi Kelola Lead Sales CRM

Dokumen master rencana kerja ini merinci seluruh tahapan pengerjaan, spesifikasi fitur per menu, arsitektur database, API route contracts, aturan bisnis, pedoman UI/UX responsif, serta skenario pengujian menyeluruh untuk aplikasi **Kelola Lead Sales**.

---

## 🏗️ 1. Ringkasan Arsitektur & Spesifikasi Proyek

* **Framework Fullstack:** Next.js 15 (App Router) + TypeScript
* **ORM & Database:** Prisma ORM dengan PostgreSQL (Supabase Shared Pooler) / fallback SQLite lokal
* **Styling & Design System:** Tailwind CSS / CSS Variables modern dengan tema aksen **Neon Blue (`#00D2FF` / `#0ea5e9`)**, Glassmorphism halus, tipografi Google Font `Inter`, dan mode kontras tinggi yang nyaman di mata
* **Prinsip UX Utama:** *"Perbanyak Klik/Pilihan, Minimalkan Mengetik Manual"* (menggunakan button chip, dropdown, date picker, dan auto-formatting nomor WhatsApp)
* **Pengguna Utama:** Sales Executive (MVP difokuskan pada kecepatan input harian dan monitoring tindak lanjut)

---

## 📋 2. Matriks Rincian Menu & Fitur Lengkap

### 🏠 Menu 1: Dashboard (Pusat Kendali & Ringkasan Performa)
- [x] **Header Sambutan & Quick Action:**
  - [x] Greeting personal ("Halo, [Nama Sales] 👋") dengan indikator target bulanan (progress bar capaian closing vs target).
  - [x] Tombol cepat `+ Tambah Lead Baru` yang membuka modal input.
- [x] **5 Kartu Statistik Utama (Stat Cards):**
  - [x] **Total Lead:** Total seluruh lead aktif & historis yang tercatat di database.
  - [x] **Lead Baru:** Lead yang baru didaftarkan dalam 7 hari terakhir.
  - [x] **Perlu Follow Up:** Total lead yang memiliki jadwal follow up terlambat (*overdue*) atau dijadwalkan untuk hari ini.
  - [x] **Lead Hot:** Total calon pelanggan dengan probabilitas konversi tertinggi saat ini.
  - [x] **Closing:** Total penjualan/transaksi berhasil beserta persentase kontribusinya.
- [x] **Visualisasi Data & Grafik Interaktif:**
  - [x] **Grafik Perkembangan Lead:** Tren masuknya lead baru & capaian closing (mingguan / harian).
  - [x] **Distribusi Status (Donut Chart):** Porsi persentase Cold, Warm, Hot, Closing, dan Tidak Berhasil.
  - [x] **Peringkat Sumber Lead (Horizontal Bar Chart):** Efektivitas kanal akuisisi (WhatsApp, Instagram, Facebook, TikTok, Website, Referral, Marketplace, Lainnya).
  - [x] **Performa Closing:** Rasio konversi berdasarkan kategori produk dan sumber.
- [x] **Widget "Follow Up Hari Ini":**
  - [x] Daftar lead yang harus dihubungi hari ini dilengkapi: Nama, Produk, Kota, Badge Status, dan Jam Rencana Kontak.
  - [x] Tombol Aksi Cepat: **Chat WhatsApp Langsung** (`wa.me/628...`) & **Catat Hasil Follow Up**.
  - [x] Empty state yang rapi jika tidak ada jadwal kontak untuk hari ini.

---

### 👥 Menu 2: Semua Lead (Manajemen & Direktori Calon Pelanggan)
- [x] **Tampilan Adaptif Desktop & Mobile:**
  - [x] **Desktop:** Tampilan tabel terstruktur dengan kolom: Nama Lead, Kota, Produk Pilihan, Status Peluang, Terakhir Dihubungi, Jadwal Berikutnya, dan Tombol Aksi.
  - [x] **Mobile:** Tampilan kartu interaktif (*touch-friendly cards*) dengan hierarki visual: Nama → Status Badge → Produk/Kota → Follow Up Terakhir.
- [x] **Pencarian Cepat (Real-time Search):**
  - [x] Pencarian instan berdasarkan Nama Calon Pelanggan.
  - [x] Pencarian instan berdasarkan Nomor WhatsApp/Telepon.
- [x] **Multi-Filter Fleksibel:**
  - [x] Filter berdasarkan **Status Peluang** (Semua, Cold, Warm, Hot, Closing, Tidak Berhasil).
  - [x] Filter berdasarkan **Kota Domisili** (Semua Kota atau kota spesifik).
  - [x] Filter berdasarkan **Pilihan Produk** (Semua Produk atau per SKU).
  - [x] Filter berdasarkan **Sumber Lead** (WhatsApp, Ads, IG, TikTok, Website, Referral, Marketplace, dll.).
  - [x] Filter berdasarkan **Rentang Periode Tanggal** (Hari Ini, 7 Hari Terakhir, 30 Hari Terakhir, Bulan Ini, Semua).
- [x] **Pengurutan (Sorting):**
  - [x] Terdaftar Terbaru (Default).
  - [x] Terdaftar Terlama.
  - [x] Jadwal Follow Up Terdekat.
  - [x] Jadwal Follow Up Terlambat.
  - [x] Urutan Abjad Nama (A - Z).
- [x] **Aksi Langsung pada Daftar Lead:**
  - [x] Klik baris/kartu membuka halaman **Detail Lead**.
  - [x] Tombol ikon WhatsApp hijau untuk membuka percakapan WA secara langsung dengan nomor yang telah ternormalisasi.
  - [x] Tombol hapus (*soft delete*) dengan dialog konfirmasi aman.

---

### ➕ Menu 3: Tambah Lead (Form Input Cepat & Ergonomis)
- [x] **Desain Form Berbasis Pilihan (Minim Ketik):**
  - [x] **Nama Lengkap:** Input teks dengan placeholder informatif.
  - [x] **Nomor WhatsApp:** Input nomor dengan auto-prefix `+62` atau `08...` yang dinormalisasi otomatis ke `628xxxxxxxx`.
  - [x] **Kota Domisili:** Pilihan dropdown / pill selector kota-kota populer (Jakarta, Surabaya, Bandung, Medan, Semarang, Yogyakarta, dll.) + opsi input kota baru.
  - [x] **Sumber Informasi:** Chip selector interaktif (WhatsApp, Facebook, Instagram, TikTok, Website, Referral, Marketplace, Lainnya).
  - [x] **Pilihan Produk:** Dropdown/radio chip master produk aktif.
  - [x] **Status Awal:** Tombol pill khusus tingkat peluang: **Cold (Biru)**, **Warm (Kuning)**, **Hot (Merah)**. *(Status Closing/Tidak Berhasil tidak dapat dipilih saat pembuatan awal)*.
  - [x] **Catatan Kebutuhan Awal:** Textarea opsional untuk preferensi atau pertanyaan awal customer.
  - [x] **Jadwal Follow Up Pertama:** Date picker tanggal + time picker jam kontak yang disarankan.
- [x] **Validasi & Proteksi:**
  - [x] Validasi Zod di sisi client dan server (nomor WA wajib valid minimal 9 digit angka).
  - [x] Notifikasi Toast sukses/gagal yang intuitif.

---

### 🔍 Menu 4: Detail Lead (Profil Calon Pelanggan & Log Timeline)
- [x] **Header Informasi & Profil Pelanggan:**
  - [x] Nama pelanggan, nomor WhatsApp dengan tombol panggil/chat langsung.
  - [x] Badge status dinamis dengan warna spesifik (Cold=Biru, Warm=Kuning, Hot=Merah, Closing=Hijau, Tidak Berhasil=Abu-abu).
  - [x] Ringkasan metadata: Kota Domisili, Produk Diminati, Sumber Lead, Tanggal Masuk.
- [x] **Action Bar Cepat:**
  - [x] Tombol **"Hubungi WhatsApp"** (membuka `https://wa.me/628...`).
  - [x] Tombol **"Catat Follow Up"** (membuka modal log interaksi).
  - [x] Tombol **"Edit Data Lead"** untuk memperbarui profil/produk/kota.
  - [x] Tombol **"Reopen Lead"** (khusus lead berstatus *Tidak Berhasil* untuk mengaktifkan kembali ke *Warm*/*Hot*).
  - [x] Tombol **"Hapus Lead"** (soft delete).
- [x] **Kotak Jadwal Follow Up Aktif:**
  - [x] Menampilkan tanggal dan jam follow up berikutnya.
  - [x] Indikator badge: *Terlambat* (merah), *Hari Ini* (kuning/neon), atau *Mendatang* (abu-abu/biru).
  - [x] Kotak otomatis disembunyikan jika status sudah mencapai *Closing* atau *Tidak Berhasil*.
- [x] **Timeline Riwayat Follow Up (Integritas Append-Only):**
  - [x] Daftar kronologis seluruh interaksi dari yang terbaru ke terlama.
  - [x] Informasi per riwayat:
    - Tanggal & Waktu follow up dilakukan.
    - Metode Komunikasi (WhatsApp, Telepon, Meeting Tatap Muka, Email, Lainnya).
    - Hasil Interaksi (Tertarik, Minta Harga, Minta Detail, Masih Pertimbangkan, Siap Membeli, Menolak, Tidak Dapat Dihubungi, dll.).
    - Catatan detail percakapan.
    - Perubahan Status (*Old Status* ➔ *New Status*).
    - Alasan Kegagalan (jika status berubah menjadi *Tidak Berhasil*).
  - [x] Proteksi keamanan: Riwayat log tidak boleh diedit atau dihapus untuk menjaga riwayat audit penjualan.

---

### 📅 Menu 5: Follow Up (Manajemen Jadwal & Log Aktivitas)
- [x] **3 Tab Pengelompokan Jadwal:**
  - [x] **Tab 1: Terlambat (Overdue):** Lead yang jadwal follow up-nya sebelum hari ini dan belum ditindaklanjuti (diberi tanda peringatan merah).
  - [x] **Tab 2: Hari Ini (Today):** Lead yang dijadwalkan untuk dihubungi pada tanggal hari ini.
  - [x] **Tab 3: Mendatang (Upcoming):** Lead dengan rencana follow up di hari-hari berikutnya.
- [x] **Kartu Tindak Lanjut Ringkas:**
  - [x] Nama Customer, Nomor WA, Produk, Kota, dan Status Saat Ini.
  - [x] Jam rencana follow up.
  - [x] Catatan/konteks follow up sebelumnya.
- [x] **Modal Pencatatan Follow Up (Log Follow Up Modal):**
  - [x] **Metode Komunikasi:** Pilihan tombol chip (WhatsApp, Telepon, Meeting, Email, Lainnya).
  - [x] **Hasil Komunikasi:** Dropdown respons calon pelanggan.
  - [x] **Catatan Hasil:** Rangkuman kesepakatan atau poin penting diskusi.
  - [x] **Perbarui Status Lead:** Pilihan status terbaru (Cold, Warm, Hot, Closing, Tidak Berhasil).
  - [x] **Form Alasan Khusus (Conditional):** Jika status dipilih *Tidak Berhasil*, wajib memilih alasan (Harga terlalu mahal, Memilih kompetitor, Tidak butuh produk, Tidak bisa dihubungi, Nomor salah, Lainnya).
  - [x] **Jadwal Follow Up Berikutnya:** Date & time picker (wajib jika status masih Cold/Warm/Hot; otomatis nonaktif jika Closing/Tidak Berhasil).
  - [x] **Efek Closing:** Trigger animasi confetti/celebration saat berhasil closing.

---

### 📈 Menu 6: Laporan & Analitik (Reports & Performance)
- [x] **Ringkasan Indikator Kinerja:**
  - [x] Total Lead Terdaftar pada periode terpilih.
  - [x] Rincian status: Jumlah Cold, Warm, Hot, Closing, dan Tidak Berhasil.
  - [x] **Tingkat Konversi (Conversion Rate):** Dihitung otomatis dengan formula baku $\frac{\text{Jumlah Closing}}{\text{Total Lead}} \times 100\%$.
- [x] **Filter Laporan Komprehensif:**
  - [x] Filter Rentang Tanggal (Semua, Bulan Ini, Bulan Lalu, 30 Hari Terakhir, Custom Range).
  - [x] Filter Produk, Sumber Lead, dan Kota.
- [x] **Matriks Analisis & Breakdown:**
  - [x] **Analisis Saluran Akuisisi (Lead per Sumber):** Jumlah lead & rasio closing per kanal.
  - [x] **Analisis Produk (Lead per Produk):** Produk paling diminati dan persentase closing tertinggi.
  - [x] **Analisis Geografis (Lead per Kota):** Sebaran kota calon pelanggan dengan daya beli terbaik.
  - [x] **Analisis Alasan Kehilangan (Lost Reason Breakdown):** Faktor utama penyebab lead tidak berhasil closing.
- [x] **Fitur Export Data:**
  - [x] **Export CSV/Excel:** Download data terstruktur untuk analisis lanjutan di spreadsheet.
  - [x] **Cetak / Export PDF:** Tampilan laporan formal siap cetak dengan layout rapi dan watermark profil sales.

---

### ⚙️ Menu 7: Pengaturan / Profil Sales (Settings & Demo Reset)
- [x] **Informasi Profil Sales:**
  - [x] Form edit Nama Lengkap Sales, Alamat Email, Nomor WhatsApp, dan Jabatan/Role.
  - [x] Konfigurasi **Target Closing Bulanan** (misal: 20 closing/bulan).
  - [x] Visualisasi capaian target aktual bulan berjalan vs target yang ditetapkan.
- [x] **Manajemen Demo Data:**
  - [x] Tombol **"Reset Data Demo"** dengan dialog konfirmasi ganda untuk mengembalikan seluruh database ke data seeder awal yang bersih.
- [x] **Pusat Bantuan & Panduan Cepat:**
  - [x] Modal panduan alur kerja sales CRM, arti badge status, dan tips follow up efektif.

---

### 📱 Menu 8: Layout Navigasi & Responsivitas Antarmuka
- [x] **Desktop Sidebar (Kiri):**
  - [x] Logo dan nama aplikasi "Kelola Lead Sales" dengan aksen neon.
  - [x] Menu items: Dashboard, Semua Lead, Tambah Lead, Follow Up, Laporan, Pengaturan.
  - [x] Badge counter dinamis untuk jumlah follow up hari ini/terlambat.
  - [x] Mini profil sales di bagian bawah sidebar.
- [x] **Mobile Navigation:**
  - [x] Header atas: Logo ringkas + tombol notifikasi/profil.
  - [x] **Bottom Navigation Bar (Bawah):** 5 tombol utama (*Dashboard, Semua Lead, + Tambah Lead (Tombol Tengah Menonjol), Follow Up, Laporan*).
- [x] **Kepatuhan UI Guideline:**
  - [x] Zero horizontal scrolling pada semua ukuran layar (Mobile 360px hingga Desktop 4K).
  - [x] Menggunakan font modern `Inter` dengan hierarki ukuran judul, subjudul, dan metadata yang proporsional.

---

## 🗄️ 3. Spesifikasi Skema Database (Prisma ORM)

```prisma
// datasource db { provider = "postgresql", url = env("DATABASE_URL"), directUrl = env("DIRECT_URL") }

model User {
  id            String      @id @default(uuid())
  name          String
  email         String      @unique
  phone         String
  role          String      @default("Senior Sales Executive")
  monthlyTarget Int         @default(20)
  passwordHash  String?
  leads         Lead[]
  followUps     FollowUp[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Product {
  id        String   @id @default(uuid())
  name      String
  isActive  Boolean  @default(true)
  leads     Lead[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Lead {
  id                String      @id @default(uuid())
  salesId           String
  sales             User        @relation(fields: [salesId], references: [id])
  name              String
  phone             String
  city              String
  source            String
  productId         String
  product           Product     @relation(fields: [productId], references: [id])
  status            String      @default("Cold") // Cold, Warm, Hot, Closing, Tidak Berhasil
  initialNotes      String?
  lostReason        String?     // Harga terlalu mahal, Memilih kompetitor, Tidak membutuhkan produk, dll.
  lastFollowUpDate  String?     // YYYY-MM-DD
  nextFollowUpDate  String?     // YYYY-MM-DD
  nextFollowUpTime  String?     // HH:mm
  closedAt          DateTime?
  lostAt            DateTime?
  isDeleted         Boolean     @default(false)
  followUps         FollowUp[]
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  @@index([status, isDeleted])
  @@index([nextFollowUpDate])
  @@index([city])
  @@index([source])
}

model FollowUp {
  id                String    @id @default(uuid())
  leadId            String
  lead              Lead      @relation(fields: [leadId], references: [id], onDelete: Cascade)
  salesId           String
  sales             User      @relation(fields: [salesId], references: [id])
  date              String    // YYYY-MM-DD
  time              String    // HH:mm
  method            String    // WhatsApp, Telepon, Meeting, Email, Lainnya
  result            String    // Tertarik, Minta Harga, Minta Detail, Masih Pertimbangkan, Siap Membeli, dll.
  notes             String?
  oldStatus         String?
  newStatus         String
  lostReason        String?
  nextFollowUpDate  String?
  nextFollowUpTime  String?
  createdAt         DateTime  @default(now())

  @@index([leadId])
}
```

---

## 🌐 4. Spesifikasi Kontrak API Route Handlers (Next.js)

| Method | Endpoint | Deskripsi & Query Params | Validasi & Respons |
|:---|:---|:---|:---|
| `GET` | `/api/profile` | Mengambil data profil sales & target bulanan | Returns `200 OK` (User object + metrics) |
| `PUT` | `/api/profile` | Update nama, email, no WA, target bulanan | Body: `updateProfileSchema` ➔ `200 OK` |
| `POST` | `/api/profile/reset` | Mereset seluruh database ke demo seed | Returns `200 OK` + message |
| `GET` | `/api/products` | Mengambil daftar master produk aktif | Returns `200 OK` (Array of Products) |
| `GET` | `/api/cities` | Mengambil daftar nama kota yang ada di sistem | Returns `200 OK` (Array of Strings) |
| `GET` | `/api/leads` | List lead: `?search=&status=&city=&product=&source=&period=&sortBy=` | Returns `200 OK` (Filtered Leads array) |
| `POST` | `/api/leads` | Tambah lead baru | Body: `createLeadSchema` ➔ Returns `201 Created` |
| `GET` | `/api/leads/[id]` | Ambil detail lead lengkap + relasi riwayat follow up | Returns `200 OK` / `404 Not Found` |
| `PUT` | `/api/leads/[id]` | Edit informasi profil lead | Body: `updateLeadSchema` ➔ Returns `200 OK` |
| `DELETE` | `/api/leads/[id]` | Soft delete lead (`isDeleted = true`) | Returns `200 OK` |
| `POST` | `/api/leads/[id]/follow-ups` | Catat follow up baru & mutasi status lead atomik | Body: `followUpLogSchema` ➔ Returns `201 Created` |
| `GET` | `/api/follow-ups/summary` | Ambil lead yang dikelompokkan: Overdue, Today, Upcoming | Returns `200 OK` (`{ overdue, today, upcoming }`) |
| `GET` | `/api/reports/dashboard` | Ambil 5 metrik kartu, grafik tren, donut status, ranking sumber | Returns `200 OK` (Dashboard metrics object) |
| `GET` | `/api/reports/performance` | Ambil konversi closing, breakdown sumber/produk/kota, export data | Returns `200 OK` (Performance metrics object) |
| `POST` | `/api/license/activate` | Aktivasi License Key Lifetime + Device Binding (1 User 1 Device) | Body: `{ licenseKey, deviceId, ... }` ➔ `200 OK` / `400` / `409` |
| `POST` | `/api/license/verify` | Verifikasi token aktivasi dan device binding | Body: `{ activationToken, deviceId }` ➔ `200 OK` / `401` / `403` |
| `POST` | `/api/license/validate` | Validasi lisensi fleksibel (Header/Body) | Returns `200 OK` (Valid status + License info) |
| `POST` | `/api/license/deactivate` | Pelepasan ikatan perangkat (Reset Perangkat) | Body: `{ activationToken, deviceId }` ➔ `200 OK` |
| `GET` | `/api/license/status` | Info status layanan lisensi | Returns `200 OK` |
| `GET` | `/api/license/admin/list` | Admin: Direktori lisensi & perangkat terikat | Returns `200 OK` (Array of licenses + device info) |
| `POST` | `/api/license/admin/create` | Admin: Generate License Key Lifetime baru | Body: `{ notes }` ➔ `200 OK` + Key |
| `POST` | `/api/license/admin/reset-device` | Admin: Reset ikatan perangkat untuk lisensi | Body: `{ licenseId }` ➔ `200 OK` |
| `POST` | `/api/license/admin/status` | Admin: Update status lisensi (active, suspended, revoked) | Body: `{ licenseId, status }` ➔ `200 OK` |

---

## 🔐 5. Spesifikasi Sistem License Key Lifetime (1 User, 1 Device)

* **Format Kunci Standar:** `KLDN-LIFE-XXXX-XXXX-XXXX`
* **Keamanan Server-Side:**
  - Hashing HMAC SHA-256 server-side dengan `SERVER_SECRET` (key asli tidak disimpan plaintext di database).
  - Rate limiting (sliding window) pada endpoint `/api/license/activate` untuk mencegah brute force.
  - Kebijakan 1 Perangkat: Lisensi yang sudah aktif tidak dapat diaktifkan di perangkat lain sebelum dilakukan Reset Perangkat.
  - Mode Offline Grace Period: Akses offline hingga 7 hari sebelum mewajibkan sinkronisasi ulang ke server.

---

## 🧪 6. Skenario Pengujian Kualitas (Testing & Verification)

- [x] **Test Case 1: Alur Siklus Penuh Lead Menuju Closing**
  - [x] Input lead baru status Cold dengan jadwal follow up esok hari.
  - [x] Verifikasi lead muncul di Dashboard, Semua Lead, dan Tab Jadwal Mendatang.
  - [x] Klik aksi Chat WhatsApp ➔ format link terbuka ke `wa.me/628...`.
  - [x] Catat follow up pertama ➔ ubah status Cold ➔ Warm.
  - [x] Catat follow up kedua ➔ ubah status Warm ➔ Hot.
  - [x] Catat follow up ketiga ➔ ubah status Hot ➔ Closing (verifikasi confetti muncul, target sales bertambah, dan jadwal follow up dinonaktifkan).
  - [x] Periksa halaman Detail Lead ➔ pastikan 3 timeline log tercatat secara kronologis.

- [x] **Test Case 2: Alur Siklus Tidak Berhasil & Reopen Lead**
  - [x] Catat follow up pada lead Warm ➔ pilih status *Tidak Berhasil*.
  - [x] Verifikasi sistem meminta alasan wajib (misal: "Harga terlalu mahal").
  - [x] Verifikasi status berubah menjadi abu-abu dan jadwal kontak aktif dihapus.
  - [x] Klik tombol **"Buka Kembali / Reopen"** ➔ pilih status baru Hot.
  - [x] Verifikasi lead aktif kembali dan log pembukaan kembali tercatat di riwayat timeline.

- [x] **Test Case 3: Filter, Pencarian & Pengurutan Multi-kategori**
  - [x] Pengujian kombinasi filter (Status = Hot + Kota = Jakarta + Produk = Pro).
  - [x] Pengujian search keyword nama parsial dan digit nomor telepon.
  - [x] Pengujian sorting jadwal terdekat vs terlambat.

- [x] **Test Case 4: Akurasi Formula Laporan & Fitur Export**
  - [x] Verifikasi kalkulasi formula konversi: $\frac{\text{Closing}}{\text{Total Lead}} \times 100\%$ selalu presisi.
  - [x] Uji tombol **Download CSV** ➔ file `.csv` terdownload dengan encoding UTF-8 dan format rapi.
  - [x] Uji tombol **Cetak / PDF** ➔ dialog print browser terbuka dengan tampilan cetak terformat bersih tanpa elemen navigasi.

- [x] **Test Case 5: Reset Demo Data & Responsivitas Layar**
  - [x] Klik reset data demo di menu Pengaturan ➔ database kembali ke kondisi 10 lead awal seeder.
  - [x] Uji tampilan pada viewport Mobile (375px), Tablet (768px), dan Desktop (1440px) ➔ pastikan bebas scroll horizontal dan bottom nav mobile berfungsi responsif.

- [x] **Test Case 6: Sistem Lisensi Lifetime (1 User 1 Device)**
  - [x] Saat aplikasi pertama kali dibuka tanpa lisensi ➔ layar aktivasi lisensi muncul otomatis.
  - [x] Memasukkan Test Key `KLDN-LIFE-TEST-TEST-0001` ➔ validasi server berhasil dan dashboard terbuka.
  - [x] Membuka menu Pengaturan & Profil ➔ informasi status lisensi lifetime, masking key, perangkat terikat, dan verifikasi terakhir tampil lengkap.
  - [x] Menekan tombol Reset Perangkat ➔ ikatan perangkat dilepaskan dan kembali ke layar aktivasi tanpa menghapus data lead lokal.
  - [x] Admin License Key Manager ➔ dapat membuat key baru, melihat daftar key, dan mereset status lisensi secara instan.

---

Dokumen ini disimpan di:
- `source-code/work-plan.md`
- `step-backend.md`
- `work-plan.md` (Root Workspace)
