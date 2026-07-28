"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { usePermissions } from '@/contexts/PermissionsContext';
import styles from '@/app/painel-administrador/(dashboard)/AdminLayout.module.css';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { permissions, loading, isAdmin } = usePermissions();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading || isAdmin) return; // Se for admin, pula verificação de bloqueio estrito

    // Mapeia as rotas para os módulos do JSON de permissões
    const routeModuleMap: Record<string, string> = {
      '/painel-administrador': 'Dashboard',
      '/painel-administrador/permissoes': 'Permissoes',
      '/painel-administrador/usuarios': 'Usuarios',
      '/painel-administrador/participantes': 'Participantes',
      '/painel-administrador/categorias': 'Categorias'
    };

    // Remove trailling slash se houver para match perfeito (exceto na raiz do painel)
    const normalizedPath = pathname.endsWith('/') && pathname !== '/painel-administrador/' 
      ? pathname.slice(0, -1) 
      : pathname;

    const moduleName = routeModuleMap[normalizedPath];

    if (moduleName && permissions[moduleName]) {
      // Se não tem permissão para acessar a página
      if (permissions[moduleName].acessar === false) {
        alert('Você não tem permissão para acessar esta página.');
        router.push('/painel-administrador');
      }
    }
  }, [pathname, permissions, loading, isAdmin, router]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>Carregando permissões...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      <Sidebar isCollapsed={isSidebarCollapsed} permissions={permissions} isAdmin={isAdmin} />
      <div className={styles.mainContent}>
        <Topbar toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
