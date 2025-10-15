import React from 'react';
import './Skeleton.css';

export default function Skeleton({ width = '100%', height = 16, radius = '8px', className }) {
  const style = { width, height, borderRadius: radius };
  return <div className={`ui-skeleton ${className || ''}`} style={style} />;
}

