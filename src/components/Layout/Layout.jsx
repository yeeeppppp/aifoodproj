import React from 'react';
import Navigation from './Navigation';
import './Layout.css';

function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}

export default Layout;