'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  DollarSign,
  Building,
  X,
  Sparkles,
} from 'lucide-react';
import { DemoMaterial, DemoProject, MaterialStatus } from './types';

interface MaterialViewProps {
  materials: DemoMaterial[];
  projects: DemoProject[];
  onAddMaterial: (mat: Omit<DemoMaterial, 'id'>) => void;
  onUpdateStatus: (id: string, status: MaterialStatus, actualCost?: number) => void;
}

const MATERIAL_CATEGORIES = [
  'Bahan Utama (Semen, Pasir, Batu)',
  'Bahan Struktur (Besi Beton, Wiremesh)',
  'Dinding (Bata Ringan, Hebel, Semen Instan)',
  'Plafon & Partisi (Gypsum, Hollow)',
  'Finishing (Granit, Keramik, Cat Dulux)',
  'Elektrikal & Plumbing (Pipa PVC, Kabel)',
];

export const MaterialView: React.FC<MaterialViewProps> = ({
  materials,
  projects,
  onAddMaterial,
  onUpdateStatus,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'prj-1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState(MATERIAL_CATEGORIES[0]);
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState('Sak');
  const [estimatedCost, setEstimatedCost] = useState<number>(65000);
  const [supplier, setSupplier] = useState('Toko Bangunan Sumber Rejeki');
  const [status, setStatus] = useState<MaterialStatus>('Dibeli');

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMaterial({
      projectId: selectedProjectId,
      name,
      category,
      quantity: Number(quantity),
      unit,
      estimatedCost: Number(estimatedCost),
      actualCost: status === 'Dibeli' ? Number(estimatedCost) : 0,
      supplier,
      status,
      purchaseDate: status === 'Dibeli' ? new Date().toISOString().split('T')[0] : undefined,
    });

    setIsAddModalOpen(false);
    setName('');
  };

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const currentMaterials = materials.filter(
    (m) => m.projectId === selectedProjectId || m.projectId === 'prj-1'
  );

  const totalBudgetMaterial = currentProject?.materialBudget || 195000000;
  const totalPembelian = currentMaterials.reduce((acc, m) => {
    if (m.status === 'Dibeli' || m.status === 'Terpakai') {
      return acc + m.quantity * (m.actualCost || m.estimatedCost);
    }
    return acc;
  }, 0);

  const sisaBudget = totalBudgetMaterial - totalPembelian;
  const persentaseTerpakai = Math.min(100, Math.round((totalPembelian / totalBudgetMaterial) * 100));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#16A36A]" />
            <h2 className="text-xl font-extrabold text-[#0B3D2E]">Kontrol Belanja Material & Logistik</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64756D] mt-0.5">
            Pencatatan nota pembelian toko bangunan dan pengawasan anggaran real-time dari mandor lapangan.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#0B3D2E] text-white text-xs font-bold hover:bg-[#16A36A] transition shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Material</span>
        </button>
      </div>

      {/* Budget Summary Tracker Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <span className="text-xs text-[#64756D]">Total Alokasi Budget Material:</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B3D2E]">
            Rp {totalBudgetMaterial.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-[#64756D]">Berdasarkan RAB Proyek yang Disetujui</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <span className="text-xs text-[#64756D]">Realisasi Pembelian (Dibeli):</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#16A36A]">
            Rp {totalPembelian.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] font-bold text-[#16A36A]">{persentaseTerpakai}% dari Anggaran</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <span className="text-xs text-[#64756D]">Sisa Saldo Budget:</span>
          <div className="text-xl sm:text-2xl font-extrabold text-[#0B3D2E]">
            Rp {sisaBudget.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-[#64756D]">Aman Terkendali</div>
        </div>
      </div>

      {/* Material Items Table */}
      <div className="rounded-3xl bg-white border border-[#E2EAE5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7FAF8] text-[#64756D] font-bold border-b border-[#E2EAE5]">
              <tr>
                <th className="py-3.5 px-4">Nama Material & Kategori</th>
                <th className="py-3.5 px-3">Jumlah (Volume)</th>
                <th className="py-3.5 px-3">Toko / Supplier</th>
                <th className="py-3.5 px-3 text-right">Harga Satuan</th>
                <th className="py-3.5 px-4 text-right">Total Biaya</th>
                <th className="py-3.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2EAE5]">
              {currentMaterials.map((mat) => {
                const totalItemCost = mat.quantity * (mat.actualCost || mat.estimatedCost);
                return (
                  <tr key={mat.id} className="hover:bg-[#F7FAF8]/60 transition">
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono font-bold text-[#16A36A] block">
                        {mat.category}
                      </span>
                      <div className="font-bold text-[#10231B] text-xs mt-0.5">{mat.name}</div>
                    </td>

                    <td className="py-3 px-3 font-semibold text-[#10231B]">
                      {mat.quantity} {mat.unit}
                    </td>

                    <td className="py-3 px-3 text-[#64756D]">{mat.supplier}</td>

                    <td className="py-3 px-3 text-right font-medium text-[#10231B]">
                      Rp {(mat.actualCost || mat.estimatedCost).toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-[#0B3D2E]">
                      Rp {totalItemCost.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <select
                        value={mat.status}
                        onChange={(e) =>
                          onUpdateStatus(mat.id, e.target.value as MaterialStatus)
                        }
                        className={`text-[11px] font-bold py-1 px-2.5 rounded-full border cursor-pointer focus:outline-none ${
                          mat.status === 'Dibeli'
                            ? 'bg-[#EAF8F1] text-[#16A36A] border-[#D1DDD6]'
                            : mat.status === 'Terpakai'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Dibeli">Dibeli</option>
                        <option value="Terpakai">Terpakai</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Tambah Material */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E2EAE5] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
              <div className="flex items-center gap-2 text-[#0B3D2E] font-bold text-sm">
                <ShoppingCart className="w-4 h-4 text-[#16A36A]" />
                <span>Pencatatan Belanja Material Baru</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#64756D] hover:bg-[#F7FAF8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-3.5 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Nama Barang Material *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Semen Portland Gresik 50kg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Kategori Material</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                >
                  {MATERIAL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#10231B]">Jumlah (Qty)</label>
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
                    placeholder="Sak/Batang/m³"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#10231B]">Harga per Unit (Rp)</label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Nama Toko Bangunan / Supplier</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#10231B]">Status Pembelian</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as MaterialStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2EAE5] bg-[#F7FAF8] focus:bg-white focus:outline-none focus:border-[#16A36A]"
                >
                  <option value="Dibeli">Dibeli (Nota Lunas)</option>
                  <option value="Menunggu">Menunggu Pembelian</option>
                  <option value="Terpakai">Sudah Terpakai di Lapangan</option>
                </select>
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
                  Simpan Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
