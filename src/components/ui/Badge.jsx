import React from 'react';
import './Badge.css';

export default function Badge({ color = 'brand', children, className }) {
  return <span className={`ui-badge ui-badge--${color} ${className || ''}`}>{children}</span>;
}



