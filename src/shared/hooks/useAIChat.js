import { useState, useCallback } from 'react';

const API_KEY = "io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImIwYTA4NTJjLTI3MDYtNGQ1Mi1iNmVjLWI2Y2E2MTQ4YjE4NCIsImV4cCI6NDkxMjc4MzY5Mn0.MvmbdN8WgCqLHVUBKdzP2fw3OdI_IOJQNeIKRZzi65KaD_WUEP1xAe7x1R4LMyoDvAlOHNYF_A54vVSZv-cXHA";
const API_URL = "https://api.intelligence.io.solutions/api/v1/chat/completions";

/**
 * Хук для работы с AI чатом
 */
export function useAIChat(products = []) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchAIResponse = useCallback(async (userMessage, messageHistory = []) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const productsList = products.slice(0, 50).map(p => 
        `${p.name || p.product_name || p.title || 'Без названия'} - ${p.price_numeric || p.price || 'Без цены'}₽`
      ).join(', ');

      const systemMessage = {
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
      };

      const messageHistoryFormatted = messageHistory.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text
      }));

      const messages = [
        systemMessage,
        ...messageHistoryFormatted,
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
          messages,
          max_tokens: 300,
          temperature: 0.7,
          stream: false,
          reasoning: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error('Ошибка запроса к ИИ:', err);
      setError(err.message);
      return 'Ошибка: Не удалось получить ответ от ИИ. Попробуйте позже.';
    } finally {
      setIsLoading(false);
    }
  }, [products]);

  const parseAddToCartCommands = useCallback((aiResponseText) => {
    const commands = [];
    const addToCartRegex = /\[add_to_cart:\s*([^,]+),\s*(\d+)\]/gi;
    let match;
    
    while ((match = addToCartRegex.exec(aiResponseText)) !== null) {
      commands.push({
        productName: match[1].trim(),
        quantity: parseInt(match[2], 10) || 1
      });
    }
    
    return commands;
  }, []);

  const findProductByName = useCallback((productName) => {
    // Точное совпадение
    let product = products.find(p => 
      (p.name?.toLowerCase() === productName.toLowerCase()) ||
      (p.product_name?.toLowerCase() === productName.toLowerCase()) ||
      (p.title?.toLowerCase() === productName.toLowerCase())
    );

    // Нечеткий поиск
    if (!product) {
      product = products.find(p => 
        (p.name?.toLowerCase().includes(productName.toLowerCase())) ||
        (p.product_name?.toLowerCase().includes(productName.toLowerCase())) ||
        (p.title?.toLowerCase().includes(productName.toLowerCase()))
      );
    }

    return product;
  }, [products]);

  return {
    isLoading,
    error,
    fetchAIResponse,
    parseAddToCartCommands,
    findProductByName,
  };
}








