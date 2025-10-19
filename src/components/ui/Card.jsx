import React from 'react';
import './Card.css';

export default function Card({ className, children, ...rest }) {
  return (
    <div className={`ui-card ${className || ''}`} {...rest}>
      {children}
    </div>
  );
}









