"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiSun, FiMoon, FiLogOut, FiChevronDown } from 'react-icons/fi';
import styles from './Topbar.module.css';

interface TopbarProps {
  toggleSidebar?: () => void;
  toggleMobileMenu?: () => void;
}

import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export default function Topbar({ toggleSidebar, toggleMobileMenu }: TopbarProps) {
  const [theme, setTheme] = useState('dark');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('Usuário');
  const [userRole, setUserRole] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/painel-administrador/login');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

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
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('adminTheme', newTheme);
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {toggleSidebar && (
          <button className={`${styles.menuBtn} ${styles.desktopOnly}`} onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>
        )}
        <div className={styles.mobileLogo}>
          <Image src="/Imagens/arcosvg.svg" alt="Arcofoods" width={110} height={32} className={styles.logoLight} />
          <Image src="/Imagens/arcowsvg.svg" alt="Arcofoods" width={110} height={32} className={styles.logoDark} />
        </div>
        <span className={styles.topbarTitle}>Captação de Leads</span>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        <div className={`${styles.profileContainer} ${styles.desktopOnly}`}>
          <div 
            className={styles.profile} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.avatar}>{getInitials(userName)}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{userRole}</span>
            </div>
            <FiChevronDown className={styles.profileDropdownIcon} />
          </div>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button className={styles.dropdownItem} onClick={handleLogout}>
                <FiLogOut className={styles.logoutIcon} />
                <span>Sair do Sistema</span>
              </button>
            </div>
          )}
        </div>

        {toggleMobileMenu && (
          <button className={`${styles.menuBtn} ${styles.mobileOnly}`} onClick={toggleMobileMenu}>
            <FiMenu size={24} />
          </button>
        )}
      </div>
    </header>
  );
}
