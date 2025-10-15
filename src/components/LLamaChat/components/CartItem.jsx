import React from 'react';

export default function CartItem({ item, onDec, onInc }) {
  return (
    <div className="cart-item">
      <div className="cart-img">
        <img src={item.image || item.image_url} alt="" />
      </div>
      <div className="item-info">
        <p className="item-name">{item.name || item.product_name || item.title}</p>
        <div className="item-price">{(item.price_numeric || item.price || 0) * item.quantity}₽</div>
      </div>
      <div className="item-controls">
        <div className="quantity-controls">
          <button className="quantity-btn" onClick={() => onDec(item)} aria-label="Уменьшить количество">-</button>
          <span className="quantity">{item.quantity}</span>
          <button className="quantity-btn" onClick={() => onInc(item)} aria-label="Увеличить количество">+</button>
        </div>
      </div>
    </div>
  );
}


