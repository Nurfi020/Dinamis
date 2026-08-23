'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Search,
  ArrowLeft,
  AlertTriangle,
  Laptop,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';

interface LicenseItem {
  id: string;
  licenseKeyLast4: string;
  productCode: string;
  plan: string;
  status: 'pending' | 'active' | 'suspended' | 'revoked';
  maxDevices: number;
  isTest?: boolean;
  notes?: string;
  createdAt: string;
  activatedAt: string | null;
  lastVerifiedAt: string | null;
  revokedAt: string | null;
  expiresAt: null;
  activeDevice?: {
    deviceId: string;
    deviceName: string;
    browser: string;
    operatingSystem: string;
    activatedAt: string;
    lastSeenAt: string;
  } | null;
}

export default function AdminLicensesPage() {
  const router = useRouter();
  const [licenses, setLicenses] = useState<LicenseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Generator state
  const [generating, setGenerating] = useState<boolean>(false);
  const [newKeyNotes, setNewKeyNotes] = useState<string>('');
  const [keyPrefix, setKeyPrefix] = useState<string>('DINA');
  const [freshGeneratedKey, setFreshGeneratedKey] = useState<string | null>(null);

  // Copied state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Action loading states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (searchTerm) query.set('search', searchTerm);
      if (statusFilter !== 'all') query.set('status', statusFilter);

      const res = await fetch(`/api/license/admin/list?${query.toString()}`);
      const json = await res.json();

      if (json.success && Array.isArray(json.licenses)) {
        setLicenses(json.licenses);
      } else {
        setError(json.error || 'Gagal memuat daftar lisensi.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  const handleGenerateKey = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/license/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: newKeyNotes || 'Dinamis Lifetime License Key',
          prefix: keyPrefix || 'DINA',
        }),
      });
      const data = await res.json();

      if (data.success && data.key) {
        setFreshGeneratedKey(data.key);
        setNewKeyNotes('');
        await fetchLicenses();
      } else {
        setError(data.error || 'Gagal membuat License Key.');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal membuat License Key.');
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (licenseId: string) => {
    if (!confirm('Apakah Anda yakin ingin MENCABUT (Revoke) lisensi ini? Akses perangkat akan langsung dihentikan dan tidak dapat diaktifkan kembali.')) {
      return;
    }

    setActionLoadingId(licenseId);
    try {
      const res = await fetch('/api/license/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId }),
      });
      const data = await res.json();

      if (data.success) {
        await fetchLicenses();
      } else {
        alert(data.error || 'Gagal mencabut lisensi.');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleResetDevice = async (licenseId: string) => {
    if (!confirm('Reset ikatan perangkat untuk lisensi ini? Perangkat lama akan dilepaskan sehingga lisensi dapat dipasang di perangkat baru.')) {
      return;
    }

    setActionLoadingId(licenseId);
    try {
      const res = await fetch('/api/license/admin/reset-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId }),
      });
      const data = await res.json();

      if (data.success) {
        await fetchLicenses();
      } else {
        alert(data.error || 'Gagal mereset perangkat.');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Stats calculation
  const totalCount = licenses.length;
  const activeCount = licenses.filter((l) => l.status === 'active').length;
  const pendingCount = licenses.filter((l) => l.status === 'pending').length;
  const revokedCount = licenses.filter((l) => l.status === 'revoked').length;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="admin-licenses-page" className="min-h-screen bg-[#06111F] text-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Navigation / Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0E233D] pb-5">
          <div className="flex items-center gap-3">
            <button
              id="back-to-dashboard-btn"
              type="button"
              onClick={() => router.push('/')}
              className="p-2.5 rounded-xl bg-[#0B1B2B] hover:bg-[#168BFF] text-white transition-colors border border-[#163354]"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#168BFF]" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Admin License Management
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#168BFF]/20 text-[#168BFF] border border-[#168BFF]/30">
                  Prisma Server DB
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Kelola hak akses, status aktivasi, dan kebijakan 1 Perangkat untuk seluruh Lisensi Lifetime.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="refresh-licenses-btn"
              type="button"
              onClick={fetchLicenses}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-[#0B1B2B] hover:bg-[#163354] text-xs font-semibold text-[#94A3B8] hover:text-white border border-[#163354] flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Segarkan Data</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#0B1B2B]/80 border border-[#163354] space-y-1">
            <p className="text-[11px] font-medium text-[#94A3B8]">Total Lisensi</p>
            <p className="text-2xl font-bold text-white">{totalCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0B1B2B]/80 border border-emerald-500/30 space-y-1">
            <p className="text-[11px] font-medium text-emerald-400">Aktif Terpasang</p>
            <p className="text-2xl font-bold text-emerald-400">{activeCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0B1B2B]/80 border border-amber-500/30 space-y-1">
            <p className="text-[11px] font-medium text-amber-400">Menunggu Aktivasi (Pending)</p>
            <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-[#0B1B2B]/80 border border-rose-500/30 space-y-1">
            <p className="text-[11px] font-medium text-rose-400">Dicabut (Revoked)</p>
            <p className="text-2xl font-bold text-rose-400">{revokedCount}</p>
          </div>
        </div>

        {/* Generator Panel */}
        <div id="license-generator-card" className="p-5 rounded-2xl bg-gradient-to-br from-[#0B1B2B] to-[#081524] border border-[#168BFF]/30 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#168BFF]/20 border border-[#168BFF]/40 flex items-center justify-center text-[#168BFF]">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Generate License Key Baru</h2>
                <p className="text-[11px] text-[#94A3B8]">
                  Buat License Key kriptografis format standar DINA-XXXX-XXXX-XXXX.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-3 space-y-1">
              <label className="text-[11px] font-semibold text-[#94A3B8]">Format Prefix</label>
              <select
                value={keyPrefix}
                onChange={(e) => setKeyPrefix(e.target.value)}
                className="w-full px-3 py-2 bg-[#06111F] border border-[#163354] rounded-xl text-xs text-white focus:outline-none focus:border-[#168BFF]"
              >
                <option value="DINA">DINA-XXXX-XXXX-XXXX</option>
                <option value="KLDN-LIFE">KLDN-LIFE-XXXX-XXXX-XXXX</option>
              </select>
            </div>

            <div className="sm:col-span-6 space-y-1">
              <label className="text-[11px] font-semibold text-[#94A3B8]">Catatan Lisensi / Klien</label>
              <input
                type="text"
                value={newKeyNotes}
                onChange={(e) => setNewKeyNotes(e.target.value)}
                placeholder="Contoh: Pembelian Lifetime User PT Dinamis Digital"
                className="w-full px-3 py-2 bg-[#06111F] border border-[#163354] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#168BFF]"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                id="generate-license-btn"
                type="button"
                onClick={handleGenerateKey}
                disabled={generating}
                className="w-full py-2 px-4 rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(22,139,255,0.4)] disabled:opacity-50"
              >
                {generating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>Generate License</span>
              </button>
            </div>
          </div>

          {/* Freshly Generated Key Alert */}
          {freshGeneratedKey && (
            <div id="fresh-key-banner" className="p-4 rounded-xl bg-[#168BFF]/10 border border-[#168BFF]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#168BFF]" />
                  <span className="text-xs font-bold text-white">License Key Baru Berhasil Dibuat:</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-sm md:text-base font-mono font-bold text-[#38BDF8] tracking-wider bg-[#06111F] px-3 py-1 rounded-lg border border-[#163354]">
                    {freshGeneratedKey}
                  </code>
                </div>
                <p className="text-[10px] text-amber-300 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Salin dan berikan key ini ke pengguna. Server hanya menyimpan hash untuk keamanan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(freshGeneratedKey, 'fresh-key')}
                className="px-4 py-2 rounded-lg bg-[#168BFF] hover:bg-[#168BFF]/90 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shadow-[0_0_10px_rgba(22,139,255,0.3)]"
              >
                {copiedId === 'fresh-key' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy License</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#0B1B2B] p-1 rounded-xl border border-[#163354] overflow-x-auto">
            {['all', 'pending', 'active', 'suspended', 'revoked'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-[#168BFF] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#163354]/50'
                }`}
              >
                {tab === 'all' ? 'Semua Status' : tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari ID, 4 digit akhir, catatan..."
              className="w-full pl-9 pr-3 py-2 bg-[#0B1B2B] border border-[#163354] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#168BFF]"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-[#0B1B2B] border border-[#163354] rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-[#94A3B8] space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#168BFF]" />
              <p className="text-xs">Memuat data lisensi dari database...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-rose-400 space-y-2">
              <AlertTriangle className="w-6 h-6 mx-auto" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          ) : licenses.length === 0 ? (
            <div className="p-12 text-center text-[#94A3B8] space-y-2">
              <KeyRound className="w-6 h-6 mx-auto opacity-40" />
              <p className="text-xs">Tidak ada lisensi yang cocok dengan kriteria pencarian.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#06111F]/90 text-[#94A3B8] border-b border-[#163354] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Key / Last 4</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Product & Plan</th>
                    <th className="px-4 py-3 font-semibold">Max Devices</th>
                    <th className="px-4 py-3 font-semibold">Perangkat Terpasang</th>
                    <th className="px-4 py-3 font-semibold">Created At</th>
                    <th className="px-4 py-3 font-semibold">Activated At</th>
                    <th className="px-4 py-3 font-semibold">Last Verified</th>
                    <th className="px-4 py-3 font-semibold">Revoked At</th>
                    <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#163354]/60">
                  {licenses.map((lic) => {
                    const isRevoked = lic.status === 'revoked';
                    const isSuspended = lic.status === 'suspended';
                    const isActive = lic.status === 'active';

                    return (
                      <tr
                        key={lic.id}
                        className={`hover:bg-[#163354]/20 transition-colors ${
                          isRevoked ? 'opacity-60 bg-rose-950/10' : ''
                        }`}
                      >
                        {/* Key / Last 4 */}
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-semibold text-white">
                                ••••-••••-••••-{lic.licenseKeyLast4}
                              </span>
                              {lic.isTest && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  TEST
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#64748B] font-mono">
                              ID: {lic.id}
                            </div>
                            {lic.notes && (
                              <div className="text-[10px] text-[#94A3B8] italic truncate max-w-xs">
                                {lic.notes}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          {lic.status === 'active' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          )}
                          {lic.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                          {lic.status === 'suspended' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">
                              <Ban className="w-3 h-3" />
                              Suspended
                            </span>
                          )}
                          {lic.status === 'revoked' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <XCircle className="w-3 h-3" />
                              Revoked
                            </span>
                          )}
                        </td>

                        {/* Product & Plan */}
                        <td className="px-4 py-3">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-white block">{lic.productCode}</span>
                            <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-500/20 text-blue-300">
                              {lic.plan.toUpperCase()} (No Expiry)
                            </span>
                          </div>
                        </td>

                        {/* Max Devices */}
                        <td className="px-4 py-3">
                          <span className="font-semibold text-white">
                            {lic.maxDevices || 1} Device
                          </span>
                        </td>

                        {/* Active Device */}
                        <td className="px-4 py-3">
                          {lic.activeDevice ? (
                            <div className="space-y-0.5 max-w-[200px]">
                              <div className="flex items-center gap-1 text-white font-medium truncate">
                                <Laptop className="w-3 h-3 text-[#168BFF] shrink-0" />
                                <span className="truncate">{lic.activeDevice.deviceName}</span>
                              </div>
                              <div className="text-[10px] text-[#64748B] truncate">
                                {lic.activeDevice.operatingSystem} • {lic.activeDevice.browser}
                              </div>
                              <div className="text-[9px] text-[#94A3B8]">
                                Last Seen: {formatDate(lic.activeDevice.lastSeenAt)}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[#64748B] italic">Belum terikat</span>
                          )}
                        </td>

                        {/* Created At */}
                        <td className="px-4 py-3 text-[#94A3B8] whitespace-nowrap">
                          {formatDate(lic.createdAt)}
                        </td>

                        {/* Activated At */}
                        <td className="px-4 py-3 text-[#94A3B8] whitespace-nowrap">
                          {formatDate(lic.activatedAt)}
                        </td>

                        {/* Last Verified */}
                        <td className="px-4 py-3 text-[#94A3B8] whitespace-nowrap">
                          {formatDate(lic.lastVerifiedAt)}
                        </td>

                        {/* Revoked At */}
                        <td className="px-4 py-3 text-rose-400 whitespace-nowrap">
                          {formatDate(lic.revokedAt)}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {lic.activeDevice && !isRevoked && (
                              <button
                                type="button"
                                onClick={() => handleResetDevice(lic.id)}
                                disabled={actionLoadingId === lic.id}
                                className="p-1.5 rounded-lg bg-[#0E233D] hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                                title="Reset Perangkat (Lepaskan Device)"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {!isRevoked && (
                              <button
                                type="button"
                                onClick={() => handleRevoke(lic.id)}
                                disabled={actionLoadingId === lic.id}
                                className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-semibold transition-colors flex items-center gap-1"
                                title="Cabut Lisensi Permanen"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Revoke</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
