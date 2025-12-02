import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AddressSelector from './AddressSelector.jsx';
import UserDropdown from './UserDropdown.jsx';
import MobileMenu from './MobileMenu.jsx';
import info from '../assets/icon/help-circle-black.svg';
import Rating from '../assets/icon/fill-star.svg';
import { useSelector } from 'react-redux';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { dashboard } = useSelector((state) => state.dashboard);
  const { user } = dashboard;
  const showRating = location.pathname.startsWith('/user');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className={` bg-white shadow-sm border-b border-[#BEC3C5] ${!showRating && 'sticky top-0 z-50'}`}>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <div className="flex-shrink-0 hidden md:block">
              <Link to="/" className="flex items-center">
                <img
                  className="h-12 w-40"
                  src="https://raj.dev.groomit.me/v7/images/web_logo.svg"
                  alt="Groomit.me"
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            {/* Logo */}
            <div className="flex-shrink-0 md:hidden block">
              {!showRating ? <Link to="/" className="flex items-center">
                <img
                  className="h-10 w-40"
                  src="https://raj.dev.groomit.me/v7/images/web_logo.svg"
                  alt="Groomit.me"
                />
              </Link> : location.pathname === "/user/groomers" ? <div>
                <div className="font-filson font-bold text-xl text-primary-dark">My Groomers</div>
              </div> :
                <div className="w-full">
                  <div className="flex items-center gap-2">
                    <img src="https://groomit-demo.s3.amazonaws.com/images/user_profile_photo/83.png" alt="User" />
                    <div>
                      <div className="font-inter font-bold text-base text-primary-dark">{`Hi, ${user?.first_name}`}</div>
                      <div className="font-inter font-normal text-xs text-primary-dark">Ready to pamper your pets?</div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div className='flex items-center gap-4'>
              {!showRating && <div className="md:hidden items-center flex gap-1 w-100">
                <img src={Rating} className="w-5 h-5" alt="Star" />
                <a href="https://raj.dev.groomit.me/reviews">
                  <div className="font-inter text-sm font-bold underline">
                    4.9 (147)
                  </div>
                </a>
              </div>}
              <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-1 rounded-[10px] border border-[#8A8D8E] text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  {isMobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>
              </div>
            </div>


            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between ml-8 min-w-0">
              {/* Right Side Items */}
              <div className="flex flex-wrap items-center gap-2 min-w-0">

                {/* Credits Display */}
                <div className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-primary-dark px-3 py-2">
                  <p className="text-xs font-medium text-white leading-none font-inter tracking-normal">
                    CREDITS
                  </p>
                  <p className="text-base font-extrabold text-white leading-none font-inter tracking-[-0.01em]">
                    ${user?.available_credit}.00
                  </p>
                </div>

                {/* User Dropdown */}
                <UserDropdown />

                {/* Help Link */}
                <Link
                  to="/help"
                  className="flex items-center px-[12px] py-[10px] rounded-[10px] border border-[#7C868A80] transition-colors hover:text-red-600 group"
                >
                  <img
                    src={info}
                    alt="Help Icon"
                    className="w-[24px] h-[24px]"
                  />
                  <span className="text-sm font-semibold text-primary-dark leading-none tracking-[-0.01em]  font-inter px-2 py-0.5 rounded-sm">
                    Need Help?
                  </span>
                </Link>
              </div>
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
