import React, { useContext, useEffect, useState } from 'react';
import { useCart } from '../../components/Carousel/CartContext';
import './ProfilePage.css';
import Eggs from '../../assets/eggs.png';

function ProfilePage() {
  const { orders, addOrder } = useCart() || {};
  const [forceRender, setForceRender] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null); // Состояние для выбранного заказа

  console.log('Orders in ProfilePage:', orders);
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    console.log('LocalStorage orders:', savedOrders ? JSON.parse(savedOrders) : []);
  }, []);

  if (!addOrder) {
    console.error('CartContext not available in ProfilePage!');
    return <div>Ошибка: Контекст корзины недоступен</div>;
  }

  // Обработчик клика по заказу
  const handleOrderClick = (order) => {
    setSelectedOrder(order); // Устанавливаем выбранный заказ
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
              onClick={() => handleOrderClick(order)} // Клик открывает детали
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
          <p>Нет заказов</p> // Добавим текст, если заказов нет
        )}
      </div>
      {selectedOrder && ( // Показываем order-bio только если выбран заказ
        <div className="order-bio">
          <div className="order-number-2"><span>Заказ {selectedOrder.number}</span></div>
          <div className="order-status"><span>Доставлен</span></div>
          <div className="border-line"></div>
          <div className="details-str"><span>Детали заказа</span></div>

          <div className="order-items">
            <div className="order-item">
              <div className="order-img">
                <img src={Eggs} alt="" />
              </div>
              <div className="order-info">
                <p className="order-name">{selectedOrder.items?.[0]?.name || 'Название'}</p>
                <div className="order-price">{selectedOrder.items?.[0]?.price || 'Цена'}₽</div>
              </div>
              <div className="quantity">
                <span>{selectedOrder.items?.[0]?.quantity || 1}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;