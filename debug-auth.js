// Скрипт для диагностики проблем с авторизацией
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wqhjdysjjhdhyrhcgogqt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaGpkeXNqamhkeWhyY2dvZ3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODM2NTEsImV4cCI6MjA3NDk1OTY1MX0.ShpjmtkCJj7aZp8q5PDlJ-w7Tw6DHUtj6wqtJ8gfKAg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Тестирование подключения к Supabase...');
  
  try {
    // Проверяем подключение к базе данных
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Ошибка подключения к базе данных:', error);
      return false;
    }
    
    console.log('Подключение к базе данных успешно!');
    
    // Проверяем структуру таблицы users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.error('Ошибка при получении пользователей:', usersError);
      return false;
    }
    
    console.log('Найдено пользователей:', users.length);
    console.log('Структура таблицы users:', users);
    
    return true;
  } catch (err) {
    console.error('Общая ошибка:', err);
    return false;
  }
}

testConnection();
