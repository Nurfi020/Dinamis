import React from 'react';
import { ShieldCheck, Lock, UserCheck, FileCheck2 } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'Autentikasi & Validasi Sesi Aman',
      description:
        'Sistem diverifikasi menggunakan kontrol keamanan sesi server-side untuk memastikan setiap akses berasal dari tim yang sah.',
    },
    {
      icon: UserCheck,
      title: 'Isolasi Akses Proyek Ketat',
      description:
        'Sistem membatasi akses setiap pengguna. Pekerja lapangan hanya dapat mengakses proyek yang memang ditugaskan secara resmi oleh manajemen.',
    },
    {
      icon: FileCheck2,
      title: 'Perlindungan Integritas Finansial',
      description:
        'Nilai total pembelian dan harga material dihitung dan diverifikasi secara ketat di sisi server untuk mencegah manipulasi data transaksi.',
    },
    {
      icon: ShieldCheck,
      title: 'Audit Log & Rekam Jejak Persetujuan',
      description:
        'Setiap persetujuan akun, penolakan, serta perubahan status belanja tersimpan dalam catatan aktivitas dengan identitas aktor yang jelas.',
    },
  ];

  return (
    <section id="security" className="py-16 sm:py-24 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Standar Keamanan Terverifikasi</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Data dan Akses Tetap Terkontrol.
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Keamanan data operasional dan privasi klien Anda adalah prioritas utama. Sistem dibangun
            dengan arsitektur proteksi multi-lapis untuk menjaga integritas seluruh transaksi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {securityFeatures.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white mb-1.5">{sec.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{sec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
