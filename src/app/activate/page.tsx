'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ActivateView } from '@/components/license/ActivateView';
import { LicenseInfo } from '@/types';

export default function ActivatePage() {
  const router = useRouter();

  const handleActivationSuccess = (_license: LicenseInfo) => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <ActivateView onActivationSuccess={handleActivationSuccess} />
    </div>
  );
}