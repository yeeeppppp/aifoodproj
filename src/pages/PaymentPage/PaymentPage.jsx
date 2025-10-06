import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation/Navigation';
import { useCart } from '../../components/Carousel/CartContext';
import './PaymentPage.css';

function PaymentPage() {
  const navigate = useNavigate();
  const { cart, setCart, addOrder } = useCart();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [deliveryData, setDeliveryData] = useState({
    address: '',
    apartment: '',
    intercom: '',
    entrance: '',
    floor: '',
    comment: ''
  });

  const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = totalCost > 0 ? totalCost : 570; // покажем сумму как на макете, если корзина пустая

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeliveryChange = (field, value) => {
    setDeliveryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrder(finalTotal);
    setCart([]);
    navigate('/profile');
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  return (
    <>
      <Helmet>
        <title>FOODAI - Оплата и доставка</title>
      </Helmet>
      <Navigation />
      <div className="payment-page">
        <div className="payment-two-col">
          <form className="card card-left" onSubmit={handleSubmit}>
            <h2 className="section-title">Условия доставки</h2>
            <div className="address-row">
              <div className="address-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3.172l8 6.4V20a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4H10v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.572l8-6.4zm0-2.172a1 1 0 0 0-.62.214l-9 7.2A1 1 0 0 0 2 9.2V20a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3v-3h2v3a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V9.2a1 1 0 0 0-.38-.786l-9-7.2A1 1 0 0 0 12 1z"/>
                </svg>
              </div>
              <input
                type="text"
                className="address-input"
                placeholder="г. Чебоксары, Ленина 31"
                value={deliveryData.address}
                onChange={(e) => handleDeliveryChange('address', e.target.value)}
              />
            </div>
            <div className="pill-grid">
              <input
                type="text"
                className="pill-input"
                placeholder="Кв/офис"
                value={deliveryData.apartment}
                onChange={(e) => handleDeliveryChange('apartment', e.target.value)}
              />
              <input
                type="text"
                className="pill-input"
                placeholder="Домофон"
                value={deliveryData.intercom}
                onChange={(e) => handleDeliveryChange('intercom', e.target.value)}
              />
              <input
                type="text"
                className="pill-input"
                placeholder="Подъезд"
                value={deliveryData.entrance}
                onChange={(e) => handleDeliveryChange('entrance', e.target.value)}
              />
              <input
                type="text"
                className="pill-input"
                placeholder="Этаж"
                value={deliveryData.floor}
                onChange={(e) => handleDeliveryChange('floor', e.target.value)}
              />
            </div>
            <textarea
              className="comment-textarea"
              placeholder="Комментарий курьеру"
              rows="3"
              value={deliveryData.comment}
              onChange={(e) => handleDeliveryChange('comment', e.target.value)}
            />
          </form>

          <form className="card card-right" onSubmit={handleSubmit}>
            <h2 className="section-title">Оплата</h2>
            <input
              type="text"
              className="wide-input card-number"
              placeholder="Номер карты"
              maxLength="19"
              value={paymentData.cardNumber}
              onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
              required
            />
            <div className="two-inputs">
              <input
                type="text"
                className="wide-input"
                placeholder="DD/MM"
                maxLength="5"
                value={paymentData.expiryDate}
                onChange={(e) => handlePaymentChange('expiryDate', formatExpiryDate(e.target.value))}
                required
              />
              <input
                type="text"
                className="wide-input"
                placeholder="CVC/CVV"
                maxLength="3"
                value={paymentData.cvv}
                onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
                required
              />
            </div>
            <button type="submit" className="order-button">
              <span>Заказать</span>
              <span className="order-amount">{finalTotal}₽</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;
