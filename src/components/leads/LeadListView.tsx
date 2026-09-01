'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  MessageCircle, 
  ChevronRight, 
  CalendarClock, 
  MapPin, 
  SlidersHorizontal,
  X,
  CheckCircle2
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { EmptyState } from '../common/EmptyState';
import { 
  formatIndonesianDate, 
  generateWhatsAppUrl, 
  formatDisplayPhone,
  isDateToday,
  isDateOverdue,
  formatRupiah 
} from '../../utils/helpers';
import { CITIES_LIST, PRODUCTS_LIST } from '../../data/mockData';

interface LeadListViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onOpenAddLead: () => void;
  onQuickStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  initialFilterStatus?: string;
  initialSearch?: string;
}

export const LeadListView: React.FC<LeadListViewProps> = ({
  leads,
  onSelectLead,
  onOpenAddLead,
  initialFilterStatus = 'all',
  initialSearch = '',
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilterStatus);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'value_high' | 'value_low' | 'next_followup' | 'overdue' | 'name'>('latest');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Status quick filter counts
  const counts = useMemo(() => {
    return {
      all: leads.length,
      Cold: leads.filter((l) => l.status === 'Cold').length,
      Warm: leads.filter((l) => l.status === 'Warm').length,
      Hot: leads.filter((l) => l.status === 'Hot').length,
      Closing: leads.filter((l) => l.status === 'Closing').length,
      'Tidak Berhasil': leads.filter((l) => l.status === 'Tidak Berhasil').length,
    };
  }, [leads]);

  // Filtered and sorted leads
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        // Search
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = lead.name.toLowerCase().includes(q);
          const matchPhone = lead.phone.includes(q);
          const matchCity = lead.city.toLowerCase().includes(q);
          if (!matchName && !matchPhone && !matchCity) return false;
        }

        // Status
        if (selectedStatus !== 'all' && lead.status !== selectedStatus) {
          return false;
        }

        // Product
        if (selectedProduct !== 'all' && lead.product !== selectedProduct) {
          return false;
        }

        // City
        if (selectedCity !== 'all' && lead.city !== selectedCity) {
          return false;
        }

        // Source
        if (selectedSource !== 'all' && lead.source !== selectedSource) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'value_high') {
          return (b.value || 0) - (a.value || 0);
        }
        if (sortBy === 'value_low') {
          return (a.value || 0) - (b.value || 0);
        }
        if (sortBy === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'next_followup') {
          if (!a.nextFollowUpDate) return 1;
          if (!b.nextFollowUpDate) return -1;
          return new Date(a.nextFollowUpDate).getTime() - new Date(b.nextFollowUpDate).getTime();
        }
        if (sortBy === 'overdue') {
          const aOver = isDateOverdue(a.nextFollowUpDate) ? 1 : 0;
          const bOver = isDateOverdue(b.nextFollowUpDate) ? 1 : 0;
          return bOver - aOver;
        }
        return 0;
      });
  }, [leads, search, selectedStatus, selectedProduct, selectedCity, selectedSource, sortBy]);

  const hasActiveFilters = selectedProduct !== 'all' || selectedCity !== 'all' || selectedSource !== 'all' || search !== '';

  const clearFilters = () => {
    setSearch('');
    setSelectedProduct('all');
    setSelectedCity('all');
    setSelectedSource('all');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Semua Calon Pelanggan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Total {leads.length} prospek • Nilai Pipeline: <strong className="text-slate-900 font-mono font-bold">{formatRupiah(leads.filter(l => l.status !== 'Closing' && l.status !== 'Tidak Berhasil').reduce((sum, l) => sum + (l.value || 0), 0))}</strong>
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddLead}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Lead Baru</span>
        </button>
      </div>

      {/* 1. Status Filter Pills (Clean segmented) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Semua Lead', count: counts.all, dot: 'bg-slate-400' },
          { id: 'Cold', label: 'Cold', count: counts.Cold, dot: 'bg-slate-400' },
          { id: 'Warm', label: 'Warm', count: counts.Warm, dot: 'bg-amber-500' },
          { id: 'Hot', label: 'Hot', count: counts.Hot, dot: 'bg-rose-500' },
          { id: 'Closing', label: 'Closing', count: counts.Closing, dot: 'bg-emerald-600' },
          { id: 'Tidak Berhasil', label: 'Tidak Berhasil', count: counts['Tidak Berhasil'], dot: 'bg-slate-400' },
        ].map((tab) => {
          const isSelected = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatus(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : tab.dot}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Search & Secondary Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, no WhatsApp, atau kota..."
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Filter Dropdowns */}
          <div className="hidden md:flex items-center gap-2">
            {/* Filter Produk */}
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">Semua Produk</option>
              {PRODUCTS_LIST.map((p) => (
                <option key={p} value={p}>
                  {p.split('—')[0].trim()}
                </option>
              ))}
            </select>

            {/* Filter Kota */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">Semua Kota</option>
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Filter Sumber */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="all">Semua Sumber</option>
              {['WhatsApp', 'Instagram', 'Facebook', 'Website', 'Referral', 'TikTok', 'Marketplace', 'Lainnya'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="latest">Terbaru</option>
              <option value="value_high">Nilai Tertinggi</option>
              <option value="value_low">Nilai Terendah</option>
              <option value="next_followup">Jadwal Terdekat</option>
              <option value="overdue">Terlambat Dahulu</option>
              <option value="name">Nama (A-Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Hapus Filter"
              >
                Reset
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex md:hidden items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border text-xs font-semibold ${
                hasActiveFilters
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter & Urutkan</span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Options Expandable */}
        {showFiltersMobile && (
          <div className="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs md:hidden">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="all">Semua Produk</option>
              {PRODUCTS_LIST.map((p) => (
                <option key={p} value={p}>
                  {p.split('—')[0].trim()}
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="all">Semua Kota</option>
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="col-span-2 bg-white border border-slate-300 rounded-lg p-2 font-medium"
            >
              <option value="latest">Terbaru Ditambahkan</option>
              <option value="value_high">Nilai Tertinggi</option>
              <option value="value_low">Nilai Terendah</option>
              <option value="next_followup">Jadwal Terdekat</option>
              <option value="name">Nama (A-Z)</option>
            </select>
          </div>
        )}
      </div>

      {/* 3. Data Representation */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs">
          <EmptyState
            title="Belum ada lead yang cocok"
            description="Coba ubah kata kunci pencarian atau sesuaikan filter status."
            actionText="+ Tambah Lead Baru"
            onAction={onOpenAddLead}
          />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Calon Pelanggan</th>
                  <th className="py-3 px-4">Nilai Potensi</th>
                  <th className="py-3 px-4">Kontak & Kota</th>
                  <th className="py-3 px-4">Produk & Sumber</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Jadwal Follow Up</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredLeads.map((lead) => {
                  const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);
                  const isToday = isDateToday(lead.nextFollowUpDate);
                  const isOver = isDateOverdue(lead.nextFollowUpDate);
                  const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                      onClick={() => onSelectLead(lead)}
                    >
                      {/* Calon Pelanggan */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors block">
                              {lead.name}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Masuk: {formatIndonesianDate(lead.createdAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Nilai Potensi */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-sm text-slate-900 font-mono">
                          {formatRupiah(lead.value)}
                        </span>
                      </td>

                      {/* Kontak & Kota */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-slate-900 font-medium block">
                            {formatDisplayPhone(lead.phone)}
                          </span>
                          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 text-slate-400" /> {lead.city}
                          </span>
                        </div>
                      </td>

                      {/* Produk & Sumber */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="font-medium text-slate-800 block truncate max-w-[180px]">
                            {lead.product.split('—')[0].trim()}
                          </span>
                          <SourceBadge source={lead.source} size="sm" />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <StatusBadge status={lead.status} size="sm" />
                      </td>

                      {/* Jadwal Follow Up */}
                      <td className="py-3.5 px-4">
                        {lead.status === 'Closing' ? (
                          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Closing Deal
                          </span>
                        ) : lead.status === 'Tidak Berhasil' ? (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Selesai
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span
                              className={`font-semibold flex items-center gap-1 ${
                                isOver
                                  ? 'text-rose-600'
                                  : isToday
                                  ? 'text-amber-800'
                                  : 'text-slate-800'
                              }`}
                            >
                              <CalendarClock className="w-3.5 h-3.5" />
                              {formatIndonesianDate(lead.nextFollowUpDate)}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {lead.nextFollowUpTime || '10:00'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 py-1 px-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-2xs active:scale-95 text-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WA</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            className="inline-flex items-center p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
            {filteredLeads.map((lead) => {
              const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);
              const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

              return (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs space-y-3 cursor-pointer transition-all active:scale-[0.99]"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {lead.name}
                        </h4>
                        <span className="text-xs font-mono text-slate-500">
                          {formatDisplayPhone(lead.phone)}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={lead.status} size="sm" />
                  </div>

                  {/* Card Body Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Nilai Potensi</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {formatRupiah(lead.value)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Produk / Kota</span>
                      <span className="font-medium text-slate-800 truncate block">
                        {lead.product.split('—')[0].trim()} • {lead.city}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center gap-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onSelectLead(lead)}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};