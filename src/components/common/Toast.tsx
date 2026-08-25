'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-lg flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-3 fade-in duration-200 transition-all ${
              isSuccess
                ? 'bg-white border-[#A7F3D0] shadow-[#00A651]/10 text-[#006B3C]'
                : isError
                ? 'bg-white border-rose-200 shadow-rose-500/10 text-rose-700'
                : 'bg-white border-[#A7F3D0] shadow-[#00A651]/10 text-[#006B3C]'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#00A651] shrink-0 mt-0.5" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-[#00A651] shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#17221C]">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-[#66736B] mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-[#66736B] hover:text-[#17221C] p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};