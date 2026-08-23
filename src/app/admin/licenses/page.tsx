'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLicensesModal } from '@/components/license/AdminLicensesModal';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminLicensesPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#06111F] text-[#F8FAFC] flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto shadow-[0_0_25px_rgba(245,158,11,0.5)]">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Admin License Manager</h1>
        <p className="text-xs text-[#94A3B8]">
          Gunakan modal pengelola lisensi untuk melihat daftar key, reset binding perangkat, atau membuat key baru.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-xl bg-[#0E233D] hover:bg-[#168BFF] text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#168BFF] hover:bg-[#168BFF]/90 text-white text-xs font-semibold transition-colors"
          >
            Buka Manager
          </button>
        </div>
      </div>

      <AdminLicensesModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          router.push('/');
        }}
      />
    </div>
  );
}
