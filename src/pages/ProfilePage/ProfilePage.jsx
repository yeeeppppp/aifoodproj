import React, { useEffect, useState } from 'react';
import { useCart } from '../../components/Carousel/CartContext';
import './ProfilePage.css';
import Eggs from '../../assets/eggs.png';
import supabase from '../../supabaseClient';
import { useAuth } from '../../components/AuthContext';

function ProfilePage() {
  const { userId } = useAuth();
  const { orders: contextOrders, addOrder } = useCart() || {};
  const [orders, setOrders] = useState(contextOrders || []);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ProfilePage: Проверка userId:', userId, 'contextOrders:', contextOrders);
    const fetchOrders = async () => {
      if (!userId) {
        console.error('UserId not available');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('users_id', userId);

        if (error) {
          console.error('Ошибка загрузки заказов:', error.message, error.details);
        } else {
          setOrders(data || []);
          console.log('Загружено заказов для userId', userId, ':', data.length, data);
        }
      } catch (err) {
        console.error('Общая ошибка:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, contextOrders]);

  if (!addOrder) {
    console.error('CartContext not available in ProfilePage!');
    return <div>Ошибка: Контекст корзины недоступен</div>;
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  if (loading) {
    return <div>Загрузка заказов...</div>;
  }

  return (
    <div className="orders-container">
      <div className="my-orders">
        <h1>Мои заказы</h1>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="order-list"
              onClick={() => handleOrderClick(order)}
            >
              <div className="order-inside">
                <div className="order-left">
                  <div className="order-number"><span>Заказ {order.order_number}</span></div>
                  <div className="order-date"><span>{order.order_date}</span></div>
                </div>
                <div className="order-right">
                  <div className="order-cost">{order.total_cost}₽</div>
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
          <div className="order-number-2"><span>Заказ {selectedOrder.order_number}</span></div>
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
                  <p className="order-name-2">{item.name}</p>
                  <div className="order-price-2">{item.price * item.quantity}₽</div>
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