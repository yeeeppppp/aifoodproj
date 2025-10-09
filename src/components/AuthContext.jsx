import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../pages/LoginPage/supabaseClient';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // Флаг инициализации

  // Восстановление userId из localStorage при загрузке
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setUserId(savedUserId);
      console.log('Восстановлен userId из localStorage:', savedUserId);
    }
    setIsInitialized(true); // Устанавливаем, что инициализация завершена
  }, []);

  // Сохранение userId в localStorage при изменении
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
      console.log('Сохранён userId в localStorage:', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  // Функция логина
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, password, is_active')
        .eq('email', email)
        .single();

      console.log('Login response data:', data, 'Error:', error);

      if (error || !data) {
        console.error('Ошибка логина:', error?.message || 'Пользователь не найден');
        return false;
      }

      if (!data.is_active) {
        console.error('Пользователь неактивен');
        return false;
      }

      const isMatch = await bcrypt.compare(password, data.password);

      if (isMatch) {
        setUserId(data.id);
        console.log('Успешный логин, userId:', data.id);
        return true;
      } else {
        console.error('Неверный пароль');
        return false;
      }
    } catch (err) {
      console.error('Ошибка при логине:', err);
      return false;
    }
  };

  // Функция выхода
  const logout = () => {
    setUserId(null);
    console.log('Выход выполнен');
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);