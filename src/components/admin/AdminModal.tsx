import React, { useEffect } from 'react';
import styles from './AdminModal.module.css';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function AdminModal({ isOpen, onClose, title, children, maxWidth }: AdminModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent pull-to-refresh on mobile
      document.body.style.overscrollBehaviorY = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.overscrollBehaviorY = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.overscrollBehaviorY = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={maxWidth ? { maxWidth } : {}}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
}
