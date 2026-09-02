'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  Printer, 
  Edit3, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Calculator, 
  Sparkles,
  Coins,
  HardHat,
  Package
} from 'lucide-react';
import { RAB, RABItem, RABStatus } from '../../types';
import { formatRupiah } from '../../utils/helpers';
import { WORK_CATEGORIES } from '../../data/contractorRABData';
import { AddRABItemModal } from './AddRABItemModal';
import { EditRABItemModal } from './EditRABItemModal';
import { EditRABModal } from './EditRABModal';
import { ConfirmModal } from '../common/ConfirmModal';

interface RABDetailViewProps {
  rab: RAB;
  onBack: () => void;
  onUpdateRAB: (rabId: string, updatedData: Partial<RAB>) => void;
  onDeleteRAB: (rabId: string) => void;
  onAddItem: (newItem: Omit<RABItem, 'id'>) => void;
  onUpdateItem: (itemId: string, updatedItem: Partial<RABItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

export const RABDetailView: React.FC<RABDetailViewProps> = ({
  rab,
  onBack,
  onUpdateRAB,
  onDeleteRAB,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditRABModalOpen, setIsEditRABModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<RABItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<RABItem | null>(null);
  const [isDeleteRABModalOpen, setIsDeleteRABModalOpen] = useState(false);

  const isFinal = rab.status === 'Final';

  // Group items by category
  const categoriesPresent = WORK_CATEGORIES.filter((cat) =>
    rab.items.some((item) => item.category === cat)
  );

  // Status toggle handler
  const handleToggleStatus = () => {
    const nextStatus: RABStatus = isFinal ? 'Draft' : 'Final';
    onUpdateRAB(rab.id, { status: nextStatus });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* 1. Navigation Top Bar */}
      <div className="flex items-center justify-between gap-3 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar RAB</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Cetak / PDF</span>
          </button>
          <button
            onClick={() => setIsEditRABModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Data Proyek</span>
          </button>
          <button
            onClick={() => setIsDeleteRABModalOpen(true)}
            className="p-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            title="Hapus RAB"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Project Header Card */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left: Project & Client Identity */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {rab.rabNumber}
              </span>
              <button
                onClick={handleToggleStatus}
                title="Klik untuk mengubah status"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isFinal
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                {isFinal ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span>Status: {rab.status}</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {rab.projectName}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <User className="w-3.5 h-3.5 text-slate-400" />
                {rab.clientName}
              </span>
              <a
                href={`https://wa.me/${rab.clientPhone?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-emerald-700 hover:underline font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                {rab.clientPhone}
              </a>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {rab.projectLocation}
              </span>
              {rab.buildingAreaM2 && (
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Luas Bangunan: <b className="font-mono">{rab.buildingAreaM2} m²</b>
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick CTA */}
          <div className="flex items-center gap-2 print:hidden shrink-0">
            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Item Pekerjaan</span>
            </button>
          </div>
        </div>

        {/* Project Notes Banner */}
        {rab.notes && (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900 block mb-0.5">Catatan Spesifikasi Proyek:</span>
            {rab.notes}
          </div>
        )}
      </div>

      {/* 3. Financial Summary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Material Total */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Biaya Material</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 font-mono tracking-tight">
            {formatRupiah(rab.materialTotal)}
          </p>
          <span className="text-[10px] text-slate-400 block">Kebutuhan bahan konstruksi</span>
        </div>

        {/* Labor Total */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Upah Tenaga</span>
            <HardHat className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 font-mono tracking-tight">
            {formatRupiah(rab.laborTotal)}
          </p>
          <span className="text-[10px] text-slate-400 block">Upah tukang & mandor</span>
        </div>

        {/* Subtotal HPP */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Biaya Riil (HPP)</span>
            <Coins className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 font-mono tracking-tight">
            {formatRupiah(rab.subtotalCost)}
          </p>
          <span className="text-[10px] text-slate-400 block">Material + Upah Tenaga</span>
        </div>

        {/* Grand Total */}
        <div className="bg-emerald-800 text-white p-4 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Grand Total RAB</span>
            <Sparkles className="w-4 h-4 text-emerald-300" />
          </div>
          <p className="text-lg sm:text-xl font-extrabold text-white font-mono tracking-tight">
            {formatRupiah(rab.grandTotal)}
          </p>
          <span className="text-[10px] text-emerald-200/90 block">Termasuk Overhead & Profit Margin</span>
        </div>
      </div>

      {/* 4. Detailed Calculation Summary Box */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Calculator className="w-4 h-4 text-emerald-600" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-900">
            Rincian Kalkulasi Harga & Margin Proyek
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">1. Subtotal Biaya Riil (HPP)</span>
            <span className="font-mono font-bold text-slate-900 text-sm">{formatRupiah(rab.subtotalCost)}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">2. Overhead (+{rab.overheadValue}%)</span>
            <span className="font-mono font-bold text-slate-800 text-sm">+{formatRupiah(rab.overheadAmount)}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-emerald-700 font-semibold block uppercase">3. Margin Profit (+{rab.marginValue}%)</span>
            <span className="font-mono font-bold text-emerald-700 text-sm">+{formatRupiah(rab.marginAmount)}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
            <span className="text-[10px] text-rose-600 font-semibold block uppercase">4. Potongan Diskon</span>
            <span className="font-mono font-bold text-rose-600 text-sm">-{formatRupiah(rab.discountAmount || 0)}</span>
          </div>
        </div>
      </div>

      {/* 5. Itemized Table per Category */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-600" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">
              Daftar Item Pekerjaan ({rab.items?.length || 0} Item)
            </h2>
          </div>
          <button
            onClick={() => setIsAddItemModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer print:hidden"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Item</span>
          </button>
        </div>

        {rab.items?.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-xs sm:text-sm text-slate-500">
              Belum ada item pekerjaan di dalam RAB ini.
            </p>
            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow-xs hover:bg-emerald-700 cursor-pointer"
            >
              + Tambah Item Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-6 p-4 sm:p-5">
            {categoriesPresent.map((category) => {
              const categoryItems = rab.items.filter((it) => it.category === category);
              const categorySubtotal = categoryItems.reduce((acc, it) => acc + (it.subtotal || 0), 0);
              const categoryMat = categoryItems.reduce((acc, it) => acc + (it.materialTotal || 0), 0);
              const categoryLabor = categoryItems.reduce((acc, it) => acc + (it.laborTotal || 0), 0);

              return (
                <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      {category}
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500 text-[11px]">
                        Mat: <b className="font-mono text-slate-700">{formatRupiah(categoryMat)}</b> | Upah: <b className="font-mono text-slate-700">{formatRupiah(categoryLabor)}</b>
                      </span>
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                        Subtotal: {formatRupiah(categorySubtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 w-8 text-center">No</th>
                          <th className="py-2.5 px-3">Item Pekerjaan & Spesifikasi</th>
                          <th className="py-2.5 px-3 text-center">Vol</th>
                          <th className="py-2.5 px-3 text-center">Sat</th>
                          <th className="py-2.5 px-3 text-right">Harga Material</th>
                          <th className="py-2.5 px-3 text-right">Total Material</th>
                          <th className="py-2.5 px-3 text-right">Harga Upah</th>
                          <th className="py-2.5 px-3 text-right">Total Upah</th>
                          <th className="py-2.5 px-3 text-right">Subtotal</th>
                          <th className="py-2.5 px-3 text-center print:hidden">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {categoryItems.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-semibold text-slate-900 text-xs">{item.itemName}</div>
                              {item.description && (
                                <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                              {item.volume}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-600 font-medium">
                              {item.unit}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                              {formatRupiah(item.materialUnitPrice)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                              {formatRupiah(item.materialTotal)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                              {formatRupiah(item.laborUnitPrice)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-800">
                              {formatRupiah(item.laborTotal)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800 bg-emerald-50/40">
                              {formatRupiah(item.subtotal)}
                            </td>
                            <td className="py-2.5 px-3 text-center print:hidden">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => setItemToEdit(item)}
                                  title="Edit Item"
                                  className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setItemToDelete(item)}
                                  title="Hapus Item"
                                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="block md:hidden divide-y divide-slate-100">
                    {categoryItems.map((item, idx) => (
                      <div key={item.id} className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold mr-1.5">
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-xs text-slate-900">{item.itemName}</span>
                            {item.description && (
                              <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                            )}
                          </div>
                          <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-mono font-bold text-slate-800 shrink-0">
                            {item.volume} {item.unit}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Material ({formatRupiah(item.materialUnitPrice)}/{item.unit})</span>
                            <span className="font-mono font-medium text-slate-800">{formatRupiah(item.materialTotal)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Upah ({formatRupiah(item.laborUnitPrice)}/{item.unit})</span>
                            <span className="font-mono font-medium text-slate-800">{formatRupiah(item.laborTotal)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-bold text-emerald-800 font-mono">
                            Subtotal: {formatRupiah(item.subtotal)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setItemToEdit(item)}
                              className="px-2 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="px-2 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Modals */}
      <AddRABItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        rabId={rab.id}
        onSave={(newItem) => {
          onAddItem(newItem);
          setIsAddItemModalOpen(false);
        }}
      />

      {itemToEdit && (
        <EditRABItemModal
          isOpen={true}
          onClose={() => setItemToEdit(null)}
          item={itemToEdit}
          onSave={(itemId, updatedItem) => {
            onUpdateItem(itemId, updatedItem);
            setItemToEdit(null);
          }}
        />
      )}

      {isEditRABModalOpen && (
        <EditRABModal
          isOpen={true}
          onClose={() => setIsEditRABModalOpen(false)}
          rab={rab}
          onSave={(id, updatedData) => {
            onUpdateRAB(id, updatedData);
            setIsEditRABModalOpen(false);
          }}
        />
      )}

      {itemToDelete && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setItemToDelete(null)}
          title="Hapus Item Pekerjaan?"
          message={`Apakah Anda yakin ingin menghapus item "${itemToDelete.itemName}"?`}
          confirmText="Hapus Item"
          onConfirm={() => {
            onDeleteItem(itemToDelete.id);
            setItemToDelete(null);
          }}
        />
      )}

      {isDeleteRABModalOpen && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setIsDeleteRABModalOpen(false)}
          title="Hapus Dokumen RAB?"
          message={`Apakah Anda yakin ingin menghapus dokumen "${rab.rabNumber} — ${rab.projectName}"?`}
          confirmText="Ya, Hapus RAB"
          onConfirm={() => {
            onDeleteRAB(rab.id);
            setIsDeleteRABModalOpen(false);
            onBack();
          }}
        />
      )}
    </div>
  );
};
