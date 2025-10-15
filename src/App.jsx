import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage/PaymentPage'));
import { CartProvider } from './components/Carousel/CartContext';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Suspense fallback={null}>
            <Routes>
              <Route element={<PublicLayout/>}>
                <Route path='/' element={<LoginPage/>}/>
              </Route>
              <Route element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
                <Route path='/menu' element={<MainPage/>}/>
                <Route path='/profile' element={<ProfilePage/>}/>
                <Route path='/payment' element={<PaymentPage/>}/>
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;