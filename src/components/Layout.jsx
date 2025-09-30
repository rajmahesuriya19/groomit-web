import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation.jsx';
import Sidebar from './Sidebar.jsx';
import Book from "../assets/icon/knife.svg"

const Layout = ({ children }) => {
  const location = useLocation();
  const showSidebar = location.pathname.startsWith('/user');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex">
        {showSidebar && <Sidebar />}
        {showSidebar && (
          <button
            className="fixed bottom-0 right-2 flex flex-col items-center justify-center text-white rounded-full z-50 transition-all"
          >
            <img src={Book} alt="knife" className="mb-1" />
            <span className="text-xs font-bold font-inter">Book</span>
          </button>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
