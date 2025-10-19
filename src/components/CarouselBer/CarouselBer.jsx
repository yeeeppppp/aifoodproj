import React from 'react';
import Carousel from '../Carousel/Carousel';

function CarouselBer() {
  return (
    <Carousel 
      title="Купить снова"
      tableName="pyatorochka_products"
      showDiscount={true}
      autoPlay={false}
      itemsPerView={5}
      showNavigation={true}
      showDots={false}
    />
  );
}

export default CarouselBer;