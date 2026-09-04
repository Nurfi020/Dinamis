'use client';

import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  Filter,
  Phone,
  Building,
  Mail,
  Calendar,
  MessageCircle,
  Copy,
  Check,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  DollarSign,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import {
  DemoLead,
  DemoActivity,
  PipelineStage,
  LeadSource,
} from './types';

interface LeadsViewProps {
  leads: DemoLead[];
  activities: DemoActivity[];
  onAddLead: (lead: Omit<DemoLead, 'id' | 'createdAt' | 'lastContact'>) => DemoLead;
  onUpdateLead: (id: string, updatedFields: Partial<Omit<DemoLead, 'id' | 'createdAt'>>) => void;
  onUpdateStage: (id: string, stage: PipelineStage, note?: string) => void;
  onDeleteLead: (id: string) => void;
}

const STAGES: PipelineStage[] = [
  'Lead Baru',
  'Dihubungi',
  'Follow-up',
  'Negosiasi',
  'Deal',
  'Tidak Jadi',
];

const SOURCES: LeadSource[] = [
  'WhatsApp',
  'Instagram',
  'Facebook',
  'Google',
  'Referral',
  'Walk-in',
  'Marketplace',
  'Lainnya',
];

export function LeadsView({
  leads,
  activities,
  onAddLead,
  onUpdateLead,
  onUpdateStage,
  onDeleteLead,
}: LeadsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<DemoLead | null>(null);
  const [viewingLead, setViewingLead] = useState<DemoLead | null>(null);
  const [copiedTemplateIdx, setCopiedTemplateIdx] = useState<number | null>(null);

  // New Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    source: 'WhatsApp' as LeadSource,
    stage: 'Lead Baru' as PipelineStage,
    interestProduct: 'Paket Standard Business CRM',
    potentialValue: 10000000,
    notes: '',
  });

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);

    const matchesStage =
      selectedStage === 'all' || lead.stage === selectedStage;

    const matchesSource =
      selectedSource === 'all' || lead.source === selectedSource;

    return matchesSearch && matchesStage && matchesSource;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    onAddLead({
      name: formData.name.trim(),
      company: formData.company.trim() || 'Perorangan',
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      source: formData.source,
      stage: formData.stage,
      interestProduct: formData.interestProduct,
      potentialValue: Number(formData.potentialValue) || 0,
      notes: formData.notes.trim() || 'Lead baru dari demo form.',
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      company: '',
      phone: '',
      email: '',
      source: 'WhatsApp',
      stage: 'Lead Baru',
      interestProduct: 'Paket Standard Business CRM',
      potentialValue: 10000000,
      notes: '',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    onUpdateLead(editingLead.id, {
      name: editingLead.name,
      company: editingLead.company,
      phone: editingLead.phone,
      email: editingLead.email,
      source: editingLead.source,
      interestProduct: editingLead.interestProduct,
      potentialValue: Number(editingLead.potentialValue) || 0,
      notes: editingLead.notes,
    });

    setEditingLead(null);
  };

  const copyToClipboard = (text: string, idx: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedTemplateIdx(idx);
      setTimeout(() => setCopiedTemplateIdx(null), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3D2E]">
            Database Lead & Customer
          </h2>
          <p className="text-xs sm:text-sm text-[#64756D]">
            Kelola data kontak calon pembeli, preferensi produk, dan riwayat interaksi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0B3D2E] text-white font-semibold text-xs sm:text-sm hover:bg-[#16A36A] transition shadow-xs active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Lead Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#E2EAE5] shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-[#64756D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, perusahaan, atau no. HP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] focus:bg-white focus:outline-none focus:border-[#16A36A] text-[#10231B]"
            />
          </div>

          {/* Stage Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] focus:bg-white focus:outline-none focus:border-[#16A36A] text-[#10231B] font-medium"
            >
              <option value="all">Semua Tahap Pipeline</option>
              {STAGES.map((stg) => (
                <option key={stg} value={stg}>
                  {stg}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F7FAF8] border border-[#E2EAE5] focus:bg-white focus:outline-none focus:border-[#16A36A] text-[#10231B] font-medium"
            >
              <option value="all">Semua Sumber Lead</option>
              {SOURCES.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Badges Summary */}
        <div className="flex items-center justify-between text-xs text-[#64756D] pt-1">
          <span>
            Menampilkan <strong>{filteredLeads.length}</strong> dari{' '}
            <strong>{leads.length}</strong> lead
          </span>
          {(searchQuery || selectedStage !== 'all' || selectedSource !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedStage('all');
                setSelectedSource('all');
              }}
              className="text-xs font-bold text-[#16A36A] hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Leads List / Cards */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#E2EAE5] space-y-3">
          <Users2 className="w-10 h-10 text-[#64756D] mx-auto opacity-50" />
          <h3 className="text-sm font-bold text-[#0B3D2E]">Tidak Ada Lead Ditemukan</h3>
          <p className="text-xs text-[#64756D]">
            Coba sesuaikan kata kunci pencarian atau filter status Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => {
            const cleanPhone = lead.phone.replace(/\D/g, '');
            const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone}?text=Halo%20${encodeURIComponent(lead.name)},%20saya%20dari%20tim%20sales%20ingin%20follow-up%20terkait%20kebutuhan%20${encodeURIComponent(lead.interestProduct)}.`;

            return (
              <div
                key={lead.id}
                className="rounded-3xl bg-white border border-[#E2EAE5] p-5 shadow-2xs hover:border-[#16A36A] transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EAF8F1] text-[#16A36A] border border-[#D1DDD6]">
                      {lead.stage}
                    </span>
                    <span className="text-[11px] font-semibold text-[#64756D]">
                      Sumber: <strong className="text-[#0B3D2E]">{lead.source}</strong>
                    </span>
                  </div>

                  {/* Lead Info */}
                  <div>
                    <h3 className="font-extrabold text-base text-[#10231B] group-hover:text-[#0B3D2E] transition">
                      {lead.name}
                    </h3>
                    <p className="text-xs text-[#64756D] flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
                      <span className="truncate">{lead.company}</span>
                    </p>
                  </div>

                  {/* Product & Potential Value */}
                  <div className="p-3 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-1 text-xs">
                    <div className="text-[11px] text-[#64756D]">Minat Produk:</div>
                    <div className="font-semibold text-[#10231B] truncate">
                      {lead.interestProduct}
                    </div>
                    <div className="text-xs font-extrabold text-[#0B3D2E] pt-1">
                      Rp {lead.potentialValue.toLocaleString('id-ID')}
                    </div>
                  </div>

                  {/* Notes Snippet */}
                  <p className="text-xs text-[#64756D] line-clamp-2 italic">
                    &ldquo;{lead.notes}&rdquo;
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-[#E2EAE5] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#EAF8F1] text-[#16A36A] hover:bg-[#16A36A] hover:text-white transition shadow-2xs"
                      title="Buka Chat WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setViewingLead(lead)}
                      className="p-2 rounded-xl bg-[#F7FAF8] text-[#0B3D2E] hover:bg-white hover:border hover:border-[#16A36A] transition"
                      title="Lihat Detail Customer & Template WA"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingLead(lead)}
                      className="p-2 rounded-xl text-[#64756D] hover:text-[#0B3D2E] hover:bg-[#F7FAF8] transition"
                      title="Edit Data Lead"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteLead(lead.id)}
                      className="p-2 rounded-xl text-[#64756D] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition"
                      title="Hapus Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Tambah Lead */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2EAE5] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
              <h3 className="text-lg font-extrabold text-[#0B3D2E]">
                Tambah Prospek Lead Baru
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
                <label className="font-bold text-[#0B3D2E]">Nama Lengkap / Kontak *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Bambang Sutrisno"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Perusahaan / Usaha</label>
                  <input
                    type="text"
                    placeholder="Contoh: UD Berkah Jaya"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">No. WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Sumber Lead</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  >
                    {SOURCES.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Tahap Pipeline Awal</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value as PipelineStage })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  >
                    {STAGES.map((stg) => (
                      <option key={stg} value={stg}>
                        {stg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Minat Produk / Jasa</label>
                  <input
                    type="text"
                    placeholder="Nama produk atau layanan"
                    value={formData.interestProduct}
                    onChange={(e) => setFormData({ ...formData, interestProduct: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Estimasi Nilai (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    step="500000"
                    value={formData.potentialValue}
                    onChange={(e) => setFormData({ ...formData, potentialValue: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Catatan Percakapan / Kebutuhan</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan catatan singkat mengenai prospek ini..."
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
                  Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Lead */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2EAE5] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2EAE5]">
              <h3 className="text-lg font-extrabold text-[#0B3D2E]">
                Edit Data Lead: {editingLead.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingLead(null)}
                className="p-1 rounded-lg text-[#64756D] hover:text-[#10231B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Perusahaan</label>
                  <input
                    type="text"
                    value={editingLead.company}
                    onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">No. WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Minat Produk</label>
                  <input
                    type="text"
                    value={editingLead.interestProduct}
                    onChange={(e) => setEditingLead({ ...editingLead, interestProduct: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#0B3D2E]">Potensi Nilai (Rp)</label>
                  <input
                    type="number"
                    value={editingLead.potentialValue}
                    onChange={(e) => setEditingLead({ ...editingLead, potentialValue: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0B3D2E]">Catatan</label>
                <textarea
                  rows={3}
                  value={editingLead.notes}
                  onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E2EAE5] focus:outline-none focus:border-[#16A36A]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2EAE5] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E2EAE5] font-semibold text-[#64756D] hover:bg-[#F7FAF8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0B3D2E] text-white font-bold hover:bg-[#16A36A] transition shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Detail Customer & Quick WhatsApp Templates */}
      {viewingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E2EAE5] max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#E2EAE5]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-[#0B3D2E]">
                    {viewingLead.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF8F1] text-[#16A36A]">
                    {viewingLead.stage}
                  </span>
                </div>
                <p className="text-xs text-[#64756D]">{viewingLead.company}</p>
              </div>

              <button
                type="button"
                onClick={() => setViewingLead(null)}
                className="p-1 rounded-lg text-[#64756D] hover:text-[#10231B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contacts & Pipeline Stage Control */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-1">
                <span className="text-[#64756D]">Kontak WhatsApp:</span>
                <div className="font-bold text-[#10231B] flex items-center justify-between">
                  <span>{viewingLead.phone}</span>
                  <a
                    href={`https://wa.me/${viewingLead.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#16A36A] hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Buka WA
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-1">
                <span className="text-[#64756D]">Ubah Tahap Pipeline:</span>
                <select
                  value={viewingLead.stage}
                  onChange={(e) => {
                    const newStage = e.target.value as PipelineStage;
                    onUpdateStage(viewingLead.id, newStage);
                    setViewingLead({ ...viewingLead, stage: newStage });
                  }}
                  className="w-full py-1 text-xs font-bold text-[#0B3D2E] bg-white border border-[#D1DDD6] rounded-lg px-2"
                >
                  {STAGES.map((stg) => (
                    <option key={stg} value={stg}>
                      {stg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes Section */}
            <div className="p-3.5 rounded-2xl bg-[#EAF8F1] border border-[#D1DDD6] space-y-1 text-xs">
              <span className="font-bold text-[#0B3D2E]">Catatan Percakapan:</span>
              <p className="text-[#10231B]">{viewingLead.notes}</p>
            </div>

            {/* WhatsApp Quick Message Templates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#0B3D2E] uppercase tracking-wider">
                  Template Pesan WhatsApp Siap Pakai
                </h4>
                <span className="text-[11px] text-[#64756D]">Klik untuk salin teks</span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    title: '1. Perkenalan & Follow-up Kebutuhan',
                    text: `Halo ${viewingLead.name}, perkenalkan saya dari tim sales DINAMIS. Melanjutkan kontak dari ${viewingLead.source}, apakah ada kebutuhan spesifik terkait ${viewingLead.interestProduct} yang dapat kami bantu hitungkan?`,
                  },
                  {
                    title: '2. Kirim Penawaran & Diskon Paket',
                    text: `Halo ${viewingLead.name}, berikut kami lampirkan ringkasan solusi ${viewingLead.interestProduct} untuk ${viewingLead.company} dengan estimasi nilai Rp ${viewingLead.potentialValue.toLocaleString('id-ID')}. Kapan waktu yang pas untuk diskusi singkat via telepon?`,
                  },
                  {
                    title: '3. Konfirmasi Closing & Rekening Pembayaran',
                    text: `Halo ${viewingLead.name}, terima kasih atas konfirmasi pemesanan ${viewingLead.interestProduct}. Untuk proses administrasi dan aktivasi, silakan transfer DP ke rekening BCA 123-456-7890 an DINAMIS.`,
                  },
                ].map((tmpl, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#F7FAF8] border border-[#E2EAE5] space-y-1.5 text-xs hover:border-[#16A36A] transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0B3D2E]">{tmpl.title}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(tmpl.text, idx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#D1DDD6] text-[#0B3D2E] font-semibold text-[11px] hover:bg-[#EAF8F1] transition shadow-2xs"
                      >
                        {copiedTemplateIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-[#16A36A]" />
                            <span className="text-[#16A36A]">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#64756D]" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#64756D] bg-white p-2 rounded-xl border border-[#E2EAE5] leading-relaxed">
                      {tmpl.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2EAE5] flex justify-end">
              <button
                type="button"
                onClick={() => setViewingLead(null)}
                className="px-5 py-2.5 rounded-xl bg-[#0B3D2E] text-white font-bold text-xs hover:bg-[#16A36A] transition"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
