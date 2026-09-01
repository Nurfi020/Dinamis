'use client';

import React from 'react';
import { MainApp } from '@/components/MainApp';

// TODO: Re-enable authentication before public production release.
export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);
  return <MainApp initialTab="leads" initialLeadId={unwrappedParams.id} />;
}
