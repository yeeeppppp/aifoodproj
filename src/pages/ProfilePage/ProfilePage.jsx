import React, { useContext, useEffect, useState } from 'react';
import { useCart } from '../../components/Carousel/CartContext';
import './ProfilePage.css';

function ProfilePage() {
  const { orders, addOrder } = useCart() || {};
  const [forceRender, setForceRender] = useState(0);

  console.log('Orders in ProfilePage:', orders);
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    console.log('LocalStorage orders:', savedOrders ? JSON.parse(savedOrders) : []);
  }, []);

  if (!addOrder) {
    console.error('CartContext not available in ProfilePage!');
    return <div>Ошибка: Контекст корзины недоступен</div>;
  }

  return (
    <div key={forceRender}>
      <div className="my-orders">
        <h1>Мои заказы</h1>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.number} className="order-list">
              <div className="order-inside">
                <div className="order-left">
                  <div className="order-number"><span>Заказ {order.number}</span></div>
                  <div className="order-date"><span>{order.date}</span></div>
                </div>
                <div className="order-right">
                  <div className="order-cost">{order.cost}₽</div>
                  <div className="delivery-status">Доставлен</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Нет заказов</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;