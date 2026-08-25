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
import { Lead, LeadStatus, LeadSource } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SourceBadge } from '../common/SourceBadge';
import { EmptyState } from '../common/EmptyState';
import { 
  formatIndonesianDate, 
  generateWhatsAppUrl, 
  formatDisplayPhone,
  isDateToday,
  isDateOverdue 
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
  onQuickStatusChange,
  initialFilterStatus = 'all',
  initialSearch = '',
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialFilterStatus);
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'next_followup' | 'overdue' | 'name'>('latest');
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
          <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
            Semua Calon Pelanggan
          </h2>
          <p className="text-xs sm:text-sm text-[#66736B] mt-0.5">
            Total {leads.length} lead terdaftar dalam sistem
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddLead}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-sm font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Lead Baru</span>
        </button>
      </div>

      {/* 1. Status Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'Semua Lead', count: counts.all, dot: 'bg-[#00A651]' },
          { id: 'Cold', label: 'Cold', count: counts.Cold, dot: 'bg-[#64748B]' },
          { id: 'Warm', label: 'Warm', count: counts.Warm, dot: 'bg-[#F59E0B]' },
          { id: 'Hot', label: 'Hot', count: counts.Hot, dot: 'bg-[#EF4444]' },
          { id: 'Closing', label: 'Closing', count: counts.Closing, dot: 'bg-[#10B981]' },
          { id: 'Tidak Berhasil', label: 'Tidak Berhasil', count: counts['Tidak Berhasil'], dot: 'bg-[#6B7280]' },
        ].map((tab) => {
          const isSelected = selectedStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedStatus(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#00A651] text-white shadow-sm'
                  : 'bg-white text-[#66736B] border border-[#E2E9E4] hover:border-[#00A651]/40 hover:text-[#17221C]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : tab.dot}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#F4FBF7] text-[#006B3C] border border-[#E2E9E4]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Search & Secondary Filters Bar */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#66736B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, no WA, atau kota..."
              className="w-full pl-10 pr-8 py-2 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs sm:text-sm text-[#17221C] placeholder-[#66736B] focus:outline-none focus:border-[#00A651] focus:bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66736B] hover:text-[#17221C]"
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
              className="bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl px-3 py-2 text-xs font-semibold text-[#17221C] focus:outline-none focus:border-[#00A651] cursor-pointer"
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
              className="bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl px-3 py-2 text-xs font-semibold text-[#17221C] focus:outline-none focus:border-[#00A651] cursor-pointer"
            >
              <option value="all">Semua Kota</option>
              {CITIES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Sort by */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl px-3 py-2 text-xs font-semibold text-[#17221C] focus:outline-none focus:border-[#00A651] cursor-pointer"
            >
              <option value="latest">Terbaru Ditambahkan</option>
              <option value="next_followup">Jadwal Terdekat</option>
              <option value="overdue">Terlambat Dahulu</option>
              <option value="name">Nama (A-Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="p-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold ${
                hasActiveFilters
                  ? 'bg-[#E8F7EF] text-[#006B3C] border-[#00A651]'
                  : 'bg-[#F7F9F8] text-[#66736B] border-[#E2E9E4]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter & Urutkan</span>
            </button>
          </div>
        </div>

        {/* Mobile Filter Options Expandable */}
        {showFiltersMobile && (
          <div className="pt-3 border-t border-[#E2E9E4] grid grid-cols-2 gap-2 text-xs md:hidden">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl p-2 font-medium"
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
              className="bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl p-2 font-medium"
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
              className="col-span-2 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl p-2 font-medium"
            >
              <option value="latest">Terbaru Ditambahkan</option>
              <option value="next_followup">Jadwal Terdekat</option>
              <option value="name">Nama (A-Z)</option>
            </select>
          </div>
        )}
      </div>

      {/* 3. Data Representation */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-8 shadow-sm">
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
          <div className="hidden lg:block bg-white border border-[#E2E9E4] rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F9F8] border-b border-[#E2E9E4] text-[11px] font-bold text-[#66736B] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Calon Pelanggan</th>
                  <th className="py-3.5 px-4">Kontak & Kota</th>
                  <th className="py-3.5 px-4">Produk & Sumber</th>
                  <th className="py-3.5 px-4">Status Prospek</th>
                  <th className="py-3.5 px-4">Jadwal Follow Up</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E9E4] text-xs">
                {filteredLeads.map((lead) => {
                  const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);
                  const isToday = isDateToday(lead.nextFollowUpDate);
                  const isOver = isDateOverdue(lead.nextFollowUpDate);
                  const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#F4FBF7] transition-colors group cursor-pointer"
                      onClick={() => onSelectLead(lead)}
                    >
                      {/* Calon Pelanggan */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-[#17221C] group-hover:text-[#006B3C] transition-colors block">
                              {lead.name}
                            </span>
                            <span className="text-[11px] text-[#66736B]">
                              Masuk: {formatIndonesianDate(lead.createdAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kontak & Kota */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-[#17221C] font-semibold block">
                            {formatDisplayPhone(lead.phone)}
                          </span>
                          <span className="text-[#66736B] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#00A651]" /> {lead.city}
                          </span>
                        </div>
                      </td>

                      {/* Produk & Sumber */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="font-semibold text-[#17221C] block">
                            {lead.product.split('—')[0].trim()}
                          </span>
                          <SourceBadge source={lead.source} size="sm" />
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={lead.status} size="sm" />
                        </div>
                      </td>

                      {/* Jadwal Follow Up */}
                      <td className="py-3.5 px-4">
                        {lead.status === 'Closing' ? (
                          <span className="text-[11px] font-bold text-[#006B3C] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Closing Deal
                          </span>
                        ) : lead.status === 'Tidak Berhasil' ? (
                          <span className="text-[11px] text-slate-500 font-medium">
                            Selesai (Tidak Lanjut)
                          </span>
                        ) : (
                          <div className="space-y-0.5">
                            <span
                              className={`font-bold flex items-center gap-1 ${
                                isOver
                                  ? 'text-rose-600'
                                  : isToday
                                  ? 'text-amber-800'
                                  : 'text-[#17221C]'
                              }`}
                            >
                              <CalendarClock className="w-3.5 h-3.5" />
                              {formatIndonesianDate(lead.nextFollowUpDate)}
                            </span>
                            <span className="text-[11px] text-[#66736B]">
                              Pukul {lead.nextFollowUpTime || '10:00'}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-[#E8F7EF] hover:bg-[#00A651] text-[#006B3C] hover:text-white border border-[#A7F3D0] transition-all"
                            title="WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            className="p-2 rounded-xl bg-[#F7F9F8] hover:bg-[#E8F7EF] text-[#66736B] hover:text-[#006B3C] border border-[#E2E9E4] transition-all cursor-pointer"
                            title="Detail"
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

          {/* Mobile Card List View (Responsive) */}
          <div className="lg:hidden space-y-3">
            {filteredLeads.map((lead) => {
              const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);
              const isToday = isDateToday(lead.nextFollowUpDate);
              const isOver = isDateOverdue(lead.nextFollowUpDate);
              const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2);

              return (
                <div
                  key={lead.id}
                  className="bg-white border border-[#E2E9E4] rounded-2xl p-4 shadow-sm hover:border-[#00A651]/40 transition-all space-y-3"
                >
                  {/* Card Header: Lead Name & Status */}
                  <div
                    onClick={() => onSelectLead(lead)}
                    className="flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-[#17221C] truncate">
                          {lead.name}
                        </h4>
                        <p className="text-xs text-[#66736B] truncate mt-0.5">
                          {lead.product.split('—')[0].trim()} • {lead.city}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={lead.status} size="sm" />
                  </div>

                  {/* Info badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-[#E2E9E4] text-[#66736B]">
                    <div className="flex items-center gap-1.5">
                      <SourceBadge source={lead.source} size="sm" />
                      <span>{formatDisplayPhone(lead.phone)}</span>
                    </div>
                    <div>
                      {lead.status !== 'Closing' && lead.status !== 'Tidak Berhasil' && (
                        <span
                          className={`font-bold flex items-center gap-1 ${
                            isOver ? 'text-rose-600' : isToday ? 'text-amber-800' : 'text-[#17221C]'
                          }`}
                        >
                          <CalendarClock className="w-3.5 h-3.5" />
                          {formatIndonesianDate(lead.nextFollowUpDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-xs font-bold transition-all shadow-xs min-h-[44px]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onSelectLead(lead)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#F7F9F8] hover:bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] text-xs font-bold transition-all cursor-pointer min-h-[44px]"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>Lihat Detail</span>
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