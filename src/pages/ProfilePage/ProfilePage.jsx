import React, { useContext, useEffect, useState } from 'react';
import { useCart } from '../../components/Carousel/CartContext';
import './ProfilePage.css';
import Eggs from '../../assets/eggs.png';

function ProfilePage() {
  const { orders, addOrder } = useCart() || {};
  const [forceRender, setForceRender] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);

  console.log('Orders in ProfilePage:', orders);
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    console.log('LocalStorage orders:', savedOrders ? JSON.parse(savedOrders) : []);
  }, []);

  if (!addOrder) {
    console.error('CartContext not available in ProfilePage!');
    return <div>Ошибка: Контекст корзины недоступен</div>;
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="orders-container" key={forceRender}>
      <div className="my-orders">
        <h1>Мои заказы</h1>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.number}
              className="order-list"
              onClick={() => handleOrderClick(order)}
            >
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
      {selectedOrder && (
        <div className="order-bio">
          <div className="order-number-2"><span>Заказ {selectedOrder.number}</span></div>
          <div className="order-status"><span>Доставлен</span></div>
          <div className="border-line"></div>
          <div className="details-str"><span>Детали заказа</span></div>
          <div className="order-items">
            {selectedOrder.items.map((item, index) => (
              <div key={index} className="order-item">
                <div className="order-img">
                  <img src={Eggs} alt="" />
                </div>
                <div className="order-info">
                  <p className="order-name">{item.name}</p>
                  <div className="order-price">{item.price * item.quantity}₽</div>
                </div>
                <div className="quantity-2">
                  <span>{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;