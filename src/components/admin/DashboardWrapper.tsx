"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from '@/app/painel-administrador/(dashboard)/AdminLayout.module.css';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={styles.adminContainer}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className={styles.mainContent}>
        <Topbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
