import React, { useState, useRef, useEffect, useContext } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useCart } from '../Carousel/CartContext';
import { createClient } from '@supabase/supabase-js';
import "./LLamaChat.css";

const supabaseUrl = 'https://wqhjdysjjhdyhrcgogqt.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function LLamaChat() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCartCollapsed, setIsCartCollapsed] = useState(false);
    const [products, setProducts] = useState([]);
    const messagesEndRef = useRef(null);
    const { cart, setCart, addOrder, addToCart } = useCart();

    const isMobile = useMediaQuery({ maxWidth: 768 });
    const isLaptop = useMediaQuery({ minWidth: 1024, maxWidth: 1440 });

    useEffect(() => {
        if (isMobile) {
            setIsCollapsed(true);
            setIsCartCollapsed(false);
        } else if (isLaptop) {
            setIsCollapsed(false);
            setIsCartCollapsed(true);
        }
    }, [isMobile, isLaptop]);

    // Загрузка продуктов из Supabase для ИИ
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data, error } = await supabase
                    .from('pyatorochka_products')
                    .select('*');
                if (error) {
                    console.error('Ошибка загрузки продуктов для ИИ:', error.message);
                } else {
                    console.log('Загружено продуктов для ИИ:', data.length);
                    console.log('Структура продуктов:', data[0]);  // Отладка структуры
                    setProducts(data);
                }
            } catch (error) {
                console.error('Общая ошибка загрузки для ИИ:', error);
            }
        };
        fetchProducts();
    }, []);

    const API_KEY = "io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImIwYTA4NTJjLTI3MDYtNGQ1Mi1iNmVjLWI2Y2E2MTQ4YjE4NCIsImV4cCI6NDkxMjc4MzY5Mn0.MvmbdN8WgCqLHVUBKdzP2fw3OdI_IOJQNeIKRZzi65KaD_WUEP1xAe7x1R4LMyoDvAlOHNYF_A54vVSZv-cXHA";
    const API_URL = "https://api.intelligence.io.solutions/api/v1/chat/completions";

    const fetchAIResponse = async (userMessage) => {
        try {
            // Ограничиваем список продуктов для ускорения
            const productsList = products.slice(0, 50).map(p => `${p.name || p.product_name || p.title || 'Без названия'} - ${p.price_numeric || p.price || 'Без цены'}₽`).join(', ');

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
                            НАЙДИ ТОЧНОЕ НАЗВАНИЕ из списка, укажи его в ответе и ОБЯЗАТЕЛЬНО добавь в КОНЦЕ ответа команду: [add_to_cart: ТОЧНОЕ_НАЗВАНИЕ_ИЗ_СПИСКА, количество].
                            Количество по умолчанию 1, если не указано. Если товара нет в списке, ответь "Товар не найден в списке" БЕЗ команды.`
                },
                ...messages.map(msg => ({ role: msg.isUser ? "user" : "assistant", content: msg.text })),
                { role: "user", content: userMessage }
            ];

            console.log('Отправляем промпт с productsList:', productsList.substring(0, 200) + '...');

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
                    messages: messageHistory,
                    max_tokens: 300,  // Уменьшили для скорости
                    temperature: 0.7,  // Увеличил для ускорения
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
            console.log('Полный ответ ИИ:', aiResponseText);
            // Убираем команду из текста для пользователя
            const displayText = aiResponseText.replace(/\s*\[add_to_cart:\s*[^,]+,\s*\d+\]/gi, '').trim() || 'Ответ обработан.';
            const aiMessage = { text: displayText, isUser: false };
            setMessages(prev => [...prev, aiMessage]);

            // Парсинг команды для добавления в корзину
            const addToCartRegex = /\[add_to_cart:\s*([^,]+),\s*(\d+)\]/gi;
            let match;
            let commandsFound = 0;
            while ((match = addToCartRegex.exec(aiResponseText)) !== null) {
                commandsFound++;
                console.log(`Найдена команда #${commandsFound}:`, match[0]);
                const productName = match[1].trim();
                const quantity = parseInt(match[2], 10) || 1;

                console.log(`Ищем товар: "${productName}" в списке продуктов (всего: ${products.length})`);

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
                    console.log('Fuzzy-поиск дал:', product ? product.name || product.product_name || product.title : 'Ничего');
                }

                if (product) {
                    const itemToAdd = { 
                        ...product, 
                        quantity,
                        price: product.price_numeric || product.price || 0
                    };
                    addToCart(itemToAdd);
                    console.log(`Добавлен в корзину: ${product.name || product.product_name || product.title}, количество: ${quantity}`);
                } else {
                    console.warn(`Товар не найден: "${productName}". Доступные имена:`, 
                        products.map(p => p.name || p.product_name || p.title).join(', '));
                }
            }
            if (commandsFound === 0) {
                console.log('Команды add_to_cart не найдены в ответе ИИ');
            }
        } catch (error) {
            console.error('Ошибка обработки ответа ИИ:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const toggleChat = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleCart = () => {
        setIsCartCollapsed(!isCartCollapsed);
    };

    const totalCost = cart.reduce((total, item) => total + ((item.price_numeric || item.price || 0) * item.quantity), 0);

    const handleOrder = () => {
        addOrder(totalCost);
    };

    return (
        <>
            <div className={`chat-container ${isCollapsed ? 'chat-container-collapsed' : ''} ${isLaptop ? 'laptop' : ''}`}>
                <div className="chat-header" onClick={toggleChat}>
                    <h2>FOODAI</h2>
                </div>
                {!isCollapsed && (
                    <>
                        <div className="messages-container">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}>
                                    <div className="message-content">
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message ai-message">
                                    <div className="message-content">
                                        FOODAI печатает...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="input-container">
                            <input 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                disabled={isLoading}
                                placeholder="Введите текст..."
                                className="chat-input"
                            />
                            <button onClick={handleSend} disabled={isLoading} className="send-button">
                                {/* SVG код был здесь */}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className={`cart-container ${isCartCollapsed ? 'cart-container-collapsed' : ''} ${isLaptop ? 'laptop' : ''}`}>
                <div className="cart-header" onClick={toggleCart}>
                    <h2>Корзина</h2>
                </div>
                {!isCartCollapsed && (
                    <>
                        <div className="cart-items">
                            {cart.length > 0 ? (
                                cart.map((item, index) => (
                                    <div key={index} className="cart-item">
                                        <div className="item-controls">
                                            <div className="quantity-controls">
                                                <button className="quantity-btn" onClick={() => { /* Логика минус */ }}>-</button>
                                                <span className="quantity">{item.quantity}</span>
                                                <button className="quantity-btn" onClick={() => { /* Логика плюс */ }}>+</button>
                                            </div>
                                            <div className="item-price">{(item.price_numeric || item.price || 0) * item.quantity}₽</div>
                                        </div>
                                        <p>{item.name || item.product_name || item.title} - {item.weight}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Корзина пуста</p>
                            )}
                        </div>
                        <div className="delivery-info"> </div>
                        <div className="cart-footer">
                        </div>
                    </>
                )}
            </div>

            <div className="order-block">
                {!isCartCollapsed ? (
                    <button className={`order-button-floating ${!isCollapsed && !isCartCollapsed ? 'chat-expanded' : ''}`} onClick={handleOrder}>
                        <span>Заказать</span>
                        <span className="end">{totalCost}₽</span>
                    </button>
                ) : null}
            </div>
        </>
    );
}

export default LLamaChat;