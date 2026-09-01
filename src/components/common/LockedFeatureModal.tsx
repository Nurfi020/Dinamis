'use client';

import React from 'react';
import { Lock, Sparkles, X, Check, ArrowRight } from 'lucide-react';
import { DemoPackage } from '../../types';
import { DEMO_PACKAGES } from '../../data/packageDemoData';

interface LockedFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle: string;
  featureDescription: string;
  requiredPackage?: DemoPackage;
  onUpgradeToPackage: (pkg: DemoPackage) => void;
}

export const LockedFeatureModal: React.FC<LockedFeatureModalProps> = ({
  isOpen,
  onClose,
  featureTitle,
  featureDescription,
  requiredPackage = 'enterprise',
  onUpgradeToPackage,
}) => {
  if (!isOpen) return null;

  const targetPkg = DEMO_PACKAGES[requiredPackage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl border border-[#E2E9E4] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
              Demo Feature Gate
            </span>
            <span className="text-xs text-slate-400">• Paket {targetPkg.name}</span>
          </div>

          <h3 className="text-lg font-extrabold text-white mt-1">
            {featureTitle}
          </h3>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-[#66736B] leading-relaxed">
            {featureDescription}
          </p>

          {/* Highlights Box */}
          <div className="p-4 rounded-2xl bg-[#F7F9F8] border border-[#E2E9E4] space-y-2">
            <div className="text-xs font-bold text-[#17221C] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00A651]" />
              <span>Keunggulan pada Paket {targetPkg.name}:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-[#66736B]">
              {targetPkg.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00A651] shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                onUpgradeToPackage(requiredPackage);
                onClose();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#00A651] hover:bg-[#006B3C] shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Beralih ke Demo {targetPkg.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-4 rounded-xl text-sm font-semibold text-[#66736B] hover:text-[#17221C] hover:bg-[#F4FBF7] transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
