'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Calculator,
  Percent,
  Sparkles,
  X,
  Building,
} from 'lucide-react';
import { DemoRABItem, DemoProject } from './types';

interface RABViewProps {
  rabItems: DemoRABItem[];
  projects: DemoProject[];
  onAddRABItem: (item: Omit<DemoRABItem, 'id' | 'subtotal'>) => void;
  onUpdateQuantity: (id: string, qty: number) => void;
  onDeleteRABItem: (id: string) => void;
}

const CATEGORIES = [
  'Pekerjaan Struktur & Dinding',
  'Pekerjaan Plafon & Partisi',
  'Pekerjaan Elektrikal & Lampu',
  'Pekerjaan Lantai & Keramik',
  'Pekerjaan Pintu & Jendela',
  'Pekerjaan Pengecatan & Finishing',
];

const PRESET_TASKS = [
  { cat: 'Pekerjaan Struktur & Dinding', name: 'Pasangan Dinding Bata Ringan 10cm + Plester Aci', unit: 'm²', price: 165000 },
  { cat: 'Pekerjaan Plafon & Partisi', name: 'Plafon Gypsum Board 9mm Rangka Hollow Galvanis', unit: 'm²', price: 140000 },
  { cat: 'Pekerjaan Elektrikal & Lampu', name: 'Instalasi Titik Lampu Downlight LED & Saklar', unit: 'Titik', price: 225000 },
  { cat: 'Pekerjaan Lantai & Keramik', name: 'Pemasangan Granit Tile 60x60cm Glazed Polish', unit: 'm²', price: 285000 },
  { cat: 'Pekerjaan Pintu & Jendela', name: 'Pintu Panel Kayu Kamper Samarinda + Handle Stainless', unit: 'Unit', price: 1850000 },
  { cat: 'Pekerjaan Pengecatan & Finishing', name: 'Pengecatan Dinding Interior Cat Dulux Catylac 3 Lapis', unit: 'm²', price: 42000 },
];

