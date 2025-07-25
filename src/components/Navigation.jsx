import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AddressSelector from './AddressSelector.jsx';
import UserDropdown from './UserDropdown.jsx';
import MobileMenu from './MobileMenu.jsx';
import info from '../assets/icon/info-circle.svg';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  className="h-12 w-auto"
                  src="https://dev.groomit.me/v7/images/web_logo.svg"
                  alt="Groomit.me"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between flex-1 ml-8 min-w-0">

              {/* Address Selector */}
              <div className="flex-1 max-w-md min-w-0">
                <AddressSelector />
              </div>

              {/* Right Side Items */}
              <div className="flex flex-wrap items-center gap-4 min-w-0 ml-4">

                {/* Credits Display */}
                <div className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-[#FF314A] px-3 py-2">
                  <p className="text-[12px] font-medium text-white leading-none font-inter tracking-normal">
                    CREDITS
                  </p>
                  <p className="text-[16px] font-extrabold text-white leading-none font-inter tracking-[-0.01em]">
                    $518
                  </p>
                </div>

                {/* User Dropdown */}
                <UserDropdown />

                {/* Divider */}
                <div className="h-6 w-px bg-black" />

                {/* Help Link */}
                <Link
                  to="/help"
                  className="flex items-center gap-[5px] px-[12px] py-[10px] rounded-full border border-[#7C868A80] transition-colors hover:text-red-600 group"
                >
                  <img
                    src={info}
                    alt="Help Icon"
                    className="w-[24px] h-[24px]"
                  />
                  <span className="text-[14px] font-semibold text-[#2E2E2E] leading-none tracking-[-0.01em]  font-inter px-2 py-0.5 rounded-sm">
                    Need Help?
                  </span>
                </Link>
              </div>
            </div>

            {/* Mobile User Dropdown */}
            <div className="md:hidden">
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Navigation;
