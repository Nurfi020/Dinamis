'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  KeyRound, 
  Activity, 
  Sparkles, 
  Lock, 
  Server, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Database,
  FileText
} from 'lucide-react';
import { DEMO_ADMIN_USERS, DEMO_AUDIT_LOGS, DEMO_BRANCHES, DEMO_PERSONAS } from '../../data/enterpriseDemoData';
import { ActiveTab } from '../../types';

interface AdminDashboardViewProps {
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateToTab,
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* 1. Admin Header Banner */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#17221C] tracking-tight">
              Portal Administrator Sistem — {DEMO_PERSONAS.admin.organization}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0]">
              <Sparkles className="w-3 h-3 text-[#00A651]" />
              System Admin • Data Simulasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#66736B] mt-1">
            Pusat konfigurasi hak akses, manajemen lisensi lifetime, monitoring audit trail, dan data master cabang.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/admin/licenses"
            className="px-4 py-2.5 rounded-xl bg-[#00A651] hover:bg-[#006B3C] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Manajemen Lisensi Server</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* 2. System Status KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Total Pengguna</span>
            <div className="p-1.5 rounded-lg bg-[#E8F7EF] text-[#006B3C]">
              <Users className="w-4 h-4 text-[#00A651]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#17221C] mt-2">{DEMO_ADMIN_USERS.length + 18}</div>
          <div className="text-[11px] text-[#006B3C] font-semibold mt-1">24 Akun Aktif • 3 Role</div>
        </div>

        {/* Branches */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Kantor Cabang</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#17221C] mt-2">{DEMO_BRANCHES.length}</div>
          <div className="text-[11px] text-blue-700 font-medium mt-1">Jakarta, Bandung, Surabaya</div>
        </div>

        {/* License Integrity */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Status Lisensi</span>
            <div className="p-1.5 rounded-lg bg-[#E8F7EF] text-[#006B3C]">
              <ShieldCheck className="w-4 h-4 text-[#00A651]" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-[#006B3C] mt-3">LIFETIME AKTIF</div>
          <div className="text-[11px] text-[#66736B] mt-1 font-mono">KEL0LA-LEAD-ENTERPRISE</div>
        </div>

        {/* Security & Audit Events */}
        <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#66736B] font-semibold">
            <span>Audit Events</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#17221C] mt-2">1,420</div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">Audit Trail Logging Aktif</div>
        </div>
      </div>

      {/* 3. Quick Admin Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 1: User Management */}
        <div 
          onClick={() => onNavigateToTab('users')}
          className="bg-white border border-[#E2E9E4] hover:border-[#00A651]/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#E8F7EF] text-[#006B3C] border border-[#A7F3D0] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5 text-[#00A651]" />
          </div>
          <h3 className="font-bold text-sm text-[#17221C] group-hover:text-[#006B3C] transition-colors flex items-center justify-between">
            <span>Manajemen Pengguna</span>
            <ChevronRight className="w-4 h-4 text-[#66736B]" />
          </h3>
          <p className="text-xs text-[#66736B] mt-1">
            Kelola daftar akun sales, supervisor tim, branch manager, dan hak akses portal.
          </p>
          <div className="mt-3 text-[11px] font-bold text-[#00A651]">Buka Daftar Pengguna →</div>
        </div>

        {/* Module 2: Branch & Teams */}
        <div 
          onClick={() => onNavigateToTab('branches')}
          className="bg-white border border-[#E2E9E4] hover:border-[#00A651]/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#17221C] group-hover:text-blue-700 transition-colors flex items-center justify-between">
            <span>Master Cabang & Tim</span>
            <ChevronRight className="w-4 h-4 text-[#66736B]" />
          </h3>
          <p className="text-xs text-[#66736B] mt-1">
            Konfigurasi hierarki kantor cabang regional dan alokasi unit tim sales perbankan.
          </p>
          <div className="mt-3 text-[11px] font-bold text-blue-600">Buka Master Cabang →</div>
        </div>

        {/* Module 3: Security & Audit Log */}
        <div 
          onClick={() => onNavigateToTab('audit_log')}
          className="bg-white border border-[#E2E9E4] hover:border-[#00A651]/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#17221C] group-hover:text-purple-700 transition-colors flex items-center justify-between">
            <span>Audit & Activity Log</span>
            <ChevronRight className="w-4 h-4 text-[#66736B]" />
          </h3>
          <p className="text-xs text-[#66736B] mt-1">
            Rekam jejak setiap perubahan status lead, assignment tim, dan export data.
          </p>
          <div className="mt-3 text-[11px] font-bold text-purple-600">Buka Log Audit →</div>
        </div>
      </div>

      {/* 4. Recent System Audit Events Table */}
      <div className="bg-white border border-[#E2E9E4] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#17221C] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#00A651]" />
            <span>Aktivitas Sistem & Audit Trail Terbaru</span>
          </h3>
          <button
            type="button"
            onClick={() => onNavigateToTab('audit_log')}
            className="text-xs font-bold text-[#006B3C] hover:underline"
          >
            Lihat Semua Log Audit →
          </button>
        </div>

        <div className="overflow-x-auto border border-[#E2E9E4] rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F9F8] text-[#66736B] border-b border-[#E2E9E4] uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Waktu</th>
                <th className="px-4 py-3">Pengguna & Role</th>
                <th className="px-4 py-3">Aksi</th>
                <th className="px-4 py-3">Entitas / Target</th>
                <th className="px-4 py-3">Rincian Aktivitas</th>
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
                  <td className="px-4 py-3 text-[#66736B] max-w-sm truncate">{log.details}</td>
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
