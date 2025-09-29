import React from 'react';
import { Helmet } from 'react-helmet';

import Navigation from '../../components/Navigation/Navigation';
import CarouselVeg from '../../components/CarouselVeg/CarouselVeg';
import Carousel from '../../components/Carousel/Carousel';
import CarouselBer from '../../components/CarouselBer/CarouselBer';
import LLamaChat from '../../components/LLamaChat/LLamaChat';

function MainPage() {
  return (
    <>
      <Helmet>
        <title>FOODAI</title>
      </Helmet>
    <Navigation></Navigation>
    <Carousel></Carousel>
    <CarouselVeg></CarouselVeg>
    <CarouselBer></CarouselBer>
    <LLamaChat></LLamaChat>
    </>
  );
}

export default MainPage;