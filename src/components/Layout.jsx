import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navigation from './Navigation.jsx';
import Sidebar from './Sidebar.jsx';
import Book from "../assets/icon/knife.svg"
import Header from './Header.jsx';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const showSidebar = location.pathname.startsWith('/user');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {showSidebar ? <Navigation isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} /> : <Header />}
      <div className="flex">
        {showSidebar && <Sidebar />}
        {showSidebar && (
          <button
            className={`fixed bottom-0 right-2 ${isMobileMenuOpen ? 'hidden' : 'flex'} md:flex flex-col items-center justify-center text-white rounded-full z-50 transition-all cursor-pointer`}
            onClick={() => navigate("/book/service-address")}
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
