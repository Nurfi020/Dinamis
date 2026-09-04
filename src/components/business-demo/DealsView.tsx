'use client';

import React, { useState } from 'react';
import {
  BadgePercent,
  Plus,
  CircleDollarSign,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  Trash2,
  X,
  Package,
} from 'lucide-react';
import {
  DemoDeal,
  DemoLead,
  DemoProduct,
  DealStatus,
} from './types';

interface DealsViewProps {
  deals: DemoDeal[];
  leads: DemoLead[];
  products: DemoProduct[];
  onAddDeal: (deal: Omit<DemoDeal, 'id'>) => void;
  onUpdateDealStatus: (id: string, status: DealStatus) => void;
  onDeleteDeal: (id: string) => void;
}

const DEAL_STATUSES: DealStatus[] = [
  'Menunggu Pembayaran',
  'DP Diterima',
  'Lunas',
  'Batal',
];

export function DealsView({
  deals,
  leads,
  products,
  onAddDeal,
  onUpdateDealStatus,
  onDeleteDeal,
}: DealsViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    leadId: leads[0]?.id || '',
    productId: products[0]?.id || '',
    dealValue: products[0]?.price || 10000000,
    status: 'DP Diterima' as DealStatus,
    dealDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const totalOmset = deals
    .filter((d) => d.status === 'Lunas' || d.status === 'DP Diterima')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const pendingOmset = deals
    .filter((d) => d.status === 'Menunggu Pembayaran')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const handleProductChange = (prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    setFormData((prev) => ({
      ...prev,
      productId: prodId,
      dealValue: prod ? prod.price : prev.dealValue,
    }));
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === formData.leadId);
    const prod = products.find((p) => p.id === formData.productId);
    if (!lead || !prod) return;

    onAddDeal({
      leadId: lead.id,
      customerName: lead.name,
      customerCompany: lead.company,
      productId: prod.id,
      productName: prod.name,
      dealValue: Number(formData.dealValue) || 0,
      status: formData.status,
      dealDate: formData.dealDate,
      notes: formData.notes.trim() || `Transaksi closing paket ${prod.name}.`,
    });

    setIsAddModalOpen(false);
    setFormData({
      leadId: leads[0]?.id || '',
      productId: products[0]?.id || '',
      dealValue: products[0]?.price || 10000000,
      status: 'DP Diterima',
      dealDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const getStatusBadge = (status: DealStatus) => {
    switch (status) {
      case 'Lunas':
        return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
      case 'DP Diterima':
        return 'bg-[#EAF8F1] text-[#0B3D2E] border-[#D1DDD6]';
      case 'Menunggu Pembayaran':
        return 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]';
      case 'Batal':
        return 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3D2E]">
            Deal & Transaksi Penjualan
          </h2>
          <p className="text-xs sm:text-sm text-[#64756D]">
            Catat hasil closing, status pembayaran termin, dan realisasi omset penjualan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-xs sm:text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Deal Baru</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#64756D]">Total Deal Terdaftar</div>
          <div className="text-2xl font-extrabold text-[#0B3D2E]">{deals.length} Deal</div>
          <p className="text-[11px] text-[#64756D]">Semua transaksi</p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#64756D]">Omset Closing (Lunas & DP)</div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#16A36A] truncate">
            Rp {totalOmset.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-[#64756D]">Sudah terverifikasi</p>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-[#64756D]">Menunggu Pembayaran</div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#D97706] truncate">
            Rp {pendingOmset.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-[#64756D]">Invoice dalam proses</p>
        </div>
      </div>

      {/* Deals List */}
      {deals.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#E2EAE5] space-y-3">
          <CircleDollarSign className="w-10 h-10 text-[#64756D] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[#0B3D2E]">Belum Ada Transaksi Deal</h3>
          <p className="text-xs text-[#64756D]">
            Klik tombol &ldquo;Buat Deal Baru&rdquo; untuk mencatat transaksi penjualan pertama.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className="p-5 rounded-3xl bg-white border border-[#E2EAE5] hover:border-[#16A36A] transition shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-[#10231B]">
                      {deal.customerName}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        deal.status
                      )}`}
                    >
                      {deal.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#64756D]">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#16A36A]" />
                      {deal.customerCompany}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-[#0B3D2E]" />
                      {deal.productName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#64756D]" />
                      {deal.dealDate}
                    </span>
                  </div>
                </div>

                {/* Deal Value & Status Control */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] text-[#64756D]">Nilai Transaksi:</div>
                    <div className="text-base sm:text-lg font-extrabold text-[#0B3D2E]">
                      Rp {deal.dealValue.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <select
                    value={deal.status}
                    onChange={(e) =>
                      onUpdateDealStatus(deal.id, e.target.value as DealStatus)
                    }
                    className="text-xs font-bold text-[#0B3D2E] bg-[#F7FAF8] border border-[#D1DDD6] rounded-xl py-2 px-2.5 focus:outline-none"
                  >
                    {DEAL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => onDeleteDeal(deal.id)}
                    className="p-2 rounded-xl text-[#64756D] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition"
                    title="Hapus Deal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="p-3 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] text-xs text-[#64756D]">
                <strong className="text-[#0B3D2E]">Catatan Pembayaran: </strong>
                {deal.notes}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Buat Deal Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2EAE5] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
              <h3 className="text-lg font-extrabold text-[#0B3D2E]">
                Buat Transaksi Deal Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#64756D] hover:text-[#10231B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Pilih Customer / Prospek *</label>
                <select
                  value={formData.leadId}
                  onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} — {l.company} ({l.stage})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Pilih Produk / Layanan *</label>
                <select
                  value={formData.productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Rp {p.price.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Nilai Transaksi Final (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="500000"
                    value={formData.dealValue}
                    onChange={(e) => setFormData({ ...formData, dealValue: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Status Pembayaran</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as DealStatus })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  >
                    {DEAL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Tanggal Deal</label>
                <input
                  type="date"
                  required
                  value={formData.dealDate}
                  onChange={(e) => setFormData({ ...formData, dealDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Catatan Pembayaran & Termin</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: DP 50% via transfer BCA, pelunasan 14 hari kerja..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2EAE5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2EAE5] font-semibold text-[#64756D] hover:bg-[#F7FAF8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2E] text-white font-bold hover:bg-[#16A36A] transition shadow-xs"
                >
                  Simpan Transaksi Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
