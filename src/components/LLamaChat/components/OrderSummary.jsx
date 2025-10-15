import React from 'react';

export default function OrderSummary({ totalCost, expanded, disabled, onClick, className }) {
  return (
    <button
      className={`order-button-floating ${expanded ? 'chat-expanded' : ''} ${className || ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{disabled ? 'Добавьте товары' : 'Заказать'}</span>
      <span className="end">{totalCost}₽</span>
    </button>
  );
}


