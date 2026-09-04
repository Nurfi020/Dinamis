'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Calendar,
  Building2
} from 'lucide-react';

export const ProductShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'stages' | 'purchases'>('dashboard');

  return (
    <section id="preview" className="py-16 sm:py-24 bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold border border-slate-700">
            <span>Antarmuka Asli</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Lihat Kondisi Proyek Tanpa Membuka Banyak File.
          </h2>

          <p className="text-base text-slate-300 leading-relaxed">
            Semua data tersinkronisasi secara langsung. Setiap anggota tim mengisi progres sesuai tugasnya,
            dan dashboard menampilkan informasi yang selalu relevan.
          </p>

          {/* Screen Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>1. Dashboard Operasional</span>
            </button>

            <button
              onClick={() => setActiveTab('stages')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeTab === 'stages'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2. 7 Tahap Proyek & QC</span>
            </button>

            <button
              onClick={() => setActiveTab('purchases')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeTab === 'purchases'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>3. Pembelian & Bon Material</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 p-4 sm:p-8 shadow-2xl">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <h4 className="font-extrabold text-lg text-white">Ringkasan Eksekutif Operasional</h4>
                  <p className="text-xs text-slate-400">Visibilitas penuh portofolio proyek dan arus material</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Calendar className="w-4 h-4" />
                  <span>Periode Aktif 2026</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Total Nilai Kontrak Proyek</span>
                  <div className="text-2xl font-black text-white">Rp 425.000.000</div>
                  <span className="text-[11px] text-emerald-400 font-bold">5 Proyek Aktif Berjalan</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Realisasi Belanja Material</span>
                  <div className="text-2xl font-black text-teal-400">Rp 148.500.000</div>
                  <span className="text-[11px] text-slate-400">Rasio 34.9% dari total kontrak</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Rata-rata Progres Lapangan</span>
                  <div className="text-2xl font-black text-emerald-400">68.4%</div>
                  <span className="text-[11px] text-emerald-400 font-bold">+4.2% minggu ini</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="font-bold text-sm text-white">Status Terkini Proyek Aktif</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/80">
                    <div>
                      <span className="font-bold text-white">PRJ-014 — Interior Kitchen Set Dago</span>
                      <div className="text-[10px] text-slate-400">PIC: Budi Santoso · Target: 15 Sep 2026</div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Tahap 6: Pemasangan (75%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-800/80">
                    <div>
                      <span className="font-bold text-white">PRJ-015 — Renovasi Ruko Cafe Setiabudi</span>
                      <div className="text-[10px] text-slate-400">PIC: Agus Prayitno · Target: 30 Sep 2026</div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Tahap 4: Produksi (45%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STAGES */}
          {activeTab === 'stages' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <h4 className="font-extrabold text-lg text-white">
                    PRJ-014 — Interior Kitchen Set & Wardrobe Dago
                  </h4>
                  <p className="text-xs text-slate-400">Standar 7 Tahap Pekerjaan & Bobot Nilai Progres</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60 self-start sm:self-auto">
                  Total Progres: 75%
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { seq: 1, name: '1. Survey & Pengukuran Detail Lokasi', weight: '10%', status: 'selesai' },
                  { seq: 2, name: '2. Gambar Kerja & Desain Produksi 3D', weight: '15%', status: 'selesai' },
                  { seq: 3, name: '3. Pemilihan & Pengadaan Material', weight: '15%', status: 'selesai' },
                  { seq: 4, name: '4. Fabrikasi & Perakitan Workshop', weight: '25%', status: 'selesai' },
                  { seq: 5, name: '5. Pengiriman & Logistik Lapangan', weight: '10%', status: 'selesai' },
                  { seq: 6, name: '6. Pemasangan & Setting di Lokasi', weight: '15%', status: 'berjalan' },
                  { seq: 7, name: '7. Finishing Akhir, QC & Serah Terima BAST', weight: '10%', status: 'belum' },
                ].map((st) => (
                  <div
                    key={st.seq}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {st.status === 'selesai' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {st.status === 'berjalan' && <Clock className="w-5 h-5 text-amber-400 animate-spin" />}
                      {st.status === 'belum' && <div className="w-5 h-5 rounded-full border-2 border-slate-700" />}
                      <div>
                        <div className="font-bold text-white">{st.name}</div>
                        <div className="text-[10px] text-slate-400">Bobot tahapan: {st.weight}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        st.status === 'selesai'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : st.status === 'berjalan'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {st.status === 'selesai' ? 'Selesai 100%' : st.status === 'berjalan' ? 'Sedang Dikerjakan' : 'Belum Mulai'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PURCHASES */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div>
                  <h4 className="font-extrabold text-lg text-white">Daftar Pembelian & Pengadaan Material</h4>
                  <p className="text-xs text-slate-400">Verifikasi transaksi belanja per proyek</p>
                </div>
                <div className="text-xs font-bold text-emerald-400">Total: Rp 14.750.000 (4 Item)</div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                  <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
                    <tr>
                      <th className="p-3 font-bold">Material & Supplier</th>
                      <th className="p-3 font-bold">Proyek</th>
                      <th className="p-3 font-bold">Volume</th>
                      <th className="p-3 font-bold">Harga Satuan</th>
                      <th className="p-3 font-bold">Total Nilai</th>
                      <th className="p-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="p-3 font-bold text-white">
                        HPL Taco Solid Walnut
                        <div className="text-[10px] text-slate-400 font-normal">Supplier: Toko HPL Jaya</div>
                      </td>
                      <td className="p-3 text-slate-300">PRJ-014 Dago</td>
                      <td className="p-3 text-slate-300">15 lembar</td>
                      <td className="p-3 text-slate-300">Rp 210.000</td>
                      <td className="p-3 font-bold text-emerald-400">Rp 3.150.000</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          PURCHASED
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">
                        Multiplek 18mm Palem
                        <div className="text-[10px] text-slate-400 font-normal">Supplier: CV Kayu Makmur</div>
                      </td>
                      <td className="p-3 text-slate-300">PRJ-014 Dago</td>
                      <td className="p-3 text-slate-300">20 lembar</td>
                      <td className="p-3 text-slate-300">Rp 245.000</td>
                      <td className="p-3 font-bold text-emerald-400">Rp 4.900.000</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          PURCHASED
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">
                        Engsel Slow Motion Soft-Close
                        <div className="text-[10px] text-slate-400 font-normal">Supplier: Hardware Teknik</div>
                      </td>
                      <td className="p-3 text-slate-300">PRJ-015 Setiabudi</td>
                      <td className="p-3 text-slate-300">50 pasang</td>
                      <td className="p-3 text-slate-300">Rp 45.000</td>
                      <td className="p-3 font-bold text-teal-300">Rp 2.250.000</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60">
                          APPROVED
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
