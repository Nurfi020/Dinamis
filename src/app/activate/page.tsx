'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ActivateView } from '@/components/license/ActivateView';
import { LicenseInfo } from '@/types';

// TODO: Re-enable authentication before public production release.
const AUTH_BYPASS_ENABLED = true;

export default function ActivatePage() {
  const router = useRouter();

  useEffect(() => {
    if (AUTH_BYPASS_ENABLED) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleActivationSuccess = (_license: LicenseInfo) => {
    router.push('/');
  };

  if (AUTH_BYPASS_ENABLED) {
    return (
      <div className="min-h-screen bg-[#F7F9F8] flex items-center justify-center p-4">
        <p className="text-sm font-semibold text-[#006B3C]">Mengarahkan ke Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <ActivateView onActivationSuccess={handleActivationSuccess} />
    </div>
  );
}