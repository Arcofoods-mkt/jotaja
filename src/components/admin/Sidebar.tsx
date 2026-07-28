"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiKey, FiUsers, FiList, FiTag, FiFileText } from 'react-icons/fi';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isCollapsed?: boolean;
  permissions?: any;
  isAdmin?: boolean;
}

export default function Sidebar({ isCollapsed = false, permissions = {}, isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

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
        { name: 'Participantes', path: '/painel-administrador/participantes', icon: <FiUsers />, module: 'Participantes' },
        { name: 'Categorias', path: '/painel-administrador/categorias', icon: <FiTag />, module: 'Categorias' }
      ]
    },
    {
      title: 'CONFIGURAÇÕES',
      items: [
        { name: 'Logs', path: '/painel-administrador/logs', icon: <FiFileText />, module: 'Logs' }
      ]
    }
  ];

  // Filtra os itens baseado nas permissões (se não for admin)
  const filteredMenuSections = menuItems.map(section => {
    return {
      ...section,
      items: section.items.filter(item => {
        if (isAdmin) return true;
        if (!item.module) return true; // Se não tem módulo configurado, exibe por padrão
        
        const modulePerms = permissions[item.module];
        // Se a permissão de acessar for false, esconde do menu
        if (modulePerms && modulePerms.acessar === false) return false;
        
        return true;
      })
    };
  }).filter(section => section.items.length > 0); // Remove seções vazias

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
