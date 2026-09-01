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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Ribbon */}
        <div className="bg-slate-900 p-5 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2.5">
            <Lock className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Demo Feature Gate
            </span>
            <span className="text-xs text-slate-400">• Paket {targetPkg.name}</span>
          </div>

          <h3 className="text-base font-bold text-white mt-1">
            {featureTitle}
          </h3>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5">
          <p className="text-xs text-slate-600 leading-relaxed">
            {featureDescription}
          </p>

          {/* Highlights Box */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fitur pada Paket {targetPkg.name}:</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-600">
              {targetPkg.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onUpgradeToPackage(requiredPackage);
                onClose();
              }}
              className="w-full sm:flex-1 py-2 px-3.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Beralih ke Demo {targetPkg.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-2 px-3.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
