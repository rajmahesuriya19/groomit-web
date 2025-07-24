import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation.jsx';
import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith('/user');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
