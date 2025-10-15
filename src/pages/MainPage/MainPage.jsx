import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import CarouselVeg from '../../components/CarouselVeg/CarouselVeg';
import Carousel from '../../components/Carousel/Carousel';
import CarouselBer from '../../components/CarouselBer/CarouselBer';
import LLamaChatV3 from '../../components/LLamaChat/LLamaChatV3';
import './MainPage.css';
import Button from '../../components/ui/Button';
import ProductCard from '../../components/ui/ProductCard';
import Skeleton from '../../components/ui/Skeleton';
import Empty from '../../components/ui/Empty';
import supabase from '../../supabaseClient';
import { useCart } from '../../components/Carousel/CartContext';
import FilterChip from '../../components/ui/FilterChip';

function MainPage() {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [reorders, setReorders] = useState([]);
  const [together, setTogether] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [prodRes, catRes, dealRes] = await Promise.all([
          supabase.from('products').select('*').limit(12),
          supabase.from('categories').select('*').limit(12),
          supabase.from('deals').select('*').limit(6)
        ]);
        // Reorders: берём последние заказанные позиции пользователя
        const ordersRes = await supabase.from('orders').select('items').order('created_at', { ascending: false }).limit(3);
        const orderedItems = (ordersRes.data || []).flatMap(o => o.items || []);
        // Часто берут вместе: упрощённо берём топ по повторяемости имён
        const nameCount = new Map();
        for (const it of orderedItems) { nameCount.set(it.name, (nameCount.get(it.name) || 0) + 1); }
        const topNames = Array.from(nameCount.entries()).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([n])=>n);
        const togetherRes = topNames.length ? await supabase.from('products').select('*').in('name', topNames) : { data: [] };
        if (!isMounted) return;
        setProducts(prodRes.data || []);
        setCategories(catRes.data || []);
        setDeals(dealRes.data || []);
        setReorders(orderedItems.slice(0,6));
        setTogether(togetherRes.data || []);

        // Смарт-наборы: простые пресеты по тегам и цене
        const prods = prodRes.data || [];
        const pick = (fn, limit=5) => prods.filter(fn).slice(0, limit);
        const econ = pick(p => (p.tags||[]).includes('акции') || (p.price||0) < 200, 6);
        const vitamins = pick(p => (p.tags||[]).includes('фрукты') || (p.tags||[]).includes('овощи'), 6);
        const week = pick(() => true, 10);
        setBundles([
          { id: 'econ', title: 'Корзина эконом', items: econ },
          { id: 'vit', title: 'Корзина витаминов', items: vitamins },
          { id: 'week', title: 'Рацион на неделю', items: week },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filteredProducts = !activeTags.length ? products : products.filter(p => {
    const tags = (p.tags || []).map(String);
    return activeTags.every(t => tags.includes(t));
  });

  const productsByCategory = (cat) => {
    if (!cat) return filteredProducts;
    return filteredProducts.filter(p => String(p.category_slug || p.category) === String(cat));
  };
  return (
    <>
      <Helmet>
        <title>FOODAI</title>
      </Helmet>
    <main className="main-page">
      {/* Hero section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Доставим продукты быстро и удобно</h1>
          <p>Свежие товары, акции и персональные рекомендации — всё в одном месте.</p>
          <div className="hero-cta">
            <Button variant="primary" size="lg">Выбрать продукты</Button>
            <span className="hero-note">доставка от 15 минут</span>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="benefits">
        <div className="benefit">
          <div className="benefit-icon">🚀</div>
          <div className="benefit-text">Быстрая доставка</div>
        </div>
        <div className="benefit">
          <div className="benefit-icon">🥬</div>
          <div className="benefit-text">Всегда свежие</div>
        </div>
        <div className="benefit">
          <div className="benefit-icon">💳</div>
          <div className="benefit-text">Удобная оплата</div>
        </div>
        <div className="benefit">
          <div className="benefit-icon">⭐</div>
          <div className="benefit-text">Выбор покупателей</div>
        </div>
      </section>

      {/* Category quick bar */}
      <div className="cat-bar">
        <div className="cat-bar__inner">
          <button className={`cat-pill ${!activeCategory ? 'cat-pill--active':''}`} onClick={()=>setActiveCategory(null)}>Все</button>
          {categories.map(cat => (
            <button key={cat.id} className={`cat-pill ${activeCategory===(cat.slug||cat.id)?'cat-pill--active':''}`} onClick={()=>setActiveCategory(cat.slug||cat.id)}>
              {cat.emoji || '🛒'} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Categories grid */}
      <section className="categories">
        <h2 className="section-title">Категории</h2>
        <div className="categories-grid">
          {loading && Array.from({length:6}).map((_,i)=> (
            <div key={i} className="category-card"><Skeleton height={80} /></div>
          ))}
          {!loading && categories.length === 0 && (
            <Empty title="Нет категорий" description="Попробуйте позже" />
          )}
          {!loading && categories.map(cat => (
            <a className="category-card" key={cat.id} href={`#cat-${cat.slug || cat.id}`} onClick={(e)=>{e.preventDefault(); setActiveCategory(cat.slug||cat.id);}}>
              <div className="category-emoji">{cat.emoji || '🛒'}</div>
              <span>{cat.name}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Deals row */}
      <section className="deals">
        <h2 className="section-title">Горячие предложения</h2>
        <div className="deals-row">
          {loading && Array.from({length:3}).map((_,i)=> (
            <div className="deal-card" key={i}><Skeleton height={120} /></div>
          ))}
          {!loading && deals.length === 0 && (
            <Empty title="Акций нет" description="Загляните позже" />
          )}
          {!loading && deals.map(deal => (
            <div className="deal-card" key={deal.id}>
              <span className="deal-badge">{deal.badge || 'SALE'}</span>
              <h3>{deal.title}</h3>
              <p>{deal.subtitle}</p>
              <button className="deal-button">{deal.cta || 'К покупкам'}</button>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery info strip */}
      <section className="delivery-strip">
        <div className="delivery-item">
          <span className="dot"></span>
          <div>
            <div className="delivery-title">В вашем районе</div>
            <div className="delivery-sub">сегодня с 10:00 до 22:00</div>
          </div>
        </div>
        <div className="delivery-item">
          <span className="dot"></span>
          <div>
            <div className="delivery-title">Самовывоз</div>
            <div className="delivery-sub">доступен на ближайшей точке</div>
          </div>
        </div>
        <div className="delivery-item">
          <span className="dot"></span>
          <div>
            <div className="delivery-title">Бесплатно от 1500 ₽</div>
            <div className="delivery-sub">по промокоду FOODAI</div>
          </div>
        </div>
      </section>

      {/* Recommended products */}
      <section className="deals">
        <h2 className="section-title">Рекомендовано вам</h2>
        <div style={{display:'flex', gap:8, flexWrap:'wrap', margin:'8px 0 12px 0'}}>
          {['без сахара','веган','без лактозы','акции'].map(tag => (
            <FilterChip key={tag} active={activeTags.includes(tag)} onClick={() => toggleTag(tag)}>{tag}</FilterChip>
          ))}
        </div>
        <div className="deals-row">
          {loading && Array.from({length:3}).map((_,i)=> (
            <div key={i}><Skeleton height={250} /></div>
          ))}
          {!loading && products.length === 0 && (
            <Empty title="Пусто" description="Нет рекомендаций" />
          )}
          {!loading && productsByCategory(activeCategory).slice(0,6).map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* Reorder */}
      <section className="deals">
        <h2 className="section-title">Купить снова</h2>
        <div className="deals-row">
          {loading && Array.from({length:3}).map((_,i)=> (
            <div key={i}><Skeleton height={250} /></div>
          ))}
          {!loading && reorders.length === 0 && (
            <Empty title="Пока пусто" description="Сделайте первый заказ" />
          )}
          {!loading && reorders.map((it, idx) => (
            <ProductCard key={idx} product={it} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* Frequently bought together */}
      <section className="deals">
        <h2 className="section-title">Часто берут вместе</h2>
        <div className="deals-row">
          {loading && Array.from({length:3}).map((_,i)=> (
            <div key={i}><Skeleton height={250} /></div>
          ))}
          {!loading && together.length === 0 && (
            <Empty title="Нет данных" description="Загляните позже" />
          )}
          {!loading && together.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* Smart bundles */}
      <section className="deals">
        <h2 className="section-title">Смарт‑наборы</h2>
        <div className="deals-row">
          {loading && Array.from({length:3}).map((_,i)=> (
            <div key={i}><Skeleton height={250} /></div>
          ))}
          {!loading && bundles.length === 0 && (
            <Empty title="Пока нет наборов" description="Загляните позже" />
          )}
          {!loading && bundles.map(b => (
            <div key={b.id} className="ui-card">
              <div className="section-title" style={{margin:'0 0 8px 0'}}>{b.title}</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16}}>
                {b.items.slice(0,3).map(it => (
                  <ProductCard key={it.id || it.name} product={it} onAdd={addToCart} />
                ))}
              </div>
              <div style={{marginTop:12}}>
                <Button variant="secondary" size="md">Открыть набор</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
    <LLamaChatV3></LLamaChatV3>
    </>
  );
}

export default MainPage;