"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiSun, FiMoon, FiBell } from 'react-icons/fi';
import styles from './Topbar.module.css';

interface TopbarProps {
  toggleSidebar?: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const [theme, setTheme] = useState('dark');

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
        <button className={styles.iconBtn}>
          <FiBell />
        </button>

        <div className={styles.profile}>
          <div className={styles.avatar}>
            AD
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Admin</span>
            <span className={styles.userRole}>Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
