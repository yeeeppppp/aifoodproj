// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Carousel from './components/Carousel/Carousel';
import Navigation from './components/Navigation/Navigation';
import MainPage from './pages/MainPage/MainPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;