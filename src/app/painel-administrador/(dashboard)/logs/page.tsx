"use client";

import React, { useState, useEffect } from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import styles from './Logs.module.css';
import { getLogsList } from './actions';
import { FiExternalLink, FiSearch } from 'react-icons/fi';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('Todas as Ações');
  const [filterModule, setFilterModule] = useState('Todos os Módulos');
  const [displayCount, setDisplayCount] = useState('50');

  const { permissions, isAdmin } = usePermissions();
  const perms = isAdmin ? { acessar: true, ver: true } : (permissions.Logs || {});

  const fetchData = async () => {
    setLoading(true);
    
    const result = await getLogsList();
    if (result.data) {
      setLogs(result.data);
    }
    if (result.error) console.error("Error fetching logs: ", result.error);

    setLoading(false);
  };

  useEffect(() => {
    if (perms.acessar !== false) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return { date: '', time: '' };
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}:${seconds}`
    };
  };

  const getActionClass = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('CRIAR')) return styles.actionCriar;
    if (act.includes('EDITAR')) return styles.actionEditar;
    if (act.includes('APAGAR') || act.includes('EXCLUIR') || act.includes('DELETAR')) return styles.actionApagar;
    if (act.includes('BLOQUEAR') || act.includes('DESATIVAR')) return styles.actionBloquear;
    return styles.actionDefault;
  };

  const getActionLabel = (action: string) => {
    // Tenta normalizar os nomes conforme a imagem (CRIAR, EDITAR)
    const act = action.toUpperCase();
    if (act.includes('CRIAR')) return 'CRIAR';
    if (act.includes('EDITAR')) return 'EDITAR';
    if (act.includes('APAGAR') || act.includes('EXCLUIR') || act.includes('DELETAR')) return 'APAGAR';
    if (act.includes('BLOQUEAR') || act.includes('DESATIVAR')) return 'BLOQUEAR';
    return act;
  };

  const formatId = (id: string) => {
    if (!id) return '';
    return id.length > 12 ? `${id.substring(0, 8)}...` : id;
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.details?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAction = filterAction === 'Todas as Ações' || getActionLabel(log.action) === filterAction.toUpperCase();
    const matchesModule = filterModule === 'Todos os Módulos' || log.entity === filterModule;
    
    return matchesSearch && matchesAction && matchesModule;
  }).slice(0, parseInt(displayCount));

  if (perms.acessar === false) {
    return (
      <div>
        <div className="adminPageHeader">
          <h1 className="adminPageTitle">Logs do Sistema</h1>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <p>Você não tem permissão para visualizar o histórico de logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="adminPageHeader">
        <div>
          <h1 className="adminPageTitle">Logs do Sistema</h1>
          <p className="adminPageDescription">Histórico detalhado das ações realizadas pelos usuários no painel administrativo.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '250px', maxWidth: '350px' }}>
          <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Buscar usuário, ação ou módulo..." 
            className="input-field"
            style={{ paddingLeft: '35px', margin: 0 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Filtro Rápido:</span>
          <select 
            className="input-field" 
            style={{ width: 'auto', minWidth: '150px', margin: 0 }}
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="Todas as Ações">Todas as Ações</option>
            <option value="Criar">Criar</option>
            <option value="Editar">Editar</option>
            <option value="Apagar">Apagar</option>
            <option value="Bloquear">Bloquear</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Módulo:</span>
          <select 
            className="input-field" 
            style={{ width: 'auto', minWidth: '150px', margin: 0 }}
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
          >
            <option value="Todos os Módulos">Todos os Módulos</option>
            {Array.from(new Set(logs.map(log => log.entity))).filter(Boolean).map(mod => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mostrar</span>
          <select 
            className="input-field" 
            style={{ width: 'auto', minWidth: '70px', margin: 0, padding: '0.5rem' }}
            value={displayCount}
            onChange={(e) => setDisplayCount(e.target.value)}
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="500">500</option>
          </select>
        </div>
      </div>

      <div className={styles.logsContainer}>
        {loading ? (
          <p>Carregando registros de auditoria...</p>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Data e Hora</th>
                  <th className={styles.th}>Usuário</th>
                  <th className={styles.th}>Ação</th>
                  <th className={styles.th}>Módulo Afetado</th>
                  <th className={styles.th}>Detalhes / Descrição</th>
                  <th className={styles.th} style={{ textAlign: 'center' }}>Acessar</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => {
                    const { date, time } = formatDate(log.created_at);
                    const desc = log.details?.description || '-';
                    return (
                      <tr key={log.id} className={styles.tr}>
                        <td className={styles.td}>
                          <span className={styles.dateText}>{date}</span>
                          <span className={styles.timeText}>{time}</span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.userName}>{log.user_name}</span>
                          <span className={styles.userEmail}>{log.user_email}</span>
                        </td>
                        <td className={styles.td}>
                          <span className={`${styles.actionBadge} ${getActionClass(log.action)}`}>
                            {getActionLabel(log.action)}
                          </span>
                        </td>
                        <td className={styles.td}>
                          <span className={styles.moduleBadge}>{log.entity}</span>
                          {log.entity_id && (
                            <span className={styles.moduleId}>ID: {formatId(log.entity_id)}</span>
                          )}
                        </td>
                        <td className={styles.td}>
                          <span className={styles.detailsText}>{desc}</span>
                        </td>
                        <td className={styles.td} style={{ textAlign: 'center' }}>
                          <button className={styles.accessBtn} title="Ver Registro">
                            <FiExternalLink />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.emptyState}>
                      Nenhum registro encontrado no histórico.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
