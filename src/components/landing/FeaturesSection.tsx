import React from 'react';
import {
  FolderKanban,
  ShoppingCart,
  MapPin,
  ShieldCheck,
  History,
  CheckCircle,
  Hammer
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const solutions = [
    {
      icon: FolderKanban,
      title: 'Manajemen Proyek & 7 Tahap Standar',
      subtitle: 'Standarisasi Progres Lapangan',
      description:
        'Pantau setiap proyek melalui 7 tahapan terstruktur: Survei & Pengukuran, Desain 3D, Pengadaan Material, Fabrikasi Workshop, Logistik, Pemasangan, hingga Serah Terima BAST.',
      highlights: [
        'Kalkulasi persentase bobot otomatis',
        'Target tanggal vs progres aktual',
        'Penugasan PIC & tim pelaksana',
      ],
      badge: 'Alur Kerja Standar',
    },
    {
      icon: ShoppingCart,
      title: 'Pengadaan Material & Transaksi Pembelian',
      subtitle: 'Kontrol Anggaran & Validasi Belanja',
      description:
        'Catat kebutuhan material per proyek, harga satuan, nama supplier, dan verifikasi alur persetujuan pembelian mulai dari DRAFT, PENDING, APPROVED, hingga PURCHASED.',
      highlights: [
        'Kalkulasi total nilai belanja otomatis',
        'Pelacakan bon & nomor faktur invoice',
        'Riwayat belanja per kategori material',
      ],
      badge: 'Finansial & Material',
    },
    {
      icon: MapPin,
      title: 'Titik Lokasi & GPS Survei Lapangan',
      subtitle: 'Validasi Lokasi Presisi',
      description:
        'Petakan alamat klien dan catat titik koordinat GPS langsung saat tim melakukan pengukuran lapangan dengan tingkat akurasi meter yang terverifikasi.',
      highlights: [
        'Integrasi tautan Google Maps langsung',
        'Pencatatan metadata akurasi GPS',
        'Pencegahan salah lokasi proyek',
      ],
      badge: 'Survei & Lapangan',
    },
    {
      icon: ShieldCheck,
      title: 'Manajemen Pengguna & Hak Akses (RBAC)',
      subtitle: 'Akses Sesuai Peran dan Tugas',
      description:
        'Pisahkan wewenang antara Owner (visibilitas menyeluruh), Admin Proyek (koordinasi data & pembelian), dan Pekerja Lapangan (fokus pada proyek yang ditugaskan).',
      highlights: [
        'Isolasi data proyek untuk pekerja',
        'Alur persetujuan akses akun baru',
        'Autentikasi aman tanpa kata sandi rumit',
      ],
      badge: 'Kontrol Akses',
    },
    {
      icon: History,
      title: 'Jejak Aktivitas & Audit Operasional',
      subtitle: 'Transparansi & Akuntabilitas Bisnis',
      description:
        'Seluruh pembaruan proyek, pencatatan belanja material, persetujuan akun, dan aksi administratif terekam dalam Activity Log yang rapi dan dapat ditelusuri.',
      highlights: [
        'Riwayat perubahan dengan aktor jelas',
        'Catatan waktu (timestamp) akurat',
        'Membantu evaluasi efisiensi tim',
      ],
      badge: 'Audit Trail',
    },
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <span>Solusi Operasional Terpadu</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Semua Aktivitas Penting,{' '}
            <span className="text-emerald-400">Lebih Mudah Dikendalikan.</span>
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Dirancang khusus untuk kebutuhan riil kontraktor: dari survei awal, belanja bahan di supplier,
            perakitan workshop, hingga serah terima hasil kerja ke pemilik bangunan.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:shadow-xl transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1 leading-snug">{feat.title}</h3>
                  <div className="text-xs font-semibold text-emerald-400 mb-3">{feat.subtitle}</div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">{feat.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2">
                  {feat.highlights.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
