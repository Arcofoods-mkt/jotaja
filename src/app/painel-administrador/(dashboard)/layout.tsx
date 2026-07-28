import React from 'react';
import DashboardWrapper from '@/components/admin/DashboardWrapper';
import { PermissionsProvider } from '@/contexts/PermissionsContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PermissionsProvider>
      <DashboardWrapper>
        {children}
      </DashboardWrapper>
    </PermissionsProvider>
  );
}
