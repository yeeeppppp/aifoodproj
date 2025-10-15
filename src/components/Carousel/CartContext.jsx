import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import { useAuth } from '../AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { userId } = useAuth();
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        console.log('UserId не доступен, корзина не загружается');
        return;
      }
      try {
        const { data, error } = await supabase
          .from('carts')
          .select('*')
          .eq('users_id', userId);
        if (error) {
          console.error('Ошибка загрузки корзины:', error.message, error.details);
        } else {
          const mappedCart = data.map(item => ({
            name: item.item_name,
            price: item.item_price,
            quantity: item.quantity,
            image: item.item_image,
            image_url: item.item_image_url,
          }));
          setCart(mappedCart);
          console.log('Загружена корзина для userId', userId, ':', mappedCart);
        }
      } catch (err) {
        console.error('Общая ошибка:', err);
      }
    };
    fetchCart();
  }, [userId]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('users_id', userId)
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Ошибка загрузки заказов:', error.message, error.details);
        } else {
          setOrders(data || []);
          console.log('Загружено заказов для userId', userId, ':', data.length, data);
        }
      } catch (err) {
        console.error('Общая ошибка:', err);
      }
    };
    fetchOrders();
  }, [userId]);

  const addToCart = async (item) => {
    if (!userId) {
      console.error('UserId not available');
      return;
    }
    console.log('Попытка добавить в корзину:', item);
    try {
      const itemPrice = (
        typeof item.price_numeric === 'number' ? item.price_numeric : undefined
      ) ?? (
        typeof item.price === 'number' ? item.price : (
          typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, '')) : 0
        )
      );
      const itemQuantity = item.quantity || 1;

      const { data, error } = await supabase
        .from('carts')
        .upsert({
          users_id: userId,
          item_name: item.name,
          item_price: itemPrice,
          quantity: itemQuantity,
        }, {
          onConflict: ['users_id', 'item_name'],
          ignoreDuplicates: false // Обновлять quantity, если конфликт
        });

      if (error) {
        console.error('Ошибка добавления в корзину:', error.message, error.details);
      } else {
        console.log('Upsert результат:', data);
        setCart(prevCart => {
          const existingItem = prevCart.find(i => i.name === item.name);
          if (existingItem) {
            return prevCart.map(i =>
              i.name === item.name ? { ...i, quantity: i.quantity + itemQuantity } : i
            );
          }
          return [...prevCart, { ...item, price: itemPrice, quantity: itemQuantity }];
        });
        console.log('Товар добавлен/обновлён в корзине:', item.name, 'цена:', itemPrice, 'количество:', itemQuantity);
      }
    } catch (err) {
      console.error('Общая ошибка:', err);
    }
  };

  const removeFromCart = async (itemName) => {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from('carts')
        .delete()
        .eq('users_id', userId)
        .eq('item_name', itemName);
      if (error) {
        console.error('Ошибка удаления из корзины:', error.message, error.details);
      } else {
        setCart(prevCart => prevCart.filter(item => item.name !== itemName));
        console.log('Товар удалён из корзины:', itemName);
      }
    } catch (err) {
      console.error('Общая ошибка:', err);
    }
  };

  const updateQuantity = async (itemName, quantity) => {
    if (!userId) return;
    try {
      const { error } = await supabase
        .from('carts')
        .update({ quantity: Math.max(0, quantity) })
        .eq('users_id', userId)
        .eq('item_name', itemName);
      if (error) {
        console.error('Ошибка обновления количества:', error.message, error.details);
      } else {
        setCart(prevCart =>
          prevCart.map(item =>
            item.name === itemName ? { ...item, quantity: Math.max(0, quantity) } : item
          )
        );
        console.log('Обновлено количество для:', itemName, 'на', quantity);
      }
    } catch (err) {
      console.error('Общая ошибка:', err);
    }
  };

  const addOrder = async () => {
    if (cart.length === 0 || !userId) {
      console.log('Корзина пуста или userId отсутствует, заказ не создан');
      return;
    }
    console.log('Попытка создать заказ, текущая корзина:', cart);
    const totalCost = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    if (isNaN(totalCost) || totalCost === 0) {
      console.error('Ошибка вычисления totalCost:', totalCost, 'cart:', cart);
      return;
    }
    const items = cart.map(item => ({
      name: item.name,
      price: parseFloat(item.price),
      quantity: item.quantity,
      image: item.image,
      image_url: item.image_url,
    }));
    console.log('Вычисленный totalCost:', totalCost, 'items:', items);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          users_id: userId,
          order_number: orders.length + 1,
          order_date: new Date().toLocaleDateString('ru-RU'),
          total_cost: totalCost,
          items: items,
          created_at: new Date(),
        }, { returning: 'minimal' });
      if (error) {
        console.error('Ошибка создания заказа:', error.message, error.details);
      } else {
        await fetchOrders();
        const { error: clearError } = await supabase
          .from('carts')
          .delete()
          .eq('users_id', userId);
        if (clearError) console.error('Ошибка очистки корзины:', clearError.message, clearError.details);
        setCart([]);
        console.log('Заказ успешно создан и корзина очищена');
      }
    } catch (err) {
      console.error('Общая ошибка при создании заказа:', err);
    }
  };

  const value = {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    orders,
    addOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };
export const useCart = () => useContext(CartContext);