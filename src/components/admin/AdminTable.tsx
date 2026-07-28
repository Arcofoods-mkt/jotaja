import React from 'react';
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
}

export default function AdminTable({ columns, data, searchPlaceholder = "Pesquisar...", onSearch }: AdminTableProps) {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <input 
          type="text" 
          placeholder={searchPlaceholder} 
          className={styles.searchInput} 
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
        <div className={styles.controls}>
          Mostrar 
          <select className={styles.select}>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
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
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
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

      <div className={styles.footer}>
        <div>Mostrando {data.length > 0 ? 1 : 0} a {data.length} de {data.length} registros</div>
        <div className={styles.pagination}>
          <button className={styles.pageBtn}>&laquo;</button>
          <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
          <button className={styles.pageBtn}>&raquo;</button>
        </div>
      </div>
    </div>
  );
}
