import { useState, useEffect, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';

/**
 * Хук для управления состоянием чата с адаптивным поведением
 */
export function useChatState() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewMode, setViewMode] = useState('chat'); // 'chat' | 'cart' | 'split'
  
  // Медиа-запросы
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  
  // Автоматическая настройка режима просмотра
  useEffect(() => {
    if (isMobile) {
      setViewMode('chat');
      setIsCartOpen(false);
      setIsChatOpen(false); // Закрываем по умолчанию на мобильных
    } else if (isTablet) {
      setViewMode('split');
      setIsCartOpen(false); // Закрываем по умолчанию
      setIsChatOpen(false); // Закрываем по умолчанию
    } else {
      setViewMode('split');
      setIsCartOpen(false); // Закрываем по умолчанию
      setIsChatOpen(false); // Закрываем по умолчанию
    }
  }, [isMobile, isTablet, isDesktop]);
  
  // Обработчики для мобильных устройств
  const handleChatToggle = useCallback(() => {
    if (isMobile) {
      setIsChatOpen(prev => {
        const newState = !prev;
        if (newState) {
          setIsCartOpen(false);
        }
        return newState;
      });
    }
  }, [isMobile]);
  
  const handleCartToggle = useCallback(() => {
    if (isMobile) {
      setIsCartOpen(prev => {
        const newState = !prev;
        if (newState) {
          setIsChatOpen(false);
        }
        return newState;
      });
    }
  }, [isMobile]);
  
  // Обработчики для планшетов и десктопов
  const handleChatOpen = useCallback(() => {
    if (!isMobile) {
      setIsChatOpen(true);
    }
  }, [isMobile]);
  
  const handleCartOpen = useCallback(() => {
    if (!isMobile) {
      setIsCartOpen(true);
    }
  }, [isMobile]);
  
  // Обработчики для всех устройств
  const handleChatToggleAll = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);
  
  const handleCartToggleAll = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);
  
  const handleCloseAll = useCallback(() => {
    setIsChatOpen(false);
    setIsCartOpen(false);
  }, []);
  
  return {
    // Состояние
    isChatOpen,
    isCartOpen,
    viewMode,
    isMobile,
    isTablet,
    isDesktop,
    
    // Обработчики
    handleChatToggle,
    handleCartToggle,
    handleChatOpen,
    handleCartOpen,
    handleChatToggleAll,
    handleCartToggleAll,
    handleCloseAll,
    setIsChatOpen,
    setIsCartOpen,
  };
}
