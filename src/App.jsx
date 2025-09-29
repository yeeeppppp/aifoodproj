// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Carousel from './components/Carousel/Carousel';
import Navigation from './components/Navigation/Navigation';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Navigation/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;