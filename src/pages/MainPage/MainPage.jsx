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
          itemsPerView={4}
        />
        
        <Carousel 
          title="Купить снова"
          tableName="new_pyatorkochka_milk"
          itemsPerView={4}
        />
        
        <Carousel 
          title="Часто берут вместе"
          tableName="new_pyatorkochka_milk"
          itemsPerView={4}
        />
        
        <Carousel 
          title="Смарт‑наборы"
          tableName="new_pyatorkochka_milk"
          itemsPerView={4}
        />
      </main>
      <LLamaChat />
    </>
  );
}

export default MainPage;