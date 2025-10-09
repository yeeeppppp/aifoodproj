import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import supabase from './supabaseClient';
import './LoginPage.css';
import bcrypt from 'bcryptjs';
import { useAuth } from '../../components/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginPage() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    email: '',
    name: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 5000);
    return () => clearTimeout(timer);
  }, [errorMessage, successMessage]);

  const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log('Попытка входа с email:', loginData.email);
    const success = await login(loginData.email, loginData.password);
    console.log('Ответ от AuthContext:', success);
    if (success) {
      console.log('Успешный вход');
      const { from } = location.state || { from: { pathname: '/menu' } };
      navigate(from.pathname);
    } else {
      setErrorMessage('Неверный пароль или пользователь неактивен');
    }
  } catch (error) {
    console.error('Общая ошибка:', error);
    setErrorMessage('Общая ошибка: ' + error.message);
  }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setErrorMessage('Введите корректный email');
      return;
    }
    if (registerData.password.length < 6) {
      setErrorMessage('Пароль должен быть не короче 6 символов');
      return;
    }
    if (!registerData.name.trim()) {
      setErrorMessage('Введите ваше имя');
      return;
    }

    try {
      const hashedPassword = await hashPassword(registerData.password);
      const { data, error } = await supabase.from('users').insert({
        email: registerData.email,
        password: hashedPassword,
        name: registerData.name,
        created_at: new Date().toISOString(),
        is_active: true,
      });
      if (error) {
        console.error('Ошибка регистрации:', error);
        setErrorMessage('Ошибка регистрации: ' + error.message);
      } else {
        console.log('Успешная регистрация:', data);
        setSuccessMessage(' ');
        setRegisterData({ email: '', name: '', password: '' });
      }
    } catch (error) {
      console.error('Общая ошибка:', error);
      setErrorMessage('Общая ошибка: ' + error.message);
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

return (
    <>
      <Helmet>
        <title>FOODAI</title>
      </Helmet>
      <div className="login-page">
        <div className="login-container">
          {errorMessage && <p className="error">{errorMessage}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <div className="logo">
            <svg width="141" height="20" viewBox="0 0 141 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0.346292H19.9613V4.84809H6.95058V7.14846H19.6892V11.675H6.95058V18.7492H0V0.346292Z" fill="white" />
              <path d="M34.8184 0H35.9315C37.564 0 39.0481 0.115431 40.3838 0.346292C41.736 0.560663 42.8656 0.84924 43.7725 1.21202C44.696 1.55831 45.4957 1.9953 46.1718 2.52298C46.8644 3.03418 47.4086 3.55362 47.8043 4.0813C48.2001 4.60898 48.5134 5.18614 48.7443 5.81276C48.9916 6.43938 49.1483 7.00829 49.2142 7.51948C49.2967 8.03068 49.3379 8.56661 49.3379 9.12727V9.86932C49.3379 10.43 49.2967 10.9659 49.2142 11.4771C49.1483 11.9883 48.9916 12.5655 48.7443 13.2086C48.5134 13.8352 48.2001 14.4206 47.8043 14.9648C47.4251 15.4924 46.8891 16.0201 46.1966 16.5478C45.504 17.0755 44.7042 17.5207 43.7972 17.8835C42.8903 18.2463 41.7607 18.5349 40.4085 18.7492C39.0728 18.9801 37.5805 19.0955 35.9315 19.0955H34.8184C33.1694 19.0955 31.6688 18.9801 30.3166 18.7492C28.9809 18.5349 27.8513 18.2463 26.9279 17.8835C26.0209 17.5207 25.2212 17.0755 24.5286 16.5478C23.836 16.0201 23.2918 15.4924 22.896 14.9648C22.5168 14.4206 22.2035 13.8352 21.9561 13.2086C21.7253 12.5655 21.5686 11.9883 21.4861 11.4771C21.4202 10.9659 21.3872 10.43 21.3872 9.86932V9.12727C21.3872 8.56661 21.4202 8.03068 21.4861 7.51948C21.5686 7.00829 21.7253 6.43938 21.9561 5.81276C22.2035 5.18614 22.5168 4.60898 22.896 4.0813C23.2918 3.55362 23.836 3.03418 24.5286 2.52298C25.2212 1.9953 26.0209 1.55831 26.9279 1.21202C27.8513 0.84924 28.9809 0.560663 30.3166 0.346292C31.6688 0.115431 33.1694 0 34.8184 0ZM42.0658 9.64671V9.30042C42.0658 8.75624 41.9669 8.25329 41.769 7.79157C41.5711 7.31336 41.233 6.85164 40.7548 6.4064C40.2931 5.96117 39.6005 5.60663 38.6771 5.34279C37.7536 5.07895 36.6488 4.94703 35.3626 4.94703C34.0434 4.94703 32.922 5.07895 31.9986 5.34279C31.0751 5.60663 30.3826 5.96117 29.9208 6.4064C29.4591 6.85164 29.1293 7.31336 28.9314 7.79157C28.75 8.25329 28.6593 8.75624 28.6593 9.30042V9.59724C28.6593 10.1414 28.7583 10.6608 28.9562 11.1556C29.154 11.6338 29.4838 12.112 29.9456 12.5902C30.4073 13.0519 31.0999 13.4229 32.0233 13.7033C32.9633 13.9836 34.0763 14.1238 35.3626 14.1238C36.6488 14.1238 37.7536 13.9918 38.6771 13.728C39.617 13.4477 40.3178 13.0766 40.7796 12.6149C41.2413 12.1532 41.5711 11.6832 41.769 11.205C41.9669 10.7103 42.0658 10.1909 42.0658 9.64671Z" fill="white" />
              <path d="M63.9015 0H65.0146C66.6471 0 68.1312 0.115431 69.4669 0.346292C70.8191 0.560663 71.9487 0.84924 72.8556 1.21202C73.7791 1.55831 74.5789 1.9953 75.255 2.52298C75.9475 3.03418 76.4917 3.55362 76.8875 4.0813C77.2832 4.60898 77.5965 5.18614 77.8274 5.81276C78.0748 6.43938 78.2314 7.00829 78.2974 7.51948C78.3798 8.03068 78.421 8.56661 78.421 9.12727V9.86932C78.421 10.43 78.3798 10.9659 78.2974 11.4771C78.2314 11.9883 78.0748 12.5655 77.8274 13.2086C77.5965 13.8352 77.2832 14.4206 76.8875 14.9648C76.5082 15.4924 75.9723 16.0201 75.2797 16.5478C74.5871 17.0755 73.7873 17.5207 72.8804 17.8835C71.9734 18.2463 70.8438 18.5349 69.4917 18.7492C68.156 18.9801 66.6636 19.0955 65.0146 19.0955H63.9015C62.2525 19.0955 60.7519 18.9801 59.3997 18.7492C58.064 18.5349 56.9344 18.2463 56.011 17.8835C55.104 17.5207 54.3043 17.0755 53.6117 16.5478C52.9191 16.0201 52.3749 15.4924 51.9792 14.9648C51.5999 14.4206 51.2866 13.8352 51.0392 13.2086C50.8084 12.5655 50.6517 11.9883 50.5693 11.4771C50.5033 10.9659 50.4703 10.43 50.4703 9.86932V9.12727C50.4703 8.56661 50.5033 8.03068 50.5693 7.51948C50.6517 7.00829 50.8084 6.43938 51.0392 5.81276C51.2866 5.18614 51.5999 4.60898 51.9792 4.0813C52.3749 3.55362 52.9191 3.03418 53.6117 2.52298C54.3043 1.9953 55.104 1.55831 56.011 1.21202C56.9344 0.84924 58.064 0.560663 59.3997 0.346292C60.7519 0.115431 62.2525 0 63.9015 0ZM71.1489 9.64671V9.30042C71.1489 8.75624 71.05 8.25329 70.8521 7.79157C70.6542 7.31336 70.3162 6.85164 69.838 6.4064C69.3762 5.96117 68.6836 5.60663 67.7602 5.34279C66.8368 5.07895 65.7319 4.94703 64.4457 4.94703C63.1265 4.94703 62.0052 5.07895 61.0817 5.34279C60.1583 5.60663 59.4657 5.96117 59.004 6.4064C58.5422 6.85164 58.2124 7.31336 58.0145 7.79157C57.8332 8.25329 57.7425 8.75624 57.7425 9.30042V9.59724C57.7425 10.1414 57.8414 10.6608 58.0393 11.1556C58.2372 11.6338 58.567 12.112 59.0287 12.5902C59.4904 13.0519 60.183 13.4229 61.1064 13.7033C62.0464 13.9836 63.1595 14.1238 64.4457 14.1238C65.7319 14.1238 66.8368 13.9918 67.7602 13.728C68.7001 13.4477 69.401 13.0766 69.8627 12.6149C70.3244 12.1532 70.6542 11.6832 70.8521 11.205C71.05 10.7103 71.1489 10.1909 71.1489 9.64671Z" fill="white" />
              <path d="M80.1718 18.7492V0.346292H93.232C95.2768 0.346292 97.0907 0.511193 98.6737 0.840994C100.257 1.1708 101.535 1.60778 102.508 2.15196C103.481 2.69613 104.272 3.35574 104.882 4.13077C105.509 4.9058 105.938 5.68908 106.168 6.48061C106.399 7.27213 106.515 8.12962 106.515 9.05306V9.79512C106.515 10.7021 106.408 11.5513 106.193 12.3428C105.995 13.1344 105.591 13.9341 104.981 14.7421C104.388 15.5502 103.613 16.2427 102.656 16.8199C101.716 17.3806 100.438 17.8423 98.8221 18.2051C97.2226 18.5679 95.3675 18.7492 93.2567 18.7492H80.1718ZM87.1966 5.16965V13.8764H92.4157C96.9505 13.8764 99.2179 12.4418 99.2179 9.5725V9.42409C99.2179 6.58779 96.9505 5.16965 92.4157 5.16965H87.1966Z" fill="white" />
              <path d="M121.81 11.1803L118.718 4.84809L115.7 11.1803H121.81ZM125.496 18.7492L124.061 15.781H113.548L112.139 18.7492H105.015L114.117 0.346292H123.566L133.188 18.7492H125.496Z" fill="white" />
              <path d="M140.99 0.346292V18.7492H133.99V0.346292H140.99Z" fill="white" />
              <path d="M36.8127 13.2492C36.8127 12.4208 37.4843 11.7492 38.3127 11.7492H39.3127C40.1411 11.7492 40.8127 12.4208 40.8127 13.2492C40.8127 14.0777 40.1411 14.7492 39.3127 14.7492H38.3127C37.4843 14.7492 36.8127 14.0777 36.8127 13.2492Z" fill="white" />
              <path d="M65.8127 13.2492C65.8127 12.4208 66.4843 11.7492 67.3127 11.7492H68.3127C69.1411 11.7492 69.8127 12.4208 69.8127 13.2492C69.8127 14.0777 69.1411 14.7492 68.3127 14.7492H67.3127C66.4843 14.7492 65.8127 14.0777 65.8127 13.2492Z" fill="white" />
            </svg>
          </div>
          
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="input-field"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={loginData.password}
              onChange={handleLoginChange}
              className="input-field"
              required
            />
            <button type="submit" className="login-btn">
              Войти
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">Или</span>
          </div>

          <form className="register-form" onSubmit={handleRegisterSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={handleRegisterChange}
              className="input-field"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Ваше имя"
              value={registerData.name}
              onChange={handleRegisterChange}
              className="input-field"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={registerData.password}
              onChange={handleRegisterChange}
              className="input-field"
              required
            />
            <button type="submit" className="register-btn">
              Зарегистрироваться
            </button>
          </form>
        </div>
        {successMessage && (
            <div className="success-not-reg">
              <p className="success-text-reg">Вы зарегистрировались!</p>
            </div>
          )}
      </div>
    </>
  );
}

export default LoginPage;