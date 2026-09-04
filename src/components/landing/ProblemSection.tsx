import React from 'react';
import { MessageSquareOff, Receipt, HelpCircle, Users, AlertTriangle } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const problems = [
    {
      icon: MessageSquareOff,
      title: 'Data & Progres Proyek Tersebar di Chat',
      description:
        'Foto progres lapangan, revisi desain, dan laporan harian bercampur di grup WhatsApp. Sulit menelusuri riwayat lama saat terjadi komplain klien.',
    },
    {
      icon: Receipt,
      title: 'Pembelian & Bon Material Sulit Dilacak',
      description:
        'Kwitansi fisik mudah hilang, harga beli antar-supplier tidak tercatat, dan total pengeluaran proyek sering membengkak tanpa disadari sejak awal.',
    },
    {
      icon: HelpCircle,
      title: 'Owner Harus Bertanya Berkali-kali',
      description:
        'Untuk mengetahui posisi pekerjaan hari ini, pemilik bisnis harus menelepon supervisor satu per satu karena tidak ada dashboard terpusat.',
    },
    {
      icon: Users,
      title: 'Koordinasi Tim Lapangan Kurang Terarah',
      description:
        'Penugasan PIC tidak tercatat jelas, tukang menunggu ketersediaan bahan, dan tahapan pekerjaan tertunda karena miskomunikasi antar divisi.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 border-y border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Tantangan Operasional Kontraktor</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Masalahnya Bukan Kurang Kerja.{' '}
            <span className="text-rose-400 block sm:inline">Informasinya yang Tercecer.</span>
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Semakin banyak proyek yang Anda tangani, semakin sulit mengandalkan catatan manual,
            spreadsheet terpisah, atau grup obrolan yang menumpuk setiap hari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-850 bg-slate-950/60 border border-slate-800 hover:border-rose-500/40 hover:shadow-lg transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-rose-400 mb-4 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2 leading-snug">{item.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
