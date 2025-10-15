import React from 'react';
import './FilterChip.css';

export default function FilterChip({ active, children, onClick }) {
  return (
    <button type="button" className={`ui-chip ${active ? 'ui-chip--active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
}



