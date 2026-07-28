"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiKey, FiUsers, FiList, FiTag, FiFileText } from 'react-icons/fi';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isCollapsed?: boolean;
}

export default function Sidebar({ isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'DASHBOARD',
      items: [
        { name: 'Dashboard', path: '/painel-administrador', icon: <FiHome /> }
      ]
    },
    {
      title: 'ACESSOS',
      items: [
        { name: 'Permissões', path: '/painel-administrador/permissoes', icon: <FiKey /> },
        { name: 'Usuários', path: '/painel-administrador/usuarios', icon: <FiUsers /> }
      ]
    },
    {
      title: 'GESTÃO',
      items: [
        { name: 'Participantes', path: '/painel-administrador/participantes', icon: <FiUsers /> },
        { name: 'Categorias', path: '/painel-administrador/categorias', icon: <FiTag /> }
      ]
    },
    {
      title: 'CONFIGURAÇÕES',
      items: [
        { name: 'Logs', path: '/painel-administrador/logs', icon: <FiFileText /> }
      ]
    }
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoContainer}>
        {/* Full Logo (Expanded) */}
        <div className={styles.logoFull}>
          <Image src="/Imagens/arcowsvg.svg" alt="Arcofoods Admin" width={140} height={40} className={styles.logoDark} />
          <Image src="/Imagens/arcosvg.svg" alt="Arcofoods Admin" width={140} height={40} className={styles.logoLight} />
        </div>
        {/* Favicon (Collapsed) */}
        <div className={styles.logoFavicon}>
          <Image src="/Imagens/arcofoods-favicon.svg" alt="Arcofoods" width={32} height={32} />
        </div>
      </div>
      
      <div className={styles.menu}>
        {menuItems.map((section, idx) => (
          <div key={idx} className={styles.section}>
            <div className={styles.sectionTitle}>{section.title}</div>
            {section.items.map((item, i) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  href={item.path} 
                  key={i} 
                  className={`${styles.link} ${isActive ? styles.linkActive : ''}`}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span className={styles.linkText}>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
