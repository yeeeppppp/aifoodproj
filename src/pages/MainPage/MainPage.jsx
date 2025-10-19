import { Helmet } from 'react-helmet';

import LLamaChat from '../../components/LLamaChat/LLamaChat';
import CategoryNavigation from '../../components/CategoryNavigation/CategoryNavigation';
import Carousel from '../../components/Carousel/Carousel';

function MainPage() {
  return (
    <>
      <Helmet>
        <title>FOODAI</title>
      </Helmet>
      <main className="main-page">
        <CategoryNavigation />
        
        <Carousel 
          title="Горячие предложения"
          tableName="new_pyatorkochka_milk"
        />
        
        <Carousel 
          title="Купить снова"
          tableName="pyatorochka_products"
        />
        
        <Carousel 
          title="Часто берут вместе"
          tableName="new_pyatorkochka_milk"
        />
        
        <Carousel 
          title="Смарт‑наборы"
          tableName="pyatorochka_products"
        />
      </main>
      <LLamaChat />
    </>
  );
}

export default MainPage;