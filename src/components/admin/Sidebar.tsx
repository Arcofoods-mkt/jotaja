"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiHome, FiKey, FiUsers, FiList, FiTag, FiFileText, FiGift, FiLogOut, FiX } from 'react-icons/fi';
import styles from './Sidebar.module.css';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  closeMobileMenu?: () => void;
  permissions?: any;
  isAdmin?: boolean;
}

export default function Sidebar({ isCollapsed = false, isMobileOpen = false, closeMobileMenu, permissions = {}, isAdmin = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userName, setUserName] = useState('Usuário');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users_profiles')
          .select('name, roles(name)')
          .eq('id', user.id)
          .single();
          
        if (profile) {
          setUserName(profile.name || 'Usuário');
          // @ts-ignore
          setUserRole(profile.roles?.name || '');
        }
      }
    };
    fetchUser();
  }, [supabase]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/painel-administrador/login');
  };

  const menuItems = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Dashboard', path: '/painel-administrador', icon: <FiHome />, module: 'Dashboard' }
      ]
    },
    {
      title: 'ACESSOS',
      items: [
        { name: 'Permissões', path: '/painel-administrador/permissoes', icon: <FiKey />, module: 'Permissoes' },
        { name: 'Usuários', path: '/painel-administrador/usuarios', icon: <FiUsers />, module: 'Usuarios' }
      ]
    },
    {
      title: 'GESTÃO',
      items: [
        { name: 'Leads', path: '/painel-administrador/participantes', icon: <FiUsers />, module: 'Participantes' },
        { name: 'Categorias', path: '/painel-administrador/categorias', icon: <FiTag />, module: 'Categorias' },
        { name: 'Sorteios', path: '/painel-administrador/sorteios', icon: <FiGift />, module: 'Sorteios' },
        { name: 'Jogo da Memória', path: '/painel-administrador/jogo-memoria', icon: <FiGift />, module: 'Sorteios' },
        { name: 'Jogo do Hambúrguer', path: '/painel-administrador/jogo-hamburguer', icon: <FiGift />, module: 'Sorteios' },
        { name: 'Entrega de Prêmios', path: '/painel-administrador/entrega-premios', icon: <FiGift />, module: 'Sorteios' }
      ]
    },
    {
      title: 'CONFIGURAÇÕES',
      items: [
        { name: 'Logs', path: '/painel-administrador/logs', icon: <FiFileText />, module: 'Logs' }
      ]
    }
  ];

  const filteredMenuSections = menuItems.map(section => {
    return {
      ...section,
      items: section.items.filter(item => {
        if (isAdmin) return true;
        if (!item.module) return true; 
        
        const modulePerms = permissions[item.module];
        if (modulePerms && modulePerms.acessar === false) return false;
        
        return true;
      })
    };
  }).filter(section => section.items.length > 0); 

  return (
    <>
      {isMobileOpen && <div className={styles.overlay} onClick={closeMobileMenu} />}
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileOpen ? styles.mobileOpen : ''}`}>
        <button className={styles.mobileCloseBtn} onClick={closeMobileMenu}>
          <FiX />
        </button>
        <div className={styles.logoContainer}>
          <div className={styles.logoFull}>
            <Image src="/Imagens/arcowsvg.svg" alt="Arcofoods Admin" width={140} height={40} className={styles.logoDark} />
            <Image src="/Imagens/arcosvg.svg" alt="Arcofoods Admin" width={140} height={40} className={styles.logoLight} />
          </div>
          <div className={styles.logoFavicon}>
            <Image src="/Imagens/arcofoods-favicon.svg" alt="Arcofoods" width={32} height={32} />
          </div>
        </div>
        
        <div className={styles.menu}>
          {filteredMenuSections.map((section, idx) => (
            <div key={idx} className={styles.section}>
              <div className={styles.sectionTitle}>{section.title}</div>
              {section.items.map((item, i) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    href={item.path} 
                    key={i} 
                    className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <span className={styles.icon}>{item.icon}</span>
                    <span className={styles.linkText}>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className={styles.mobileProfile}>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>{getInitials(userName)}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{userRole}</span>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut className={styles.logoutIcon} /> Sair
          </button>
        </div>
      </aside>
    </>
  );
}
