"use client";

import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function CustomSelect({ options, placeholder = "Selecione", value, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedValue = value !== undefined ? value : internalValue;
  
  const handleSelect = (val: string) => {
    if (onChange) onChange(val);
    else setInternalValue(val);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === selectedValue);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.customSelectWrapper} ref={dropdownRef}>
      <div 
        className={`${styles.selectTrigger} ${isOpen ? styles.open : ''} ${selectedValue ? styles.hasValue : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedValue ? '' : styles.placeholder}>{selectedOption ? selectedOption.label : placeholder}</span>
        <svg className={styles.arrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <div 
              key={option.value} 
              className={`${styles.option} ${selectedValue === option.value ? styles.selected : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
              {selectedValue === option.value && (
                <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
