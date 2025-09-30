import { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { CartContext } from '../../components/Carousel/CartContext';
import './PaymentPage.css';

function PaymentPage() {
  const { cart } = useContext(CartContext);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });

  const [deliveryData, setDeliveryData] = useState({
    address: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    deliveryDate: '',
    deliveryTime: '',
    comment: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryMethod, setDeliveryMethod] = useState('courier');

  const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCost = deliveryMethod === 'courier' ? 200 : 0;
  const finalTotal = totalCost + deliveryCost;

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
    console.log('Payment data:', paymentData);
    console.log('Delivery data:', deliveryData);
    console.log('Payment method:', paymentMethod);
    console.log('Delivery method:', deliveryMethod);
    // Здесь будет логика обработки заказа
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
      <div className="payment-page">
        <div className="payment-container">
          <div className="payment-header">
            <h1 className="payment-title">Оплата и доставка</h1>
            <div className="order-summary">
              <div className="summary-item">
                <span>Товары ({cart.length} шт.)</span>
                <span>{totalCost}₽</span>
              </div>
              <div className="summary-item">
                <span>Доставка</span>
                <span>{deliveryCost}₽</span>
              </div>
              <div className="summary-total">
                <span>Итого</span>
                <span>{finalTotal}₽</span>
              </div>
            </div>
          </div>

          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="section-title">Способ оплаты</h2>
              <div className="payment-methods">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-label">Банковская карта</span>
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-label">Наличными при получении</span>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="form-group">
                    <label className="form-label">Номер карты</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength="19"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Срок действия</label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => handlePaymentChange('expiryDate', formatExpiryDate(e.target.value))}
                        placeholder="ММ/ГГ"
                        maxLength="5"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
                        placeholder="000"
                        maxLength="3"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Имя держателя карты</label>
                    <input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                      placeholder="IVAN IVANOV"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
              <h2 className="section-title">Контактная информация</h2>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    value={paymentData.email}
                    onChange={(e) => handlePaymentChange('email', e.target.value)}
                    placeholder="example@email.com"
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Телефон</label>
                  <input
                    type="tel"
                    value={paymentData.phone}
                    onChange={(e) => handlePaymentChange('phone', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Способ доставки</h2>
              <div className="delivery-methods">
                <label className="delivery-method">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="courier"
                    checked={deliveryMethod === 'courier'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                  <div className="method-info">
                    <span className="method-label">Курьерская доставка</span>
                    <span className="method-price">200₽</span>
                  </div>
                </label>
                <label className="delivery-method">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="pickup"
                    checked={deliveryMethod === 'pickup'}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                  />
                  <div className="method-info">
                    <span className="method-label">Самовывоз</span>
                    <span className="method-price">Бесплатно</span>
                  </div>
                </label>
              </div>

              {deliveryMethod === 'courier' && (
                <div className="delivery-details">
                  <div className="form-group">
                    <label className="form-label">Адрес доставки</label>
                    <input
                      type="text"
                      value={deliveryData.address}
                      onChange={(e) => handleDeliveryChange('address', e.target.value)}
                      placeholder="ул. Примерная, д. 1"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Квартира</label>
                      <input
                        type="text"
                        value={deliveryData.apartment}
                        onChange={(e) => handleDeliveryChange('apartment', e.target.value)}
                        placeholder="1"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Подъезд</label>
                      <input
                        type="text"
                        value={deliveryData.entrance}
                        onChange={(e) => handleDeliveryChange('entrance', e.target.value)}
                        placeholder="1"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Этаж</label>
                      <input
                        type="text"
                        value={deliveryData.floor}
                        onChange={(e) => handleDeliveryChange('floor', e.target.value)}
                        placeholder="1"
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Домофон</label>
                    <input
                      type="text"
                      value={deliveryData.intercom}
                      onChange={(e) => handleDeliveryChange('intercom', e.target.value)}
                      placeholder="1234"
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Дата доставки</label>
                      <input
                        type="date"
                        value={deliveryData.deliveryDate}
                        onChange={(e) => handleDeliveryChange('deliveryDate', e.target.value)}
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Время доставки</label>
                      <select
                        value={deliveryData.deliveryTime}
                        onChange={(e) => handleDeliveryChange('deliveryTime', e.target.value)}
                        className="form-select"
                        required
                      >
                        <option value="">Выберите время</option>
                        <option value="09:00-12:00">09:00-12:00</option>
                        <option value="12:00-15:00">12:00-15:00</option>
                        <option value="15:00-18:00">15:00-18:00</option>
                        <option value="18:00-21:00">18:00-21:00</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Комментарий к заказу</label>
                    <textarea
                      value={deliveryData.comment}
                      onChange={(e) => handleDeliveryChange('comment', e.target.value)}
                      placeholder="Дополнительные пожелания..."
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                </div>
              )}

              {deliveryMethod === 'pickup' && (
                <div className="pickup-info">
                  <div className="pickup-address">
                    <h3>Адрес пункта самовывоза</h3>
                    <p>ул. Примерная, д. 1, офис 101</p>
                    <p>Пн-Пт: 09:00-21:00, Сб-Вс: 10:00-20:00</p>
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
              <h2 className="section-title">Условия доставки</h2>
              <div className="delivery-terms">
                <div className="term-item">
                  <h4>Минимальная сумма заказа</h4>
                  <p>Бесплатная доставка при заказе от 2000₽</p>
                </div>
                <div className="term-item">
                  <h4>Время доставки</h4>
                  <p>Доставка в течение 1-2 часов в пределах города</p>
                </div>
                <div className="term-item">
                  <h4>Оплата</h4>
                  <p>Оплата картой онлайн или наличными курьеру</p>
                </div>
                <div className="term-item">
                  <h4>Возврат</h4>
                  <p>Возврат товара в течение 7 дней при сохранении упаковки</p>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Оформить заказ за {finalTotal}₽
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;
