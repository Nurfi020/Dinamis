import React from 'react';
import { UserCheck, FolderPlus, LineChart } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: UserCheck,
      title: 'Masuk & Daftarkan Tim',
      description:
        'Masuk ke portal dengan cepat. Daftarkan Project Manager, Supervisor, Admin, dan Pekerja sesuai tanggung jawabnya.',
    },
    {
      num: '02',
      icon: FolderPlus,
      title: 'Input Proyek & Pengadaan Material',
      description:
        'Catat proyek baru, tetapkan nilai kontrak dan PIC penanggung jawab. Buat daftar kebutuhan material dan ajukan pembelian secara terstruktur.',
    },
    {
      num: '03',
      icon: LineChart,
      title: 'Pantau Progres & Kendalikan Bisnis',
      description:
        'Supervisor memperbarui progres 7 tahap di lapangan, mencatat titik GPS, dan owner memantau seluruh kinerja bisnis tanpa perlu bertanya berkali-kali.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <span>Langkah Sederhana</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Mulai Lebih Mudah dari yang Anda Bayangkan.
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Tidak memerlukan instalasi server rumit atau pelatihan berhari-hari. Sistem langsung siap digunakan
            untuk menata operasional proyek Anda hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:shadow-xl transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-700 font-mono">{st.num}</span>
                  </div>

                  <h3 className="font-bold text-lg sm:text-xl text-white mb-2 leading-snug">{st.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{st.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center text-xs font-bold text-emerald-400">
                  <span>Tahap {idx + 1} Alur Kerja</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
