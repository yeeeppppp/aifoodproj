// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Carousel from './components/Carousel/Carousel';
import Navigation from './components/Navigation/Navigation';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import { CartProvider } from './components/Carousel/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div>
          <Routes>
            <Route path='/' element={<MainPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/profile' element={<ProfilePage/>}/>
            <Route path='/payment' element={<PaymentPage/>}/>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;