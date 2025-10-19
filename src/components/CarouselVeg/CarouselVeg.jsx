import React from 'react';
import Carousel from '../Carousel/Carousel';

function CarouselVeg() {
  return (
    <Carousel 
      title="Рекомендовано вам"
      tableName="pyatorochka_products"
      showDiscount={true}
      autoPlay={false}
      itemsPerView={5}
      showNavigation={true}
      showDots={false}
    />
  );
}

export default CarouselVeg;