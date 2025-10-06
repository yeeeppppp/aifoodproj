import React, { createContext, useState, useEffect, useContext } from 'react';
import supabase from '../pages/LoginPage/supabaseClient'; // Твой клиент Supabase
import bcrypt from 'bcryptjs'; // Импорт вместо require

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);

  // Проверка текущего пользователя при загрузке
  useEffect(() => {
    const checkCurrentUser = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('id, is_active')
          .eq('id', userId)
          .eq('is_active', true)
          .single(); // Указываем, что ожидаем один объект

        if (error) {
          console.log('Нет активного пользователя:', error.message);
          setUserId(null);
        } else if (data) {
          setUserId(data.id);
          console.log('Текущий пользователь:', data.id);
        }
      }
    };
    checkCurrentUser();
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
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);