import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import { CartProvider } from './components/Carousel/CartContext';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation/Navigation';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div>
            <Routes>
              <Route path='/' element={<LoginPage/>}/>
              <Route path='/menu' element={
                <ProtectedRoute>
                  <MainPage/>
                </ProtectedRoute>
              }/>
              <Route path='/profile' element={
                <ProtectedRoute>
                  <Navigation/>
                  <ProfilePage/>
                </ProtectedRoute>
              }/>
              <Route path='/payment' element={
                <ProtectedRoute>
                  <PaymentPage/>
                </ProtectedRoute>
              }/>
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;