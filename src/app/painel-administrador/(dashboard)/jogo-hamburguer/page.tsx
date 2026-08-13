"use client";

import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import BurgerRankingComponent from '@/components/admin/BurgerRankingComponent';

export default function JogoHamburguerAdminPage() {
  const { permissions, isAdmin } = usePermissions();
  const perms = isAdmin ? { ver: true, editar: true } : (permissions.Sorteios || {});

  if (perms.ver === false) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
        <p>Você não tem permissão para visualizar estas informações.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1 className="adminPageTitle">Jogo do Hambúrguer</h1>
          <p className="adminPageDescription">Visualize o ranking e gerencie os prêmios dos participantes do Jogo do Hambúrguer.</p>
        </div>
      </div>

      <div style={{ background: 'var(--admin-card)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
        <BurgerRankingComponent />
      </div>
    </div>
  );
}
