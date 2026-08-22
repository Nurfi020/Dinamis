import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  MessageCircle, 
  ChevronRight, 
  ArrowUpDown, 
  CalendarClock, 
  MapPin, 
  Package, 
  Phone,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Lead, LeadStatus, LeadSource, FilterState } from '../../types';
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
  const [sortBy, setSortBy] = useState<'latest' | 'name' | 'next_followup'>('latest');
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
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'next_followup') {
          if (!a.nextFollowUpDate) return 1;
          if (!b.nextFollowUpDate) return -1;
          return a.nextFollowUpDate.localeCompare(b.nextFollowUpDate);
        }
        // latest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [leads, search, selectedStatus, selectedProduct, selectedCity, selectedSource, sortBy]);

  const hasActiveFilters = 
    selectedStatus !== 'all' || 
    selectedProduct !== 'all' || 
    selectedCity !== 'all' || 
    selectedSource !== 'all' || 
    search.trim() !== '';

  const resetFilters = () => {
    setSearch('');
    setSelectedStatus('all');
    setSelectedProduct('all');
    setSelectedCity('all');
    setSelectedSource('all');
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, kota, atau nomor WhatsApp..."
            className="w-full pl-10 pr-10 py-2.5 bg-[#0B1B2E] border border-[#17324D] rounded-xl text-sm text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#168BFF] focus:ring-1 focus:ring-[#168BFF] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Buttons: Filter Mobile Toggle + Tambah Lead */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className={`sm:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              hasActiveFilters
                ? 'bg-[#168BFF]/20 border-[#168BFF] text-[#22D3EE]'
                : 'bg-[#0B1B2E] border-[#17324D] text-[#94A3B8]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddLead}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 text-white font-semibold text-sm shadow-[0_0_15px_rgba(22,139,255,0.35)] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tambah Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Quick Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
        {[
          { id: 'all', label: 'Semua', count: counts.all },
          { id: 'Hot', label: 'Hot', count: counts.Hot },
          { id: 'Warm', label: 'Warm', count: counts.Warm },
          { id: 'Cold', label: 'Cold', count: counts.Cold },
          { id: 'Closing', label: 'Closing', count: counts.Closing },
          { id: 'Tidak Berhasil', label: 'Tidak Berhasil', count: counts['Tidak Berhasil'] },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedStatus(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              selectedStatus === tab.id
                ? 'bg-[#168BFF] text-white border-[#168BFF] shadow-[0_0_12px_rgba(22,139,255,0.3)]'
                : 'bg-[#0B1B2E] text-[#94A3B8] hover:text-[#F8FAFC] border-[#17324D] hover:border-[#168BFF]/40'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedStatus === tab.id ? 'bg-white/25 text-white' : 'bg-[#06111F] text-[#94A3B8]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Dropdown Filters (Desktop always visible, Mobile collapsible) */}
      <div
        className={`${
          showFiltersMobile ? 'flex' : 'hidden'
        } sm:flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-[#0B1B2E]/60 border border-[#17324D] text-xs`}
      >
        {/* Product filter */}
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="bg-[#0E233D] text-[#F8FAFC] border border-[#17324D] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#168BFF] cursor-pointer"
        >
          <option value="all">Semua Produk</option>
          {PRODUCTS_LIST.map((prod) => (
            <option key={prod} value={prod}>{prod}</option>
          ))}
        </select>

        {/* City filter */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="bg-[#0E233D] text-[#F8FAFC] border border-[#17324D] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#168BFF] cursor-pointer"
        >
          <option value="all">Semua Kota</option>
          {CITIES_LIST.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        {/* Source filter */}
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="bg-[#0E233D] text-[#F8FAFC] border border-[#17324D] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#168BFF] cursor-pointer"
        >
          <option value="all">Semua Sumber</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
          <option value="TikTok">TikTok</option>
          <option value="Referral">Referral</option>
          <option value="Website">Website</option>
          <option value="Marketplace">Marketplace</option>
        </select>

        {/* Sort by */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[#94A3B8] hidden md:inline">Urutan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0E233D] text-[#F8FAFC] border border-[#17324D] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#168BFF] cursor-pointer"
          >
            <option value="latest">Terbaru Ditambahkan</option>
            <option value="name">Nama (A - Z)</option>
            <option value="next_followup">Jadwal Follow Up</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-red-400 hover:text-red-300 font-medium ml-2 underline"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Main Content: Table for Desktop, Cards for Mobile */}
      {filteredLeads.length === 0 ? (
        <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl">
          <EmptyState
            title="Lead tidak ditemukan"
            description="Tidak ada calon pelanggan yang cocok dengan pencarian atau filter yang dipilih."
            actionText="Reset Filter"
            onAction={resetFilters}
          />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#0B1B2E] border border-[#17324D] rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#17324D] bg-[#0E233D]/70 text-[#94A3B8] font-semibold">
                  <th className="py-3.5 px-4">Nama Calon Pelanggan</th>
                  <th className="py-3.5 px-4">Kota</th>
                  <th className="py-3.5 px-4">Produk</th>
                  <th className="py-3.5 px-4">Sumber</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Follow Up Berikutnya</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#17324D]/60">
                {filteredLeads.map((lead) => {
                  const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
                  const isToday = isDateToday(lead.nextFollowUpDate);
                  const isOverdue = isDateOverdue(lead.nextFollowUpDate);
                  const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#0E233D]/50 transition-colors group cursor-pointer"
                    >
                      {/* Name & Phone */}
                      <td className="py-3.5 px-4" onClick={() => onSelectLead(lead)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#0E233D] border border-[#17324D] flex items-center justify-center font-bold text-xs text-[#22D3EE] group-hover:border-[#168BFF]/50 transition-colors shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#F8FAFC] group-hover:text-[#22D3EE] transition-colors">
                              {lead.name}
                            </div>
                            <div className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
                              {formatDisplayPhone(lead.phone)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* City */}
                      <td className="py-3.5 px-4 text-[#F8FAFC]" onClick={() => onSelectLead(lead)}>
                        <span className="inline-flex items-center gap-1.5 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                          {lead.city}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="py-3.5 px-4 text-[#F8FAFC]" onClick={() => onSelectLead(lead)}>
                        <span className="text-slate-300 font-medium">
                          {lead.product.split('—')[0].trim()}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4" onClick={() => onSelectLead(lead)}>
                        <SourceBadge source={lead.source} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={lead.status} size="sm" />
                      </td>

                      {/* Next Follow Up */}
                      <td className="py-3.5 px-4" onClick={() => onSelectLead(lead)}>
                        {lead.nextFollowUpDate ? (
                          <div className="flex items-center gap-1.5">
                            <CalendarClock
                              className={`w-3.5 h-3.5 ${
                                isOverdue ? 'text-red-400' : isToday ? 'text-amber-400' : 'text-[#94A3B8]'
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                isOverdue
                                  ? 'text-red-400'
                                  : isToday
                                  ? 'text-amber-400 font-bold'
                                  : 'text-slate-300'
                              }`}
                            >
                              {formatIndonesianDate(lead.nextFollowUpDate)}
                              {lead.nextFollowUpTime && ` · ${lead.nextFollowUpTime}`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105"
                            title="Chat WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => onSelectLead(lead)}
                            className="p-1.5 rounded-lg bg-[#0E233D] hover:bg-[#168BFF] text-[#94A3B8] hover:text-white border border-[#17324D] transition-colors"
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

          {/* Mobile Card List View */}
          <div className="md:hidden space-y-3">
            {filteredLeads.map((lead) => {
              const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
              const waUrl = generateWhatsAppUrl(lead.phone, lead.name, lead.product);
              const isToday = isDateToday(lead.nextFollowUpDate);
              const isOverdue = isDateOverdue(lead.nextFollowUpDate);

              return (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl p-4 shadow-md space-y-3 cursor-pointer active:scale-[0.99] transition-all"
                >
                  {/* Top: Name + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#168BFF]/20 to-[#0E233D] border border-[#168BFF]/30 flex items-center justify-center font-bold text-sm text-[#22D3EE]">
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#F8FAFC]">{lead.name}</h4>
                        <p className="text-xs text-[#94A3B8]">
                          {lead.product.split('—')[0].trim()} · {lead.city}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={lead.status} size="sm" />
                  </div>

                  {/* Meta: Source & Next Follow Up */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#17324D]/60 text-[#94A3B8]">
                    <SourceBadge source={lead.source} size="sm" />

                    {lead.nextFollowUpDate && (
                      <span
                        className={`flex items-center gap-1 font-medium ${
                          isOverdue ? 'text-red-400' : isToday ? 'text-amber-400' : 'text-slate-300'
                        }`}
                      >
                        <CalendarClock className="w-3.5 h-3.5" />
                        <span>
                          {formatIndonesianDate(lead.nextFollowUpDate)}
                          {lead.nextFollowUpTime && ` ${lead.nextFollowUpTime}`}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => onSelectLead(lead)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#0E233D] hover:bg-[#168BFF] text-[#F8FAFC] border border-[#17324D] text-xs font-semibold"
                    >
                      <span>Detail</span>
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
