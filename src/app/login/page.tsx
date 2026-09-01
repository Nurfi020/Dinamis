'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainApp } from '@/components/MainApp';

// TODO: Re-enable authentication before public production release.
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to dashboard if visited
    router.replace('/dashboard');
  }, [router]);

  return <MainApp initialTab="dashboard" />;
}
