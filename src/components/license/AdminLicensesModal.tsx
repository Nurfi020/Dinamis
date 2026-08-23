import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Key, 
  Plus, 
  RotateCcw, 
  Copy, 
  Check, 
  X, 
  Search, 
  Laptop, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { LicenseInfo } from '../../types';

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
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newKeyNotes, setNewKeyNotes] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/license/admin/list?search=${encodeURIComponent(searchTerm)}&status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setLicenses(data.licenses || []);
      }
    } catch (e) {
      console.error('Failed to load admin licenses', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLicenses();
    }
  }, [isOpen, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLicenses();
  };

  const handleCreateNewKey = async () => {
    try {
      const res = await fetch('/api/license/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: newKeyNotes.trim() || 'Admin Generated Lifetime Key' }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedKey(data.key);
        setNewKeyNotes('');
        setActionMessage({ type: 'success', text: `Key baru berhasil dibuat: ${data.key}` });
        fetchLicenses();
      }
    } catch (e: any) {
      setActionMessage({ type: 'error', text: 'Gagal membuat license key.' });
    }
  };

  const handleResetDevice = async (licenseId: string) => {
    if (!confirm('Lepaskan perangkat yang terikat dengan lisensi ini?')) return;
    try {
      const res = await fetch('/api/license/admin/reset-device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: 'success', text: 'Perangkat berhasil dilepaskan dari lisensi.' });
        fetchLicenses();
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Gagal mereset perangkat.' });
    }
  };

  const handleUpdateStatus = async (licenseId: string, status: string) => {
    try {
      const res = await fetch('/api/license/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licenseId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ type: 'success', text: `Status lisensi diperbarui ke ${status}.` });
        fetchLicenses();
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: 'Gagal memperbarui status.' });
    }
  };

  const handleCopy = (keyText: string) => {
    navigator.clipboard.writeText(keyText);
    setCopiedKey(keyText);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0B1B2E] border border-[#17324D] rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 border-b border-[#17324D] flex items-center justify-between bg-gradient-to-r from-[#0B1B2E] via-[#0E233D] to-[#0B1B2E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Admin License Key Manager</h3>
              <p className="text-xs text-[#94A3B8]">Daftar lisensi lifetime, reset binding perangkat, dan buat key baru</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#17324D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action alert */}
        {actionMessage && (
          <div
            className={`px-5 py-2.5 text-xs font-semibold flex items-center justify-between ${
              actionMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-b border-red-500/20'
            }`}
          >
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)} className="text-xs hover:opacity-70">
              ✕
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Create new key section */}
          <div className="p-4 rounded-xl bg-[#06111F] border border-[#17324D] flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
            <div className="flex-1">
              <label className="text-[11px] font-bold text-[#F8FAFC] block mb-1">
                Generate License Key Lifetime Baru
              </label>
              <input
                type="text"
                value={newKeyNotes}
                onChange={(e) => setNewKeyNotes(e.target.value)}
                placeholder="Catatan lisensi (contoh: Pembeli Budi - Lynk ID #1042)"
                className="w-full px-3 py-1.5 bg-[#0B1B2E] border border-[#17324D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168BFF]"
              />
            </div>
            <button
              type="button"
              onClick={handleCreateNewKey}
              className="px-4 py-2 mt-auto rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(22,139,255,0.3)] shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Key</span>
            </button>
          </div>

          {/* Generated key alert box */}
          {generatedKey && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 block">
                  License Key Baru Siap Digunakan:
                </span>
                <span className="text-base font-mono font-black text-white select-all">
                  {generatedKey}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(generatedKey)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  {copiedKey === generatedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === generatedKey ? 'Tersalin' : 'Salin Key'}</span>
                </button>
                {onSelectKeyToActivate && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectKeyToActivate(generatedKey);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#168BFF] text-white font-bold text-xs"
                  >
                    Gunakan di Form
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari ID, 4 digit terakhir, atau catatan..."
                className="w-full pl-9 pr-3 py-2 bg-[#06111F] border border-[#17324D] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#168BFF]"
              />
            </form>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-[#06111F] border border-[#17324D] rounded-xl text-xs text-white focus:outline-none focus:border-[#168BFF]"
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
                className="p-2 bg-[#06111F] hover:bg-[#0E233D] border border-[#17324D] rounded-xl text-[#94A3B8] hover:text-white transition-colors"
                title="Refresh Daftar"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Table / List */}
          <div className="space-y-3">
            {licenses.map((lic) => {
              const fullMasked = `KLDN-LIFE-****-****-${lic.licenseKeyLast4}`;
              const testKeyDirect = lic.isTest ? 'KLDN-LIFE-TEST-TEST-0001' : null;

              return (
                <div
                  key={lic.id}
                  className="p-4 rounded-xl bg-[#06111F] border border-[#17324D] hover:border-[#168BFF]/40 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Key className="w-4 h-4 text-[#168BFF]" />
                      <span className="font-mono font-bold text-white text-xs">
                        {testKeyDirect || fullMasked}
                      </span>
                      {lic.isTest && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                          TEST KEY (DEV)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lic.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : lic.status === 'pending'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {lic.status}
                      </span>

                      {/* Quick copy if test key */}
                      {testKeyDirect && (
                        <button
                          type="button"
                          onClick={() => handleCopy(testKeyDirect)}
                          className="px-2 py-1 rounded bg-[#0E233D] hover:bg-[#168BFF] text-[10px] text-white flex items-center gap-1 transition-colors"
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
                          className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]"
                        >
                          Pakai Ini
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Device & Meta details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#94A3B8] bg-[#0B1B2E] p-2.5 rounded-lg">
                    <div>
                      <span className="text-slate-400 block">Perangkat Terikat (1 Device Policy):</span>
                      {lic.activeDevice ? (
                        <span className="font-semibold text-white flex items-center gap-1.5 mt-0.5">
                          <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                          {lic.activeDevice.deviceName || 'Active Device'}
                          <span className="text-[9px] text-slate-400 font-mono">
                            ({lic.activeDevice.deviceId.slice(0, 12)}...)
                          </span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic mt-0.5 block">Belum terikat ke perangkat manapun</span>
                      )}
                    </div>

                    <div>
                      <span className="text-slate-400 block">Catatan / Keterangan:</span>
                      <span className="text-white mt-0.5 block">{lic.notes || '-'}</span>
                    </div>
                  </div>

                  {/* Actions for this license */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                    <div className="text-slate-400 text-[10px]">
                      Dibuat: {new Date(lic.createdAt).toLocaleDateString('id-ID')}
                    </div>

                    <div className="flex items-center gap-2">
                      {lic.activeDevice && (
                        <button
                          type="button"
                          onClick={() => handleResetDevice(lic.id)}
                          className="px-2.5 py-1 rounded bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Binding Perangkat</span>
                        </button>
                      )}

                      {lic.status === 'active' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lic.id, 'suspended')}
                          className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px]"
                        >
                          Suspend
                        </button>
                      ) : lic.status === 'suspended' ? (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(lic.id, 'active')}
                          className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]"
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
              <div className="p-8 text-center text-slate-400 text-xs bg-[#06111F] rounded-xl border border-[#17324D]">
                Tidak ada lisensi yang cocok dengan filter pencarian.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#17324D] bg-[#06111F] flex items-center justify-between text-xs text-[#94A3B8]">
          <span>Format resmi: KLDN-LIFE-XXXX-XXXX-XXXX</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#17324D] hover:bg-[#1E4366] text-white font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
