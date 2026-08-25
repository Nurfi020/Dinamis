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
      const res = await fetch('/api/license/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: newKeyNotes.trim() || undefined,
          prefix: keyPrefix,
        }),
      });
      const json = await res.json();

      if (json.success && json.licenseKey) {
        setFreshGeneratedKey(json.licenseKey);
        setNewKeyNotes('');
        await fetchLicenses();
      } else {
        setError(json.error || 'Gagal membuat kunci lisensi baru.');
      }
    } catch (err: any) {
      setError(err.message || 'Gagal menghubungi server.');
    } finally {
      setGenerating(false);
    }
  };

  const handleResetDevice = async (licenseId: string) => {
    if (!confirm('Apakah Anda yakin ingin me-reset (melepaskan) perangkat dari lisensi ini? User dapat mengaktifkannya di perangkat baru.')) {
      return;
    }

    setActionLoadingId(licenseId);
    try {
      const res = await fetch('/api/license/admin/reset-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId }),
      });
      const json = await res.json();

      if (json.success) {
        await fetchLicenses();
      } else {
        alert(json.error || 'Gagal me-reset perangkat.');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRevoke = async (licenseId: string) => {
    if (!confirm('PERINGATAN: Mencabut (revoke) lisensi akan menonaktifkannya secara permanen! Lanjutkan?')) {
      return;
    }

    setActionLoadingId(licenseId);
    try {
      const res = await fetch('/api/license/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId, status: 'revoked' }),
      });
      const json = await res.json();

      if (json.success) {
        await fetchLicenses();
      } else {
        alert(json.error || 'Gagal mencabut lisensi.');
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
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString('id-ID', {
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
    <div className="min-h-screen bg-[#F7F9F8] text-[#17221C] p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="p-2 rounded-xl bg-[#F7F9F8] hover:bg-[#E8F7EF] border border-[#E2E9E4] text-[#66736B] hover:text-[#006B3C] transition-colors cursor-pointer"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#00A651]" />
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#17221C] tracking-tight">
                  Manajemen Lisensi Admin
                </h1>
              </div>
              <p className="text-xs text-[#66736B] mt-0.5">
                Kelola kunci lisensi lifetime, reset binding perangkat, dan buat lisensi baru
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchLicenses}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F7F9F8] border border-[#E2E9E4] text-xs font-semibold text-[#17221C] flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Muat Ulang</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Section: Generate License Key */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00A651]" />
            <h2 className="text-base font-bold text-[#17221C]">Generate Kunci Lisensi Baru</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold text-[#17221C] mb-1">Prefix Format</label>
              <select
                value={keyPrefix}
                onChange={(e) => setKeyPrefix(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] font-mono focus:outline-none focus:border-[#00A651]"
              >
                <option value="DINA">DINA (Dinamis / Lifetime)</option>
                <option value="KLDN">KLDN (Legacy Kelola Lead)</option>
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-[11px] font-bold text-[#17221C] mb-1">Catatan Pengguna / Pembeli</label>
              <input
                type="text"
                placeholder="Contoh: Lisensi Budi Santoso - PT Maju Jaya"
                value={newKeyNotes}
                onChange={(e) => setNewKeyNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] focus:outline-none focus:border-[#00A651]"
              />
            </div>

            <div className="sm:col-span-3 flex items-end">
              <button
                type="button"
                onClick={handleGenerateKey}
                disabled={generating}
                className="w-full py-2.5 px-4 rounded-xl bg-[#00A651] hover:bg-[#006B3C] disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{generating ? 'Membuat...' : 'Buat Lisensi'}</span>
              </button>
            </div>
          </div>

          {/* Fresh Generated Key Card */}
          {freshGeneratedKey && (
            <div className="p-4 rounded-xl bg-[#E8F7EF] border border-[#A7F3D0] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#006B3C] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                  Kunci Lisensi Baru Berhasil Dibuat!
                </span>
                <span className="text-[10px] text-[#66736B]">Simpan kunci ini sebelum menutup</span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-[#A7F3D0]">
                <span className="font-mono font-bold text-sm tracking-wider text-[#17221C] select-all">
                  {freshGeneratedKey}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(freshGeneratedKey, 'fresh')}
                  className="px-3 py-1.5 rounded-lg bg-[#E8F7EF] hover:bg-[#A7F3D0] text-xs font-bold text-[#006B3C] flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === 'fresh' ? <Check className="w-3.5 h-3.5 text-[#00A651]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'fresh' ? 'Tersalin!' : 'Salin Kunci'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section: License List & Filters */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#00A651]" />
              <h2 className="text-base font-bold text-[#17221C]">
                Daftar Lisensi Terdaftar ({licenses.length})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]" />
                <input
                  type="text"
                  placeholder="Cari ID, catatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] focus:outline-none focus:border-[#00A651] w-48 sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] focus:outline-none focus:border-[#00A651] cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-12 text-center text-xs text-[#66736B] flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#00A651]" />
              <span>Memuat data lisensi...</span>
            </div>
          ) : licenses.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#66736B] bg-[#F7F9F8] rounded-xl border border-[#E2E9E4]">
              Tidak ada data lisensi yang ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#E2E9E4] rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F7F9F8] text-[#66736B] border-b border-[#E2E9E4] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-4 py-3">Kunci (Masked)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Perangkat Terikat</th>
                    <th className="px-4 py-3">Catatan</th>
                    <th className="px-4 py-3">Dibuat</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E9E4]">
                  {licenses.map((lic) => (
                    <tr key={lic.id} className="hover:bg-[#F7F9F8] transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#17221C]">
                        {lic.isTest ? 'DINA-TEST-TEST-0001' : `••••-••••-••••-${lic.licenseKeyLast4}`}
                        {lic.isTest && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[9px] font-bold">
                            TEST
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            lic.status === 'active'
                              ? 'bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]'
                              : lic.status === 'pending'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {lic.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-[#66736B]">
                        {lic.activeDevice ? (
                          <div className="flex items-center gap-1.5 text-[#17221C] font-semibold">
                            <Laptop className="w-3.5 h-3.5 text-[#00A651]" />
                            <span>{lic.activeDevice.deviceName || 'Active Device'}</span>
                          </div>
                        ) : (
                          <span className="italic">Belum terikat</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-[#66736B] max-w-xs truncate">
                        {lic.notes || '-'}
                      </td>

                      <td className="px-4 py-3 text-[#66736B]">
                        {formatDate(lic.createdAt)}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {lic.activeDevice && (
                            <button
                              type="button"
                              onClick={() => handleResetDevice(lic.id)}
                              disabled={actionLoadingId === lic.id}
                              className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Reset Perangkat"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reset Binding</span>
                            </button>
                          )}

                          {lic.status !== 'revoked' && (
                            <button
                              type="button"
                              onClick={() => handleRevoke(lic.id)}
                              disabled={actionLoadingId === lic.id}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}