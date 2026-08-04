import React, { useState, useRef, useEffect } from 'react';
import styles from './MultiSelect.module.css';

interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({ options, selectedIds, onChange, placeholder = "Buscar..." }: MultiSelectProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(o => 
    !selectedIds.includes(o.id) && 
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedOptions = options.filter(o => selectedIds.includes(o.id));

  const handleSelect = (id: string) => {
    onChange([...selectedIds, id]);
    setSearch('');
  };

  const handleRemove = (id: string) => {
    onChange(selectedIds.filter(selectedId => selectedId !== id));
  };

  return (
    <div className={styles.container} ref={wrapperRef}>
      <div className={styles.inputWrapper} onClick={() => setIsOpen(true)}>
        {selectedOptions.map(opt => (
          <div key={opt.id} className={styles.pill}>
            {opt.name}
            <button type="button" className={styles.pillRemove} onClick={(e) => { e.stopPropagation(); handleRemove(opt.id); }}>&times;</button>
          </div>
        ))}
        <input 
          type="text" 
          className={styles.searchInput}
          placeholder={selectedOptions.length === 0 ? placeholder : ""}
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <div key={opt.id} className={styles.option} onClick={() => handleSelect(opt.id)}>
                {opt.name}
              </div>
            ))
          ) : (
            <div className={styles.empty}>Nenhuma opção encontrada</div>
          )}
        </div>
      )}
    </div>
  );
}
