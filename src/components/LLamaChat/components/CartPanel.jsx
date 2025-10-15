import React from 'react';
import CartItem from './CartItem';

export default function CartPanel({ cart, onDec, onInc, collapsed, toggle }) {
  return (
    <div className={`cart-container ${collapsed ? 'cart-container-collapsed' : ''}`}>
      <div className="cart-header" onClick={toggle}>
        <h2>Корзина</h2>
      </div>
      {!collapsed && (
        <>
          <div className="cart-items">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <CartItem key={index} item={item} onDec={onDec} onInc={onInc} />
              ))
            ) : (
              <p></p>
            )}
          </div>
          <div className="delivery-info"> </div>
          <div className="cart-footer"></div>
        </>
      )}
    </div>
  );
}


