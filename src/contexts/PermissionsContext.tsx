"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export type PermissionActions = {
  acessar: boolean;
  ver: boolean;
  editar: boolean;
  bloquear: boolean;
  excluir: boolean;
};

export type RolePermissions = {
  [module: string]: PermissionActions;
};

type PermissionsContextType = {
  permissions: RolePermissions;
  loading: boolean;
  isAdmin: boolean;
};

const PermissionsContext = createContext<PermissionsContextType>({
  permissions: {},
  loading: true,
  isAdmin: false
});

export const usePermissions = () => useContext(PermissionsContext);

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [permissions, setPermissions] = useState<RolePermissions>({});
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Busca o profile e a role ao mesmo tempo
          const { data: profile } = await supabase
            .from('users_profiles')
            .select('roles(*)')
            .eq('id', user.id)
            .single();

          if (profile && profile.roles) {
            const role: any = profile.roles;
            // Se o perfil for 'Admin', garantimos super poderes (opcional, mas recomendado)
            if (role.name?.toLowerCase() === 'admin') {
              setIsAdmin(true);
            }
            
            // Garantimos que o JSON das permissões exista
            if (role.permissions) {
              setPermissions(role.permissions);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar permissões:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <PermissionsContext.Provider value={{ permissions, loading, isAdmin }}>
      {children}
    </PermissionsContext.Provider>
  );
};
