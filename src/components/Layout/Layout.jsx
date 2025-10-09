import React from 'react';
import Navigation from '../Navigation/Navigation';
import './Layout.css'; // Новый файл для стилей (опционально)

function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}

export default Layout;