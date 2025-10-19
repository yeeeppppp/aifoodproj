import React, { useRef, useState, useEffect, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import "./Carousel.css";
import { CartContext } from './CartContext.jsx';
import supabase from '../../supabaseClient';
import spinner from '../../assets/Spinner3.gif';

function Carousel({ 
  title = "Молочная продукция, яйца",
  tableName = "new_pyatorkochka_milk",
  showDiscount = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  itemsPerView = 5,
  showNavigation = true,
  showDots = false
}) {
  const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
    const { cart, setCart } = useContext(CartContext);

  // Динамический расчет ширины карточки в зависимости от размера экрана
  const getCardWidth = useCallback(() => {
    const screenWidth = window.innerWidth;
    let cardWidth = 255; // базовая ширина
    let gap = 16; // базовый gap
    
    if (screenWidth <= 480) {
      cardWidth = 180;
      gap = 8;
    } else if (screenWidth <= 768) {
      cardWidth = 200;
      gap = 8;
    } else if (screenWidth <= 1200) {
      cardWidth = 240;
      gap = 12;
    }
    
    return cardWidth + gap;
  }, []);

  const CARD_WIDTH = getCardWidth();

  // Загрузка продуктов
    useEffect(() => {
        const fetchProducts = async () => {
            try {
        setLoading(true);
        console.log('Загружаем продукты из таблицы:', tableName);
        
                const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(20);

        console.log('Результат запроса:', { data, error });

                if (error) {
          console.error('Ошибка загрузки продуктов:', error.message, error);
          // Используем fallback данные при ошибке подключения к БД
          const fallbackProducts = [
            {
              id: 1,
              name: 'Молоко "Первый вкус" 1л',
              price: 89,
              price_numeric: 89,
              image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop&crop=center',
              size: '1л',
              oldPrice: 120,
              discount: 25
            },
            {
              id: 2,
              name: 'Яйца куриные С1 10шт',
              price: 95,
              price_numeric: 95,
              image: 'https://images.unsplash.com/photo-1518569656558-1ec25ec5e307?w=300&h=200&fit=crop&crop=center',
              size: '10шт',
              oldPrice: 0,
              discount: 0
            },
            {
              id: 3,
              name: 'Сыр "Российский" 45%',
              price: 180,
              price_numeric: 180,
              image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=200&fit=crop&crop=center',
              size: '200г',
              oldPrice: 220,
              discount: 18
            },
            {
              id: 4,
              name: 'Йогурт "Активия" натуральный',
              price: 65,
              price_numeric: 65,
              image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&crop=center',
              size: '150г',
              oldPrice: 0,
              discount: 0
            },
            {
              id: 5,
              name: 'Творог 9% "Простоквашино"',
              price: 75,
              price_numeric: 75,
              image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=200&fit=crop&crop=center',
              size: '200г',
              oldPrice: 90,
              discount: 17
            }
          ];
          setProducts(fallbackProducts);
          return;
        }

        if (!data || data.length === 0) {
          console.log('Данные не найдены в таблице:', tableName);
          // Используем fallback данные если таблица пустая
          const fallbackProducts = [
            {
              id: 1,
              name: 'Молоко "Первый вкус" 1л',
              price: 89,
              price_numeric: 89,
              image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop&crop=center',
              size: '1л',
              oldPrice: 120,
              discount: 25
            },
            {
              id: 2,
              name: 'Яйца куриные С1 10шт',
              price: 95,
              price_numeric: 95,
              image: 'https://images.unsplash.com/photo-1518569656558-1ec25ec5e307?w=300&h=200&fit=crop&crop=center',
              size: '10шт',
              oldPrice: 0,
              discount: 0
            },
            {
              id: 3,
              name: 'Сыр "Российский" 45%',
              price: 180,
              price_numeric: 180,
              image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=200&fit=crop&crop=center',
              size: '200г',
              oldPrice: 220,
              discount: 18
            },
            {
              id: 4,
              name: 'Йогурт "Активия" натуральный',
              price: 65,
              price_numeric: 65,
              image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&crop=center',
              size: '150г',
              oldPrice: 0,
              discount: 0
            },
            {
              id: 5,
              name: 'Творог 9% "Простоквашино"',
              price: 75,
              price_numeric: 75,
              image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=200&fit=crop&crop=center',
              size: '200г',
              oldPrice: 90,
              discount: 17
            }
          ];
          setProducts(fallbackProducts);
          return;
        }

        console.log('Обрабатываем данные из БД:', data.length, 'продуктов');
        
        const processedProducts = data.map((product, index) => {
          console.log(`Продукт ${index + 1}:`, {
            name: product.name,
            image_url: product.image_url,
            image: product.image,
            price: product.price,
            price_numeric: product.price_numeric
          });
          
          // Определяем URL изображения
          let imageUrl = product.image_url || product.image || product.img || product.photo;
          
          // Если нет изображения, создаем placeholder с названием товара
          if (!imageUrl) {
            imageUrl = `https://via.placeholder.com/300x200/65AD55/FFFFFF?text=${encodeURIComponent(product.name || 'Товар')}`;
          }
          
          return {
            ...product,
            image: imageUrl,
            size: product.size || product.weight || 'N/A',
            oldPrice: product.old_price || 0,
            discount: product.discount || 0
          };
        });

        console.log('Обработанные продукты:', processedProducts);
        setProducts(processedProducts);
      } catch (error) {
        console.error('Общая ошибка загрузки:', error);
        // Используем fallback данные при любой ошибке
        const fallbackProducts = [
          {
            id: 1,
            name: 'Молоко "Первый вкус" 1л',
            price: 89,
            price_numeric: 89,
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop&crop=center',
            size: '1л',
            oldPrice: 120,
            discount: 25
          },
          {
            id: 2,
            name: 'Яйца куриные С1 10шт',
            price: 95,
            price_numeric: 95,
            image: 'https://images.unsplash.com/photo-1518569656558-1ec25ec5e307?w=300&h=200&fit=crop&crop=center',
            size: '10шт',
            oldPrice: 0,
            discount: 0
          },
          {
            id: 3,
            name: 'Сыр "Российский" 45%',
            price: 180,
            price_numeric: 180,
            image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=200&fit=crop&crop=center',
            size: '200г',
            oldPrice: 220,
            discount: 18
          },
          {
            id: 4,
            name: 'Йогурт "Активия" натуральный',
            price: 65,
            price_numeric: 65,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop&crop=center',
            size: '150г',
            oldPrice: 0,
            discount: 0
          },
          {
            id: 5,
            name: 'Творог 9% "Простоквашино"',
            price: 75,
            price_numeric: 75,
            image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=200&fit=crop&crop=center',
            size: '200г',
            oldPrice: 90,
            discount: 17
          }
        ];
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tableName]);

  // Автопрокрутка
    useEffect(() => {
    if (!autoPlay || products.length <= itemsPerView) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, products.length, itemsPerView]);

  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      // Пересчитываем позицию при изменении размера экрана
      const newCardWidth = getCardWidth();
      if (newCardWidth !== CARD_WIDTH) {
        // Можно добавить логику для корректировки currentIndex если нужно
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getCardWidth, CARD_WIDTH]);

  // Плавная прокрутка
  const scrollToIndex = useCallback((index) => {
    if (!carouselRef.current || isTransitioning) return;

    setIsTransitioning(true);
    const maxIndex = Math.max(0, products.length - itemsPerView);
    const targetIndex = Math.min(index, maxIndex);
    
    setCurrentIndex(targetIndex);
    
    setTimeout(() => setIsTransitioning(false), 300);
  }, [products.length, itemsPerView, isTransitioning]);

  const handleNext = useCallback(() => {
    const maxIndex = Math.max(0, products.length - itemsPerView);
    const nextIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    scrollToIndex(nextIndex);
  }, [currentIndex, products.length, itemsPerView, scrollToIndex]);

  const handlePrev = useCallback(() => {
    const maxIndex = Math.max(0, products.length - itemsPerView);
    const prevIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
    scrollToIndex(prevIndex);
  }, [currentIndex, products.length, itemsPerView, scrollToIndex]);

  const handleDotClick = useCallback((index) => {
    scrollToIndex(index);
  }, [scrollToIndex]);

  // Добавление в корзину
  const addToCart = useCallback((product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find((item) => item.name === product.name);
            if (existingProduct) {
                return prevCart.map((item) =>
          item.name === product.name 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
  }, [setCart]);

  // Обработка клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch/Swipe поддержка
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (loading) {
    return (
      <div className="carousel-container">
        <div className="carousel-header">
          <h2 className="carousel-title">{title}</h2>
        </div>
        <div className="carousel-loading">
          <img src={spinner} alt="Загрузка..." />
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
        <div className="carousel-container">
        <div className="carousel-header">
          <h2 className="carousel-title">{title}</h2>
        </div>
        <div className="carousel-empty">
          <p>Товары не найдены</p>
        </div>
      </div>
    );
  }

  const maxIndex = Math.max(0, products.length - itemsPerView);
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        {showDots && products.length > itemsPerView && (
          <div className="carousel-dots">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        )}
            </div>

            <div className="carousel-viewport">
        <div 
          className="carousel-track"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(-${currentIndex * CARD_WIDTH}px)`,
            transition: isTransitioning ? 'transform 0.3s ease-in-out' : 'none',
            width: `${products.length * CARD_WIDTH}px`
          }}
        >
          {products.map((product, index) => (
            <div key={`${product.id || product.name}-${index}`} className="product-card">
              {showDiscount && product.discount > 0 && (
                <div className="product-discount">
                  <span>-{product.discount}%</span>
                                </div>
              )}
              
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="product-image"
                  loading="lazy"
                  onError={(e) => {
                    console.log('Ошибка загрузки изображения:', product.image, 'для товара:', product.name);
                    // Устанавливаем placeholder только если это не уже placeholder
                    if (!e.target.src.includes('via.placeholder.com')) {
                      e.target.src = `https://via.placeholder.com/300x200/65AD55/FFFFFF?text=${encodeURIComponent(product.name || 'Товар')}`;
                    }
                  }}
                  onLoad={() => {
                    console.log('Изображение загружено успешно:', product.image, 'для товара:', product.name);
                  }}
                />
                            </div>

              <div className="product-info">
                <div className="product-price">
                  <span className="current-price">
                    {product.price_numeric || product.price}₽
                  </span>
                  {product.oldPrice > 0 && (
                    <span className="old-price">{product.oldPrice}₽</span>
                    )}
                </div>

                <h3 className="product-name">{product.name}</h3>
                <p className="product-weight">{product.size}</p>
              </div>

              <button 
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
                aria-label={`Добавить ${product.name} в корзину`}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2V18M2 10H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {showNavigation && products.length > itemsPerView && (
        <>
          <button 
            className={`carousel-nav carousel-nav-prev ${!canGoPrev ? 'disabled' : ''}`}
            onClick={handlePrev}
            disabled={!canGoPrev}
            aria-label="Предыдущий слайд"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button 
            className={`carousel-nav carousel-nav-next ${!canGoNext ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={!canGoNext}
            aria-label="Следующий слайд"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
                </button>
        </>
            )}
        </div>
    );
}

Carousel.propTypes = {
  title: PropTypes.string,
  tableName: PropTypes.string,
  showDiscount: PropTypes.bool,
  autoPlay: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
  itemsPerView: PropTypes.number,
  showNavigation: PropTypes.bool,
  showDots: PropTypes.bool
};

export default Carousel;