import React, { useState, useEffect } from 'react';
import styles from './AdminTable.module.css';

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  viewMode?: 'list' | 'grid';
}

export default function AdminTable({ columns, data, searchPlaceholder = "Pesquisar...", onSearch, viewMode = 'list' }: AdminTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Client-side filtering
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return columns.some(col => {
      const val = row[col.key];
      if (typeof val === 'string') {
        return val.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Ensure valid page when filtering changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    if (onSearch) onSearch(e.target.value);
  };

  const renderPagination = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, 2, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 2, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages - 1, totalPages);
      }
    }

    return (
      <div className={styles.pagination}>
        <button 
          className={styles.pageBtn} 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage <= 1}
        >
          &laquo;
        </button>
        
        {pages.map((p, idx) => (
          <button 
            key={idx} 
            className={`${styles.pageBtn} ${p === currentPage ? styles.active : ''} ${p === '...' ? styles.dots : ''}`}
            onClick={() => typeof p === 'number' && setCurrentPage(p)}
            disabled={p === '...'}
          >
            {p}
          </button>
        ))}

        <button 
          className={styles.pageBtn} 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
        >
          &raquo;
        </button>
      </div>
    );
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <input 
          type="text" 
          placeholder={searchPlaceholder} 
          className={styles.searchInput} 
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className={styles.controls}>
          Mostrar 
          <select 
            className={styles.select} 
            value={itemsPerPage} 
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className={styles.gridContainer}>
          {currentData.length > 0 ? (
            currentData.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.card}>
                {columns.map((col, colIndex) => {
                  const isActions = col.key === 'actions';
                  return (
                    <div key={colIndex} className={isActions ? styles.cardActions : styles.cardRow}>
                      {!isActions && <span className={styles.cardLabel}>{col.label}</span>}
                      <div className={styles.cardValue}>
                        {col.render ? col.render(row) : row[col.key]}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          ) : (
            <div className={styles.noData}>Nenhum registro encontrado.</div>
          )}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={styles.th}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={styles.tr}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className={styles.td}>
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className={styles.td} style={{ textAlign: 'center', padding: '2rem' }}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.footer}>
        <div>Mostrando {filteredData.length > 0 ? startIndex + 1 : 0} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} registros</div>
        {renderPagination()}
      </div>
    </div>
  );
}
