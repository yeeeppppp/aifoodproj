import React, { useState, useRef, useEffect, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useCart } from '../Carousel/CartContext';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import "./LLamaChatV2.css";
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Empty from '../ui/Empty';
import { formatPrice } from '../../shared/utils/format';

const supabaseUrl = 'https://wqhjdysjjhdyhrcgogqt.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Компонент для отображения сообщений
const MessageBubble = ({ message, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="message-bubble message-bubble--ai message-bubble--loading">
        <div className="message-bubble__content">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`message-bubble ${message.isUser ? 'message-bubble--user' : 'message-bubble--ai'}`}>
      <div className="message-bubble__content">
        {message.text}
      </div>
      <div className="message-bubble__time">
        {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

// Компонент для элементов корзины
const CartItemV2 = ({ item, onDecrease, onIncrease }) => {
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="cart-item-v2">
      <div className="cart-item-v2__image">
        <img 
          src={item.image || item.image_url || '/images/placeholder.png'} 
          alt={item.name || item.product_name || item.title}
          loading="lazy"
        />
      </div>
      <div className="cart-item-v2__info">
        <h4 className="cart-item-v2__name">
          {truncateText(item.name || item.product_name || item.title)}
        </h4>
        <p className="cart-item-v2__weight">{item.weight}</p>
        <div className="cart-item-v2__price">
          {formatPrice((item.price_numeric || item.price || 0) * item.quantity)}₽
        </div>
      </div>
      <div className="cart-item-v2__controls">
        <button 
          className="quantity-btn quantity-btn--decrease"
          onClick={() => onDecrease(item)}
          aria-label="Уменьшить количество"
        >
          <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
            <path d="M1 1H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <span className="quantity-display">{item.quantity}</span>
        <button 
          className="quantity-btn quantity-btn--increase"
          onClick={() => onIncrease(item)}
          aria-label="Увеличить количество"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Основной компонент чата
function LLamaChatV2() {
  const navigate = useNavigate();
  const { cart, setCart, addToCart, updateQuantity, removeFromCart } = useCart();
  
  // Состояние чата
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem('chat_history_v2');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  
  // Состояние UI
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState('chat'); // 'chat' | 'cart' | 'split'
  
  // Медиа-запросы
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Автоматическая настройка режима просмотра в зависимости от устройства
  useEffect(() => {
    if (isMobile) {
      setViewMode('chat');
      setIsCartOpen(false);
    } else if (isTablet) {
      setViewMode('split');
      setIsCartOpen(true);
    } else {
      setViewMode('split');
      setIsCartOpen(true);
    }
  }, [isMobile, isTablet, isDesktop]);

  // Загрузка продуктов
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('pyatorochka_products')
          .select('*');
        if (error) {
          console.error('Ошибка загрузки продуктов для ИИ:', error.message);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Общая ошибка загрузки для ИИ:', error);
      }
    };
    fetchProducts();
  }, []);

  // Сохранение истории чата
  useEffect(() => {
    try {
      localStorage.setItem('chat_history_v2', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // API для ИИ
  const API_KEY = "io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImIwYTA4NTJjLTI3MDYtNGQ1Mi1iNmVjLWI2Y2E2MTQ4YjE4NCIsImV4cCI6NDkxMjc4MzY5Mn0.MvmbdN8WgCqLHVUBKdzP2fw3OdI_IOJQNeIKRZzi65KaD_WUEP1xAe7x1R4LMyoDvAlOHNYF_A54vVSZv-cXHA";
  const API_URL = "https://api.intelligence.io.solutions/api/v1/chat/completions";

  const fetchAIResponse = async (userMessage) => {
    try {
      const productsList = products.slice(0, 50).map(p => 
        `${p.name || p.product_name || p.title || 'Без названия'} - ${p.price_numeric || p.price || 'Без цены'}₽`
      ).join(', ');

      const messageHistory = [
        {
          role: "system",
          content: `Ты помощник для заказа продуктов в магазине.
                  Отвечай на русском языке кратко и полезно.
                  Помогай выбирать продукты, учитывай аллергии,
                  предлагай рецепты и помогай с составлением корзины.
                  Пиши без Markdown опций или иных инструментов форматирования текста.
                  АКТУАЛЬНЫЙ список доступных продуктов (всегда используй ТОЛЬКО их): ${productsList || 'Список пуст. Загружается...'}.

                  ПРАВИЛО: Если пользователь просит добавить товар в корзину (например, "добавь яйца"), 
                  НАЙДИ ТОЧНОЕ НАЗВАНИЕ из списка, укажи его в ответе и ОБЯЗАТЕЛЬНО добавь команду ТОЛЬКО В САМОМ КОНЦЕ ответа: [add_to_cart: ТОЧНОЕ_НАЗВАНИЕ_ИЗ_СПИСКА, количество].
                  Команда [add_to_cart: ...] не должна быть частью читаемого текста, а только служебной инструкцией.
                  Количество по умолчанию 1, если не указано. Если товара нет в списке, ответь "Товар не найден в списке" БЕЗ команды.
                  Добавляй товары в корзину ТОЛЬКО если пользователь об этом просит.

                  ДОПОЛНИТЕЛЬНО: Структура ответов:
                  - Делай ответы короткими и структурированными.
                  - Разбивай предложения, упоминая не более 1-2 продуктов с ценами в каждом.
                  - Используй точки или перечисления (например, "1. Продукт - цена") для читаемости.
                  - Избегай длинных предложений и лишних фраз, если они не добавляют ценности.`
        },
        ...messages.map(msg => ({ role: msg.isUser ? "user" : "assistant", content: msg.text })),
        { role: "user", content: userMessage }
      ];

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
          messages: messageHistory,
          max_tokens: 300,
          temperature: 0.7,
          stream: false,
          reasoning: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Ошибка запроса к ИИ:', error);
      return 'Ошибка: Не удалось получить ответ от ИИ.';
    }
  };

  const handleSend = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = { text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponseText = await fetchAIResponse(inputText);
      const displayText = aiResponseText.replace(/\s*\[add_to_cart:\s*[^,]+,\s*\d+\]/gi, '').trim() || 'Ответ обработан.';
      const aiMessage = { text: displayText, isUser: false };
      setMessages(prev => [...prev, aiMessage]);

      // Обработка команд добавления в корзину
      const addToCartRegex = /\[add_to_cart:\s*([^,]+),\s*(\d+)\]/gi;
      let match;
      while ((match = addToCartRegex.exec(aiResponseText)) !== null) {
        const productName = match[1].trim();
        const quantity = parseInt(match[2], 10) || 1;

        let product = products.find(p => 
          (p.name?.toLowerCase() === productName.toLowerCase()) ||
          (p.product_name?.toLowerCase() === productName.toLowerCase()) ||
          (p.title?.toLowerCase() === productName.toLowerCase())
        );

        if (!product) {
          product = products.find(p => 
            (p.name?.toLowerCase().includes(productName.toLowerCase())) ||
            (p.product_name?.toLowerCase().includes(productName.toLowerCase())) ||
            (p.title?.toLowerCase().includes(productName.toLowerCase()))
          );
        }

        if (product) {
          const itemToAdd = { 
            ...product, 
            quantity,
            price: product.price_numeric || product.price || 0
          };
          addToCart(itemToAdd);
        }
      }
    } catch (error) {
      console.error('Ошибка обработки ответа ИИ:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecreaseQuantity = (item) => {
    const newQuantity = item.quantity - 1;
    if (newQuantity <= 0) {
      removeFromCart(item.name);
    } else {
      updateQuantity(item.name, newQuantity);
    }
  };

  const handleIncreaseQuantity = (item) => {
    const newQuantity = item.quantity + 1;
    updateQuantity(item.name, newQuantity);
  };

  const totalCost = cart.reduce((total, item) => total + ((item.price_numeric || item.price || 0) * item.quantity), 0);

  const handleOrder = async () => {
    if (cart.length === 0) return;
    navigate('/payment');
  };

  // Обработчики для мобильных жестов
  const handleChatToggle = () => {
    if (isMobile) {
      setIsChatOpen(!isChatOpen);
      if (!isChatOpen) {
        setIsCartOpen(false);
      }
    }
  };

  const handleCartToggle = () => {
    if (isMobile) {
      setIsCartOpen(!isCartOpen);
      if (!isCartOpen) {
        setIsChatOpen(false);
      }
    }
  };

  return (
    <>
      {/* Floating Action Button для мобильных устройств */}
      {isMobile && (
        <div className="fab-container">
          <button 
            className="fab fab--chat"
            onClick={handleChatToggle}
            aria-label="Открыть чат"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {messages.length > 0 && <span className="fab__badge">{messages.length}</span>}
          </button>
          
          {cart.length > 0 && (
            <button 
              className="fab fab--cart"
              onClick={handleCartToggle}
              aria-label="Открыть корзину"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="fab__badge">{cart.length}</span>
            </button>
          )}
        </div>
      )}

      {/* Основной контейнер чата */}
      <div 
        className={`chat-v2 ${isChatOpen ? 'chat-v2--open' : ''} ${isMobile ? 'chat-v2--mobile' : ''} ${isTablet ? 'chat-v2--tablet' : ''} ${isDesktop ? 'chat-v2--desktop' : ''}`}
        ref={chatContainerRef}
      >
        {/* Заголовок чата */}
        <div className="chat-v2__header">
          <div className="chat-v2__title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>FOODAI Помощник</span>
          </div>
          {isMobile && (
            <button 
              className="chat-v2__close"
              onClick={() => setIsChatOpen(false)}
              aria-label="Закрыть чат"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Контейнер сообщений */}
        <div className="chat-v2__messages">
          {messages.length === 0 ? (
            <div className="chat-v2__welcome">
              <div className="welcome-message">
                <h3>👋 Привет! Я FOODAI помощник</h3>
                <p>Помогу выбрать продукты, найти рецепты и составить корзину. Что вас интересует?</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))
          )}
          {isLoading && <MessageBubble isLoading={true} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Поле ввода */}
        <div className="chat-v2__input">
          <div className="input-group">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
              placeholder="Напишите сообщение..."
              className="chat-input-v2"
              aria-label="Поле ввода сообщения"
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !inputText.trim()} 
              className="send-btn-v2"
              variant="primary"
              size="md"
              aria-label="Отправить сообщение"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Контейнер корзины */}
      <div 
        className={`cart-v2 ${isCartOpen ? 'cart-v2--open' : ''} ${isMobile ? 'cart-v2--mobile' : ''} ${isTablet ? 'cart-v2--tablet' : ''} ${isDesktop ? 'cart-v2--desktop' : ''}`}
      >
        {/* Заголовок корзины */}
        <div className="cart-v2__header">
          <div className="cart-v2__title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Корзина ({cart.length})</span>
          </div>
          {isMobile && (
            <button 
              className="cart-v2__close"
              onClick={() => setIsCartOpen(false)}
              aria-label="Закрыть корзину"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Содержимое корзины */}
        <div className="cart-v2__content">
          {cart.length === 0 ? (
            <Empty 
              title="Корзина пуста" 
              description="Добавьте товары через чат или каталог"
            />
          ) : (
            <div className="cart-v2__items">
              {cart.map((item, index) => (
                <CartItemV2 
                  key={index} 
                  item={item} 
                  onDecrease={handleDecreaseQuantity}
                  onIncrease={handleIncreaseQuantity}
                />
              ))}
            </div>
          )}
        </div>

        {/* Футер корзины с кнопкой заказа */}
        {cart.length > 0 && (
          <div className="cart-v2__footer">
            <div className="cart-v2__total">
              <span>Итого:</span>
              <span className="cart-v2__total-price">{formatPrice(totalCost)}₽</span>
            </div>
            <Button 
              onClick={handleOrder}
              className="order-btn-v2"
              variant="primary"
              size="lg"
            >
              Оформить заказ
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default LLamaChatV2;
