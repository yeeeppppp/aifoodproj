// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Carousel from './components/Carousel/Carousel';

function App() {
  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path='/Carousel' element={<Carousel/>}/>
        </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;