export const RABView: React.FC<RABViewProps> = ({
  rabItems,
  projects,
  onAddRABItem,
  onUpdateQuantity,
  onDeleteRABItem,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'prj-1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [marginPercent, setMarginPercent] = useState<number>(20);

  // Form State
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [taskName, setTaskName] = useState(PRESET_TASKS[0].name);
  const [quantity, setQuantity] = useState<number>(25);
  const [unit, setUnit] = useState(PRESET_TASKS[0].unit);
  const [unitPrice, setUnitPrice] = useState<number>(PRESET_TASKS[0].price);

  const handleSelectPreset = (preset: typeof PRESET_TASKS[0]) => {
    setCategory(preset.cat);
    setTaskName(preset.name);
    setUnit(preset.unit);
    setUnitPrice(preset.price);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRABItem({
      projectId: selectedProjectId,
      category,
      taskName,
      quantity: Number(quantity),
      unit,
      unitPrice: Number(unitPrice),
    });
    setIsAddModalOpen(false);
  };

  // Filter items for current selected project (or fallback to all if single demo project)
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const currentItems = rabItems.filter(
    (r) => r.projectId === selectedProjectId || r.projectId === 'prj-1'
  );

  const subtotalBiayaLangsung = currentItems.reduce((acc, r) => acc + r.subtotal, 0);
  const nilaiMargin = Math.round((subtotalBiayaLangsung * marginPercent) / 100);
  const totalRABPenawaran = subtotalBiayaLangsung + nilaiMargin;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#16A36A]" />
            <h2 className="text-xl font-extrabold text-[#0B3D2E]">Kalkulator & Rencana Anggaran Biaya (RAB)</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
            Susun item pekerjaan, hitung subtotal otomatis, dan tetapkan margin keuntungan proyek.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0B3D2E] text-white text-xs font-bold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Item RAB</span>
        </button>
      </div>

      {/* Project Selector & Summary Bar */}
      <div className="p-5 rounded-2xl bg-white border border-[#E2EAE5] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#64756D]">Pilih Proyek Aktif:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="text-sm font-bold text-[#0B3D2E] bg-[#F7FAF8] border border-[#E2EAE5] rounded-xl px-3 py-1.5 focus:outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} (Klien: {p.clientName})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-right">
            <span className="text-[#64756D]">Margin Keuntungan:</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <input
                type="number"
                min="0"
                max="50"
                value={marginPercent}
                onChange={(e) => setMarginPercent(Number(e.target.value))}
                className="w-16 px-2 py-1 text-center font-bold rounded-lg border border-[#E2EAE5] text-xs"
              />
              <span className="font-bold text-[#0B3D2E]">%</span>
            </div>
          </div>

          <div className="p-3 bg-[#EAF8F1] rounded-2xl border border-[#D1DDD6] text-right">
            <div className="text-[11px] font-bold text-[#64756D]">Total Penawaran RAB:</div>
            <div className="text-lg sm:text-xl font-extrabold text-[#0B3D2E]">
              Rp {totalRABPenawaran.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive RAB Items Table */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7FAF8] text-[#64756D] font-bold border-b border-[#E2EAE5]">
              <tr>
                <th className="py-3.5 px-4">Kategori & Uraian Pekerjaan</th>
                <th className="py-3.5 px-3 w-28 text-center">Volume (Qty)</th>
                <th className="py-3.5 px-3">Satuan</th>
                <th className="py-3.5 px-3 text-right">Harga Satuan</th>
                <th className="py-3.5 px-4 text-right">Subtotal</th>
                <th className="py-3.5 px-3 w-12 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE5]">
              {currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#F7FAF8]/60 transition">
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-mono font-bold text-[#16A36A] block">
                      {item.category}
                    </span>
                    <div className="font-bold text-[#10231B] text-xs mt-0.5">{item.taskName}</div>
                  </td>

                  {/* Quantity Stepper */}
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center border border-[#E2EAE5] rounded-xl overflow-hidden bg-white">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-[#64756D] hover:bg-[#F7FAF8] font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onUpdateQuantity(item.id, Number(e.target.value))}
                        className="w-12 text-center font-bold text-xs py-1 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-[#64756D] hover:bg-[#F7FAF8] font-bold"
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-semibold text-[#64756D]">{item.unit}</td>
                  <td className="py-3 px-3 text-right font-medium text-[#10231B]">
                    Rp {item.unitPrice.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-[#0B3D2E]">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onDeleteRABItem(item.id)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Hapus Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Summary Footer */}
        <div className="p-5 bg-[#F7FAF8] border-t border-[#E2EAE5] space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#64756D]">
            <span>Total Biaya Langsung (Material & Upah Tukang):</span>
            <span className="font-bold text-[#10231B]">
              Rp {subtotalBiayaLangsung.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#64756D]">
            <span>Estimasi Margin / Overhead ({marginPercent}%):</span>
            <span className="font-bold text-[#16A36A]">
              + Rp {nilaiMargin.toLocaleString('id-ID')}
            </span>
          </div>
          <div className="pt-2 border-t border-[#E2EAE5] flex items-center justify-between text-sm font-extrabold text-[#0B3D2E]">
            <span>TOTAL RAB KONTRAK PENAWARAN:</span>
            <span>Rp {totalRABPenawaran.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Modal: Tambah Item RAB */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E2EAE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
              <div className="flex items-center gap-2 text-[#0B3D2E] font-bold text-sm">
                <FileSpreadsheet className="w-4 h-4 text-[#16A36A]" />
                <span>Tambah Item Pekerjaan RAB</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#64756D] hover:bg-[#F7FAF8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#64756D]">Template Item Pekerjaan Cepat:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_TASKS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="p-2 rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] hover:border-[#16A36A] text-left text-[10px] text-[#10231B] truncate transition"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Kategori Pekerjaan</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Uraian Item Pekerjaan</label>
                <input
                  type="text"
                  required
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#10231B]">Quantity (Volume)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#10231B]">Satuan</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#10231B]">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#EAF8F1] rounded-xl text-xs flex items-center justify-between font-bold text-[#0B3D2E]">
                <span>Estimasi Subtotal:</span>
                <span>Rp {(quantity * unitPrice).toLocaleString('id-ID')}</span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E2EAE5]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#64756D] hover:bg-[#F7FAF8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0B3D2E] text-white hover:bg-[#16A36A] transition shadow-xs active:scale-98"
                >
                  Tambahkan ke RAB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
