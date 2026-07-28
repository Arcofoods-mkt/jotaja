import React from 'react';
import DashboardWrapper from '@/components/admin/DashboardWrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  );
}
