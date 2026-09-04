import React from 'react';
import { Briefcase, UserCheck, HardHat, FileSpreadsheet } from 'lucide-react';

export const AudienceSection: React.FC = () => {
  const audiences = [
    {
      icon: Briefcase,
      role: 'Owner & Direktur Bisnis',
      benefit: 'Kontrol Total dari Satu Layar',
      points: [
        'Melihat seluruh portofolio proyek dan nilai kontrak',
        'Memantau realisasi belanja material per proyek',
        'Mengambil keputusan strategis lebih cepat dan tenang',
      ],
    },
    {
      icon: UserCheck,
      role: 'Project Manager & Koordinator',
      benefit: 'Koordinasi Terstruktur & Tepat Waktu',
      points: [
        'Menetapkan PIC dan tim pelaksana per proyek',
        'Menyelaraskan jadwal 7 tahapan standar pekerjaan',
        'Mencegah keterlambatan serah terima pekerjaan (BAST)',
      ],
    },
    {
      icon: HardHat,
      role: 'Site Supervisor & Mandor Lapangan',
      benefit: 'Update Lapangan Praktis dari Ponsel',
      points: [
        'Memperbarui progres tahapan langsung di lokasi',
        'Mencatat titik koordinat GPS hasil survei akurat',
        'Melihat spesifikasi dan rincian pekerjaan yang ditugaskan',
      ],
    },
    {
      icon: FileSpreadsheet,
      role: 'Admin Proyek & Tim Purchasing',
      benefit: 'Tertib Administrasi & Belanja Bahan',
      points: [
        'Mencatat transaksi pembelian material dan supplier',
        'Menyimpan nomor bon, nota faktur, dan bukti belanja',
        'Menjaga master data material dan harga satuan terbaru',
      ],
    },
  ];

  return (
    <section id="audience" className="py-16 sm:py-24 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold border border-slate-700">
            <span>Peran Pengguna</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dibuat untuk Bisnis Kontraktor yang Ingin Lebih Teratur.
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Setiap orang di perusahaan memiliki tanggung jawab berbeda. Contractor CRM memberikan antarmuka
            dan hak akses yang disesuaikan dengan kebutuhan peran masing-masing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:shadow-xl transition duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 mb-4 shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1 leading-snug">{aud.role}</h3>
                  <div className="text-xs font-semibold text-emerald-400 mb-4">{aud.benefit}</div>

                  <ul className="space-y-2.5">
                    {aud.points.map((pt, pIdx) => (
                      <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
