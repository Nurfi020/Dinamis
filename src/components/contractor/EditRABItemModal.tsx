'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Calculator, Layers } from 'lucide-react';
import { Modal } from '../common/Modal';
import { RABItem, WorkCategory } from '../../types';
import { WORK_CATEGORIES, WORK_UNITS, calculateRABItem } from '../../data/contractorRABData';
import { formatRupiah } from '../../utils/helpers';

interface EditRABItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: RABItem | null;
  onSave: (itemId: string, updatedItem: Partial<RABItem>) => void;
}

export const EditRABItemModal: React.FC<EditRABItemModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  const [category, setCategory] = useState<WorkCategory>(WORK_CATEGORIES[0]);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [volume, setVolume] = useState<string>('1');
  const [unit, setUnit] = useState<string>('m2');
  const [materialUnitPrice, setMaterialUnitPrice] = useState<string>('0');
  const [laborUnitPrice, setLaborUnitPrice] = useState<string>('0');
  const [errors, setErrors] = useState<{ itemName?: string; volume?: string }>({});

  useEffect(() => {
    if (item) {
      setCategory(item.category);
      setItemName(item.itemName);
      setDescription(item.description || '');
      setVolume(String(item.volume));
      setUnit(item.unit);
      setMaterialUnitPrice(String(item.materialUnitPrice));
      setLaborUnitPrice(String(item.laborUnitPrice));
      setErrors({});
    }
  }, [item, isOpen]);

  if (!item) return null;

  const numVol = parseFloat(volume) || 0;
  const numMat = parseFloat(materialUnitPrice) || 0;
  const numLabor = parseFloat(laborUnitPrice) || 0;

  const { materialTotal, laborTotal, subtotal } = calculateRABItem(numVol, numMat, numLabor);

  const validate = () => {
    const errs: { itemName?: string; volume?: string } = {};
    if (!itemName.trim()) errs.itemName = 'Nama item pekerjaan wajib diisi';
    if (numVol <= 0) errs.volume = 'Volume harus lebih dari 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(item.id, {
      category,
      itemName: itemName.trim(),
      description: description.trim() || undefined,
      volume: numVol,
      unit,
      materialUnitPrice: numMat,
      materialTotal,
      laborUnitPrice: numLabor,
      laborTotal,
      subtotal,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Item Pekerjaan"
      subtitle="Perbarui volume atau analisa harga satuan pekerjaan"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
        {/* 1. Category */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Kategori Pekerjaan <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as WorkCategory)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            >
              {WORK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Item Name */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Nama Item Pekerjaan <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
              if (errors.itemName) setErrors({ ...errors, itemName: undefined });
            }}
            className={`w-full px-3 py-2 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none transition-all ${
              errors.itemName
                ? 'border-rose-500 ring-2 ring-rose-500/15'
                : 'border-slate-300 focus:border-emerald-600'
            }`}
          />
          {errors.itemName && (
            <p className="text-rose-600 text-xs mt-1 font-medium">{errors.itemName}</p>
          )}
        </div>

        {/* 3. Description / Specs */}
        <div>
          <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span>Spesifikasi Material / Catatan Teknis</span>
            <span className="text-xs text-slate-400 font-normal">Opsional</span>
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* 4. Volume & Unit */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Volume Pekerjaan <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              value={volume}
              onChange={(e) => {
                setVolume(e.target.value);
                if (errors.volume) setErrors({ ...errors, volume: undefined });
              }}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
            />
            {errors.volume && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.volume}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Satuan Pengukuran <span className="text-rose-500">*</span>
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
            >
              {WORK_UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Prices Breakdown (Material & Labor) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Harga Satuan Material (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
              <input
                type="number"
                value={materialUnitPrice}
                onChange={(e) => setMaterialUnitPrice(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Total Mat: <b className="text-slate-800 font-mono">{formatRupiah(materialTotal)}</b>
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Harga Satuan Upah Tenaga (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
              <input
                type="number"
                value={laborUnitPrice}
                onChange={(e) => setLaborUnitPrice(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Total Upah: <b className="text-slate-800 font-mono">{formatRupiah(laborTotal)}</b>
            </span>
          </div>
        </div>

        {/* Live Calculation Preview Box */}
        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-emerald-900 block">Subtotal Item Pekerjaan:</span>
              <span className="text-[10px] text-emerald-700">Material ({formatRupiah(materialTotal)}) + Upah ({formatRupiah(laborTotal)})</span>
            </div>
          </div>
          <span className="text-base font-extrabold text-emerald-800 font-mono">
            {formatRupiah(subtotal)}
          </span>
        </div>

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
