import React from 'react';
import { X } from 'lucide-react';

// ICONS
import PlayStore from "../assets/menu-new/play-store.svg";
import AppStore from "../assets/menu-new/app-store.svg";
import HomeIcon from "../assets/menu-new/home.svg";
import HomeRed from "../assets/menu-new/home-a.svg";

import Calendar from "../assets/menu-new/calendar.svg";
import CalendarRed from "../assets/menu-new/calendar-a.svg";

import Scissor from "../assets/menu-new/scissor.svg";
import ScissorRed from "../assets/menu-new/scissor-a.svg";

import Message from "../assets/menu-new/message.svg";
import MessageRed from "../assets/menu-new/message-a.svg";

import User from "../assets/menu-new/user.svg";
import UserRed from "../assets/icon/user.svg";

import HelpCircle from "../assets/icon/help-circle-black.svg";
import RedHelpCircle from "../assets/icon/info-circle.svg";

import Star from "../assets/icon/star-gray.svg";
import RedStar from "../assets/icon/red-star.svg";

import Logout from "../assets/icon/logout.svg";
import LogoutRed from "../assets/icon/logout.svg";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { logoutUser } from '@/utils/store/slices/auth/authSlice';
import { toast } from 'react-toastify';

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showLoader, hideLoader } = useLoader();
  const currentPath = location.pathname;

  const menuItems = [
    { label: 'Home', href: '/user/dashboard', icon: HomeIcon, iconRed: HomeRed },
    { label: 'Appointments', href: '/user/appointments', icon: Calendar, iconRed: CalendarRed },
    { label: 'Groomers', href: '/user/groomers', icon: Scissor, iconRed: ScissorRed },
    { label: 'Inbox', href: '/user/inbox', icon: Message, iconRed: MessageRed },
    { label: 'My Account', href: '/user/account', icon: User, iconRed: UserRed },
  ];

  const secondMenu = [
    { label: "Review Us", href: "https://g.page/r/CcYk6tuuu6NhEB0/review", icon: Star, activeIcon: RedStar },
    { label: "How It Works", href: "https://www.groomit.me/how-it-works", icon: HelpCircle, activeIcon: RedHelpCircle },
  ];

  const handleLogout = async () => {
    showLoader();
    try {
      await dispatch(logoutUser()).unwrap();
      onClose();
      toast.success("Logout successful 🎉");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      hideLoader();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 left-0 w-full bg-white shadow-xl transform transition-transform">
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <img
              className="h-auto w-[160px]"
              src="https://groomit.me/v7/images/web_logo.svg"
              alt="Groomit.me"
            />
            <button
              onClick={onClose}
              className="border border-[#DEE2E6] p-1 rounded-md text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">

            {/* Main Menu */}
            <div className="space-y-1">
              {menuItems.map((item, index) => {
                const isActive = currentPath === item.href;

                return (
                  <Link
                    key={index}
                    to={item.href}
                    onClick={onClose}
                    className={`group flex items-center gap-3 px-4 py-2 transition-colors`}
                  >
                    <img
                      src={isActive ? item.iconRed : item.icon}
                      className="w-6 h-6 group-hover:hidden"
                      alt=""
                    />
                    <img
                      src={item.iconRed}
                      className="w-6 h-6 hidden group-hover:block"
                      alt=""
                    />

                    <span
                      className={`font-bold font-inter text-sm ${isActive
                        ? "text-brand"
                        : "text-primary-dark group-hover:text-brand"
                        }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            <hr className="my-2 border-gray-100" />

            {/* Second Menu */}
            <div className="space-y-1">
              {secondMenu.map((item, index) => (
                <a
                  key={index}
                  target="_blank"
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center gap-3 px-4 py-2 transition-colors"
                >
                  <img src={item.icon} className="w-6 h-6 group-hover:hidden" alt="" />
                  <img src={item.iconRed} className="w-6 h-6 hidden group-hover:block" alt="" />

                  <span className="font-bold font-inter text-sm group-hover:text-brand">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>

            <hr className="my-2 border-gray-100" />

            {/* Download Section */}
            <div className="px-4 py-2">
              <p className="font-normal mb-2 text-gray-600 text-xs">
                Download the app
              </p>
              <div className="flex gap-1">
                <a href="https://www.groomit.me/download-groomit-app" target="_blank" rel="noopener noreferrer">
                  <img src={PlayStore} alt="Google Play" className="h-[36px]" />
                </a>
                <a href="https://www.groomit.me/download-groomit-app" target="_blank" rel="noopener noreferrer">
                  <img src={AppStore} alt="App Store" className="h-[36px]" />
                </a>
              </div>
            </div>

            <hr className="my-2 border-gray-100" />

            {/* Logout */}
            <div
              className="group flex items-center gap-3 px-4 py-2 transition-colors"
              onClick={handleLogout}
            >
              <img src={Logout} className="w-6 h-6 group-hover:hidden" alt="" />
              <img src={LogoutRed} className="w-6 h-6 hidden group-hover:block" alt="" />

              <span className="font-bold font-inter text-sm group-hover:text-brand">
                Logout
              </span>
            </div>

            <div className="pb-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
