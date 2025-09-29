import React from 'react';
import { Helmet } from 'react-helmet';

import Navigation from '../../components/Navigation/Navigation';
import Carousel from '../../components/CarouselMilk/CarouselMilk';

function MainPage() {
  return (
    <>
      <Helmet>
        <title>FOODAI</title>
      </Helmet>
    <Navigation></Navigation>
    <Carousel></Carousel>
    </>
  );
}

export default MainPage;