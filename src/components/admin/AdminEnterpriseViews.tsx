'use client';

import React from 'react';
import { 
  Users, 
  Building2, 
  Activity, 
  Settings, 
  KeyRound, 
  Sparkles, 
  Plus, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Database,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { DEMO_ADMIN_USERS, DEMO_AUDIT_LOGS, DEMO_BRANCHES, DEMO_TEAMS, DEMO_PERSONAS } from '../../data/enterpriseDemoData';
import { formatRupiah } from '../../utils/helpers';

export const AdminUsersView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
              Manajemen Pengguna & Role Akses
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
              Demo Preview • Data Simulasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#66736B] mt-1">
            Daftar akun pengguna terdaftar pada organisasi {DEMO_PERSONAS.admin.organization}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Fitur Tambah Pengguna Baru tersedia pada Enterprise Production Version.')}
            className="px-3.5 py-2 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Pengguna</span>
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto border border-[#E2E9E4] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9F8] text-[#66736B] border-b border-[#E2E9E4] uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Nama Pengguna</th>
                <th className="px-4 py-3">Kontak Email / WA</th>
                <th className="px-4 py-3">Role & Jabatan</th>
                <th className="px-4 py-3">Kantor Cabang / Tim</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aktivitas Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E4]">
              {DEMO_ADMIN_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-[#F7F9F8] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#17221C]">{user.name}</div>
                    <div className="text-[10px] text-[#66736B]">ID: {user.id}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[#17221C] font-semibold">{user.email}</div>
                    <div className="text-[10px] text-[#66736B] font-mono">{user.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#17221C]">{user.branch}</div>
                    <div className="text-[10px] text-[#66736B]">{user.team}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#66736B]">
                    {user.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminBranchesView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
              Master Kantor Cabang & Unit Tim Sales
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
              Demo Preview • Data Simulasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#66736B] mt-1">
            Hierarki organisasi cabang regional dan alokasi tim sales.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEMO_BRANCHES.map((branch) => (
          <div key={branch.id} className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
                {branch.city}
              </span>
              <span className="text-xs text-[#66736B] font-semibold">{branch.teamsCount} Tim Sales</span>
            </div>
            <h3 className="text-base font-bold text-[#17221C]">{branch.name}</h3>
            <p className="text-xs text-[#66736B]">Kepala Cabang: <b className="text-[#17221C]">{branch.headName}</b></p>
            <div className="pt-2 border-t border-[#E2E9E4] flex items-center justify-between text-xs">
              <span className="text-[#66736B]">Sales Force: <b className="text-[#17221C]">{branch.salesCount} Reps</b></span>
              <span className="text-[#006B3C] font-mono font-bold">{formatRupiah(branch.pipelineValue)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminAuditLogView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
              Audit Trail & Activity Log
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
              Integritas Log Terjamin • Data Simulasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#66736B] mt-1">
            Riwayat kronologis seluruh tindakan staf sales, perubahan status lead, dan rekam audit keamanan.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto border border-[#E2E9E4] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9F8] text-[#66736B] border-b border-[#E2E9E4] uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Waktu Log</th>
                <th className="px-4 py-3">Pelaku Aksi</th>
                <th className="px-4 py-3">Jenis Tindakan</th>
                <th className="px-4 py-3">Target Entitas</th>
                <th className="px-4 py-3">Rincian Keterangan</th>
                <th className="px-4 py-3 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E9E4]">
              {DEMO_AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F9F8] transition-colors">
                  <td className="px-4 py-3 font-semibold text-[#66736B] whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#17221C]">{log.userName}</div>
                    <div className="text-[10px] text-[#66736B]">{log.userRole}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#17221C]">{log.entityName}</td>
                  <td className="px-4 py-3 text-[#66736B]">{log.details}</td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] text-[#66736B]">{log.ipAddress || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AdminSettingsView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 md:pb-12">
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E2E9E4]">
          <Settings className="w-5 h-5 text-[#00A651]" />
          <h2 className="text-base font-bold text-[#17221C]">Konfigurasi Sistem CRM Enterprise</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#17221C]">Manajemen Lisensi Lifetime & Perangkat</div>
              <div className="text-[11px] text-[#66736B]">Kelola hash lisensi produk KEL0LA-LEAD dan unbind device.</div>
            </div>
            <a
              href="/admin/licenses"
              className="px-3 py-1.5 rounded-lg bg-[#00A651] hover:bg-[#006B3C] text-white text-xs font-bold flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Buka Server Lisensi</span>
            </a>
          </div>

          <div className="p-4 bg-[#F7F9F8] rounded-xl border border-[#E2E9E4] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#17221C]">Mode Demonstrasi & Watermark</div>
              <div className="text-[11px] text-[#66736B]">Label data simulasi aktif untuk presentasi komersial.</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] text-xs font-bold">
              Aktif
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
