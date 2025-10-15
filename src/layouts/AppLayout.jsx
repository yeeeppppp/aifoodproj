import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation/Navigation';

export default function AppLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}


