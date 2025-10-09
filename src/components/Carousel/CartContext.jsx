import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Загрузка из localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedOrders = localStorage.getItem('orders');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.name === item.name);
      if (existingItem) {
        return prevCart.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemName) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== itemName));
  };

  const updateQuantity = (itemName, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.name === itemName ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
  };

  // Новая функция для создания заказа с деталями
  const addOrderWithItems = () => {
    if (cart.length === 0) return;

    const orderNumber = orders.length + 1;
    const orderDate = new Date().toLocaleDateString('ru-RU');
    const totalCost = cart.reduce((sum, item) => sum + (item.price_numeric || item.price || 0) * item.quantity, 0);
    const items = cart.map(item => ({
      name: item.name || item.product_name || item.title,
      price: item.price_numeric || item.price || 0,
      quantity: item.quantity,
    }));

    const newOrder = {
      number: orderNumber,
      date: orderDate,
      cost: totalCost,
      items: items, // Сохраняем детали товаров
    };

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    setCart([]); // Очищаем корзину после заказа
  };

  const value = {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    orders,
    addOrder: addOrderWithItems, // Заменяем addOrder на новую функцию
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
export const useCart = () => useContext(CartContext);