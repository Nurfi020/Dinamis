'use client';

import React from 'react';
import { MainApp } from '@/components/MainApp';

// TODO: Re-enable authentication before public production release.
export default function DashboardPage() {
  return <MainApp initialTab="dashboard" />;
}
