import React from 'react';
import { Helmet } from 'react-helmet';

import Navigation from '../../components/Navigation/Navigation';
import Carousel from '../../components/Carousel/Carousel';

function MainPage() {
  return (
    <>
      <Helmet>
        <title>Главная — SAAD</title>
      </Helmet>
    <Navigation></Navigation>
    <Carousel></Carousel>
    </>
  );
}

export default MainPage;