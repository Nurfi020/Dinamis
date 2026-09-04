import React from 'react';
import { Database, CheckCheck, Landmark, KeyRound, Smartphone } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Database,
      title: 'Informasi Terpusat di Satu Tempat',
      description: 'Hentikan kebiasaan mencari dokumen di obrolan chat atau spreadsheet terpisah.',
    },
    {
      icon: CheckCheck,
      title: 'Koordinasi Lebih Cepat & Terarah',
      description: 'Supervisor dan tim workshop mengetahui urutan tahapan kerja dan progres tanpa salah paham.',
    },
    {
      icon: Landmark,
      title: 'Biaya Material Terkontrol',
      description: 'Kalkulasi otomatis total belanja dan status verifikasi faktur mencegah kebocoran dana.',
    },
    {
      icon: KeyRound,
      title: 'Hak Akses Data Aman Sesuai Peran',
      description: 'Data proyek tersaring otomatis sehingga pekerja fokus pada tugas yang diberikan.',
    },
    {
      icon: Smartphone,
      title: 'Responsif & Nyaman Diakses dari HP',
      description: 'Tim lapangan dapat menginput progres dan titik GPS survei langsung dari browser smartphone.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-950 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <span>Nilai Nyata untuk Bisnis</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bukan Sekadar CRM. <span className="text-emerald-400">Ini Tentang Kontrol.</span>
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Menghilangkan beban administratif yang membuang waktu agar Anda dan tim dapat fokus
            pada kualitas hasil pengerjaan dan kepuasan klien.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((ben, idx) => {
            const Icon = ben.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white mb-2">{ben.title}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{ben.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
