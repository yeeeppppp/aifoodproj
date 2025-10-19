import { useState, useEffect, useRef, useCallback } from 'react';
import './CategoryNavigation.css';

export default function CategoryNavigation() {
  const [isSticky, setIsSticky] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const navRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastStickyState = useRef(false);
  const animationTriggered = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Статичные категории
  const categories = [
    { id: 'dairy', name: 'Молочные продукты', emoji: '🥛' },
    { id: 'meat', name: 'Мясо и птица', emoji: '🍖' },
    { id: 'vegetables', name: 'Овощи', emoji: '🥬' },
    { id: 'fruits', name: 'Фрукты', emoji: '🍎' },
    { id: 'bakery', name: 'Выпечка', emoji: '🥖' },
    { id: 'beverages', name: 'Напитки', emoji: '🥤' },
    { id: 'snacks', name: 'Снеки', emoji: '🍿' },
    { id: 'frozen', name: 'Замороженное', emoji: '🧊' }
  ];

  const handleScroll = useCallback(() => {
    if (!navRef.current) return;
    
    // Debounce scroll events
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 95;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Простая и надежная логика: sticky когда скролл больше высоты navbar
      const shouldBeSticky = scrollTop > navHeight;
      
      // Проверяем, действительно ли состояние изменилось
      if (shouldBeSticky !== lastStickyState.current) {
        console.log('Sticky state changed:', { 
          from: lastStickyState.current, 
          to: shouldBeSticky, 
          scrollTop, 
          navHeight 
        });
        
        // Анимация только при переходе в sticky состояние И если анимация еще не была запущена
        if (shouldBeSticky && !lastStickyState.current && !animationTriggered.current) {
          console.log('Playing animation - entering sticky state');
          animationTriggered.current = true;
          setIsAnimating(true);
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            console.log('Animation completed');
            setIsAnimating(false);
          }, 500);
        }
        
        // Сбрасываем флаг анимации при выходе из sticky
        if (!shouldBeSticky && lastStickyState.current) {
          animationTriggered.current = false;
        }
        
        lastStickyState.current = shouldBeSticky;
        setIsSticky(shouldBeSticky);
      }
    }, 16); // ~60fps
  }, []);

  useEffect(() => {
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  return (
    <div ref={navRef} className={`category-navigation ${isSticky ? 'sticky' : ''} ${isAnimating ? 'animating' : ''}`}>
      <div className="category-navigation__inner">
        <button 
          className={`category-pill ${!activeCategory ? 'active' : ''}`} 
          onClick={() => setActiveCategory(null)}
        >
          Все
        </button>
        {categories.map((category, index) => (
          <button 
            key={category.id} 
            className={`category-pill ${activeCategory === category.id ? 'active' : ''}`} 
            onClick={() => setActiveCategory(category.id)}
            style={{ 
              animationDelay: `${index * 50}ms`,
              transitionDelay: `${index * 30}ms`
            }}
          >
            {category.emoji} {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
