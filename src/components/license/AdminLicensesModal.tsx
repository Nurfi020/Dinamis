'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Key, 
  Laptop, 
  RotateCcw, 
  Plus, 
  Check, 
  Copy, 
  Search, 
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LicenseDevice {
  deviceId: string;
  deviceName: string;
  boundAt: string;
}

interface StoredLicenseRecord {
  id: string;
  plan: 'lifetime';
  status: 'active' | 'pending' | 'suspended' | 'revoked';
  productCode: 'KEL0LA-LEAD';
  licenseKeyLast4: string;
  activeDevice?: LicenseDevice | null;
  notes?: string;
  isTest?: boolean;
  createdAt: string;
}

interface AdminLicensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKeyToActivate?: (key: string) => void;
}

export const AdminLicensesModal: React.FC<AdminLicensesModalProps> = ({
  isOpen,
  onClose,
  onSelectKeyToActivate,
}) => {
  const [licenses, setLicenses] = useState<StoredLicenseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New Key Generation form state
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyNotes, setNewKeyNotes] = useState('');
  const [newKeyCount, setNewKeyCount] = useState(1);
  const [generatedBatch, setGeneratedBatch] = useState<string[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchLicenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.set('status', filterStatus);
      if (search) params.set('search', search);

      const res = await fetch(`/api/license/admin/list?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.licenses) {
        setLicenses(json.licenses);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [filterStatus, search]);

  useEffect(() => {
    if (isOpen) {
      fetchLicenses();
    }
  }, [isOpen, fetchLicenses]);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsGenerating(true);
      setMessage(null);

      const res = await fetch('/api/license/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: newKeyCount,
          notes: newKeyNotes || 'Dibuat via Admin Panel',
        }),
      });

      const json = await res.json();
      if (json.success && json.keys) {
        setGeneratedBatch(json.keys);
        setMessage({
          type: 'success',
          text: `Berhasil membuat ${json.keys.length} License Key baru!`,
        });
        setNewKeyNotes('');
        fetchLicenses();
      } else {
        setMessage({
          type: 'error',
          text: json.error || 'Gagal membuat license key.',
        });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat membuat lisensi.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetDevice = async (licenseId: string) => {
    if (!confirm('Lepaskan perangkat terikat dari lisensi ini agar bisa digunakan di perangkat baru?')) {
      return;
    }

    try {
      const res = await fetch('/api/license/admin/reset-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage({ type: 'success', text: 'Device binding berhasil di-reset!' });
        fetchLicenses();
      } else {
        setMessage({ type: 'error', text: json.error || 'Gagal me-reset device.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Koneksi gagal saat me-reset device.' });
    }
  };

  const handleUpdateStatus = async (licenseId: string, status: string) => {
    try {
      const res = await fetch('/api/license/admin/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId, status }),
      });

      const json = await res.json();
      if (json.success) {
        fetchLicenses();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-[#E2E9E4] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden text-left">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E2E9E4] flex items-center justify-between bg-[#F7F9F8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A651] flex items-center justify-center text-white shadow-sm">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221C]">Manajemen Lisensi Admin</h3>
              <p className="text-xs text-[#66736B]">Kelola, Generate & Reset Kunci Lisensi Lifetime</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#66736B] hover:text-[#17221C] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Notification Alert */}
          {message && (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 ${
                message.type === 'success'
                  ? 'bg-[#E8F7EF] border-[#A7F3D0] text-[#006B3C]'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#00A651] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span className="font-semibold">{message.text}</span>
            </div>
          )}

          {/* Generate New License Keys Section */}
          <div className="p-4 rounded-xl bg-[#F7F9F8] border border-[#E2E9E4] space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00A651]" />
              <h4 className="text-sm font-bold text-[#17221C]">Generate Kunci Lisensi Baru</h4>
            </div>

            <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-[#17221C] mb-1">Jumlah Kunci</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newKeyCount}
                  onChange={(e) => setNewKeyCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 bg-white border border-[#E2E9E4] rounded-xl text-[#17221C] focus:outline-none focus:border-[#00A651]"
                />
              </div>

              <div className="sm:col-span-6">
                <label className="block text-[11px] font-bold text-[#17221C] mb-1">Catatan / Keterangan</label>
                <input
                  type="text"
                  placeholder="Contoh: Batch Sales PT ABC"
                  value={newKeyNotes}
                  onChange={(e) => setNewKeyNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E2E9E4] rounded-xl text-[#17221C] focus:outline-none focus:border-[#00A651]"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-2 px-3 rounded-xl bg-[#00A651] hover:bg-[#006B3C] disabled:opacity-50 text-white font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isGenerating ? 'Membuat...' : 'Buat Kunci'}</span>
                </button>
              </div>
            </form>

            {/* Generated Output */}
            {generatedBatch.length > 0 && (
              <div className="p-3 bg-white rounded-xl border border-[#A7F3D0] space-y-2">
                <span className="text-[11px] font-bold text-[#006B3C] block">
                  Kunci Baru Berhasil Dibuat (Simpan Kunci Ini):
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto font-mono text-xs">
                  {generatedBatch.map((k, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#F7F9F8]">
                      <span className="text-[#17221C] font-bold">{k}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(k)}
                          className="px-2 py-1 rounded bg-[#E8F7EF] hover:bg-[#A7F3D0] text-[#006B3C] text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === k ? <Check className="w-3 h-3 text-[#00A651]" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === k ? 'Disalin' : 'Salin'}</span>
                        </button>
                        {onSelectKeyToActivate && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectKeyToActivate(k);
                              onClose();
                            }}
                            className="px-2 py-1 rounded bg-[#00A651] text-white font-bold text-[11px] cursor-pointer"
                          >
                            Pakai Ini
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#66736B]" />
              <input
                type="text"
                placeholder="Cari ID, catatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] focus:outline-none focus:border-[#00A651]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white border border-[#E2E9E4] rounded-xl text-xs text-[#17221C] focus:outline-none focus:border-[#00A651] cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending (Belum Aktif)</option>
                <option value="active">Active (Terikat Perangkat)</option>
                <option value="suspended">Suspended</option>
                <option value="revoked">Revoked</option>
              </select>

              <button
                type="button"
                onClick={fetchLicenses}
                className="p-2 bg-white hover:bg-[#F7F9F8] border border-[#E2E9E4] rounded-xl text-[#66736B] hover:text-[#17221C] transition-colors cursor-pointer"
                title="Refresh Daftar"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table / List */}
          <div className="space-y-3">
            {licenses.map((lic) => {
              const fullMasked = `DINA-****-****-${lic.licenseKeyLast4}`;
              const testKeyDirect = lic.isTest ? 'DINA-TEST-TEST-0001' : null;

              return (
                <div
                  key={lic.id}
                  className="p-4 rounded-xl bg-white border border-[#E2E9E4] hover:border-[#00A651]/40 transition-colors space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Key className="w-4 h-4 text-[#00A651]" />
                      <span className="font-mono font-bold text-[#17221C] text-xs">
                        {testKeyDirect || fullMasked}
                      </span>
                      {lic.isTest && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                          TEST KEY (DEV)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lic.status === 'active'
                            ? 'bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]'
                            : lic.status === 'pending'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {lic.status}
                      </span>

                      {/* Quick copy if test key */}
                      {testKeyDirect && (
                        <button
                          type="button"
                          onClick={() => handleCopy(testKeyDirect)}
                          className="px-2 py-1 rounded bg-[#F7F9F8] hover:bg-[#E8F7EF] text-[10px] text-[#006B3C] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      )}

                      {onSelectKeyToActivate && testKeyDirect && (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectKeyToActivate(testKeyDirect);
                            onClose();
                          }}
                          className="px-2 py-1 rounded bg-[#00A651] text-white font-bold text-[10px] cursor-pointer"
                        >
                          Pakai Ini
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Device & Meta details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#66736B] bg-[#F7F9F8] p-2.5 rounded-lg border border-[#E2E9E4]">
                    <div>
                      <span className="text-[#66736B] block">Perangkat Terikat (1 Device Policy):</span>
                      {lic.activeDevice ? (
                        <span className="font-bold text-[#17221C] flex items-center gap-1.5 mt-0.5">
                          <Laptop className="w-3.5 h-3.5 text-[#00A651]" />
                          {lic.activeDevice.deviceName || 'Active Device'}
                          <span className="text-[9px] text-[#66736B] font-mono">
                            ({lic.activeDevice.deviceId.slice(0, 12)}...)
                          </span>
                        </span>
                      ) : (
                        <span className="text-[#66736B] italic mt-0.5 block">Belum terikat ke perangkat manapun</span>
                      )}
                    </div>

                    <div>
                      <span className="text-[#66736B] block">Catatan / Keterangan:</span>
                      <span className="text-[#17221C] mt-0.5 block">{lic.notes || '-'}</span>
                    </div>
                  </div>

                  {/* Actions for this license */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                    <div className="text-[#66736B] text-[10px]">
                      Dibuat: {new Date(lic.createdAt).toLocaleDateString('id-ID')}
                    </div>

                    <div className="flex items-center gap-2">
                      {lic.activeDevice && (
                        <button
                          type="button"
                          onClick={() => handleResetDevice(lic.id)}
                          className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Binding Perangkat</span>
                        </button>
                      )}

                      {lic.status === 'active' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lic.id, 'suspended')}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold cursor-pointer"
                        >
                          Suspend
                        </button>
                      ) : lic.status === 'suspended' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lic.id, 'active')}
                          className="px-2 py-1 rounded-lg bg-[#E8F7EF] hover:bg-[#A7F3D0] text-[#006B3C] border border-[#A7F3D0] text-[10px] font-bold cursor-pointer"
                        >
                          Reaktifkan
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}

            {licenses.length === 0 && !loading && (
              <div className="p-8 text-center text-[#66736B] text-xs bg-[#F7F9F8] rounded-xl border border-[#E2E9E4]">
                Tidak ada lisensi yang cocok dengan filter pencarian.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E9E4] bg-[#F7F9F8] flex items-center justify-between text-xs text-[#66736B]">
          <span>Format resmi: DINA-XXXX-XXXX-XXXX</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-[#E2E9E4] text-[#17221C] font-bold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};