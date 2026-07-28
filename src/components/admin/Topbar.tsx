"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiSun, FiMoon, FiLogOut, FiChevronDown } from 'react-icons/fi';
import styles from './Topbar.module.css';

interface TopbarProps {
  toggleSidebar?: () => void;
}

import { createClient } from '@/utils/supabase/client';

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const [theme, setTheme] = useState('dark');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
  }, []);

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
          <button className={styles.menuBtn} onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>
        )}
        <span className={styles.topbarTitle}>Captação de Leads</span>
      </div>

      <div className={styles.right}>
        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        <div className={styles.profileContainer}>
          <div 
            className={styles.profile} 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.avatar}>DR</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>Diogo Rito</span>
              <span className={styles.userRole}>Admin</span>
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
      </div>
    </header>
  );
}
