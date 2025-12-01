import React from 'react';
import Rating from '../assets/icon/fill-star.svg';
import { X, Home, Heart, Calendar, MessageSquare, Settings, Star, Info, LogOut, Download } from 'lucide-react';

const MobileMenuHeader = ({ isOpen, onClose }) => {

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const menuItems = [
    { label: "Service & Pricing", href: "/user/dashboard" },
    { label: "Recurring", href: "/user/pet/list" },
    { label: "Locations", href: "/user/appointments" },
    { label: "Blog", href: "/blog" },
    { label: "My Account", href: "/user/account" },
    { label: "Dashboard", href: "/user/dashboard" },
    { label: "Apply as Groomer", href: "/groomer/apply" },
    { label: "Logout", href: "/logout" },
  ];

  const loggedOutAllowed = [
    "Service & Pricing",
    "Recurring",
    "Locations",
    "Blog",
    "Apply as Groomer",
  ];

  // SHOW WHEN LOGGED IN
  const loggedInAllowed = [
    "Service & Pricing",
    "Recurring",
    "Locations",
    "Blog",
    "My Account",
    "Dashboard",
    "Apply as Groomer",
    "Logout",
  ];

  const filteredMenu = isLoggedIn
    ? menuItems.filter((item) => loggedInAllowed.includes(item.label))
    : menuItems.filter((item) => loggedOutAllowed.includes(item.label));

  // const menuItems = [
  //   { label: 'Dashboard', href: '/user/dashboard', icon: Home },
  //   { label: 'My Pets', href: '/user/pet/list', icon: Heart },
  //   { label: 'Appointments', href: '/user/appointments', icon: Calendar },
  //   { label: 'Inbox', href: '/user/inbox', icon: MessageSquare },
  //   { label: 'My Account', href: '/user/account', icon: Settings },
  //   { label: 'Review Us', href: '#/', icon: Star },
  //   { label: 'How It Works', href: '#/', icon: Info },
  //   { label: 'Logout', href: '#/', icon: LogOut },
  // ];

  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/groomitapp/', emoji: '📘' },
    { name: 'Instagram', href: 'https://www.instagram.com/groomitapp/', emoji: '📷' },
    { name: 'YouTube', href: 'https://www.youtube.com/@groomitapp', emoji: '🎥' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/groomit-llc/', emoji: '💼' },
    { name: 'Twitter', href: 'https://x.com/groomitapp', emoji: '🐦' },
  ];

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
              className="h-10 w-40"
              src="https://raj.dev.groomit.me/v7/images/home/groomit-logo.svg"
              alt="Groomit.me"
            />

            <div className='flex items-center gap-4'>
              <div class="md:hidden items-center flex gap-1 w-100">
                <img src={Rating} className="w-5 h-5" alt="Star" />
                <a href="https://raj.dev.groomit.me/reviews">
                  <div class="font-inter text-sm font-bold underline">
                    4.9 (147)
                  </div>
                </a>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto">

            {/* Menu Items */}
            <div className="space-y-1">
              <div className='flex items-center justify-between px-4 py-3 w-full'>
                <div className='font-bold font-inter text-base'>
                  In-Home & Mobile <br /> Pet Grooming
                </div>
                <button className="w-[120px] bg-black h-10 flex items-center justify-center text-white font-normal rounded-[10px] text-base">
                  Book Now
                </button>
              </div>

              {filteredMenu.map((item, index) => (
                <div key={index} className="px-4 space-x-3">
                  <a
                    href={item.href}
                    className="flex items-center pb-3"
                    onClick={onClose}
                  >
                    <span className="font-inter font-medium text-base">
                      {item.label}
                    </span>
                  </a>
                </div>
              ))}

              {!isLoggedIn && (
                <div className="px-4 pb-4 space-y-3">
                  <a
                    href="/login"
                    className="font-inter font-medium text-base block"
                    onClick={onClose}
                  >
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="font-inter font-medium text-base block"
                    onClick={onClose}
                  >
                    Sign Up
                  </a>
                </div>
              )}
            </div>

            {/* Book Appointment Button */}
            {/* <div className="p-4">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                Book Appointment
              </button>
            </div> */}

            {/* Download App Section */}
            {/* <div className="p-4 border-t border-gray-200">
              <p className="text-center text-gray-600 mb-4 font-medium">
                Download the app
              </p>
              <div className="flex space-x-3">
                <a href="/download-groomit-app" className="flex-1">
                  <div className="bg-black text-white rounded-lg p-3 text-center hover:bg-gray-800 transition-colors">
                    <Download size={20} className="mx-auto mb-1" />
                    <span className="text-xs font-medium">App Store</span>
                  </div>
                </a>
                <a href="/download-groomit-app" className="flex-1">
                  <div className="bg-green-600 text-white rounded-lg p-3 text-center hover:bg-green-700 transition-colors">
                    <Download size={20} className="mx-auto mb-1" />
                    <span className="text-xs font-medium">Play Store</span>
                  </div>
                </a>
              </div>
            </div> */}

            {/* Help and Social Section */}
            {/* <div className="p-4 border-t border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">
                    Need Help?
                  </p>
                  <a
                    href="mailto:help@groomit.me"
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    help@groomit.me
                  </a>
                </div>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl hover:scale-110 transition-transform"
                      title={social.name}
                    >
                      {social.emoji}
                    </a>
                  ))}
                </div>
              </div>
            </div> */}
          </div>

          {/* Footer */}
          {/* <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center text-xs text-gray-500 space-y-2">
              <div className="flex justify-center space-x-4">
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Privacy Policy
                </a>
                <span>|</span>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Cookies Policy
                </a>
              </div>
              <div className="flex justify-center space-x-4">
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Acceptable Use Policy
                </a>
                <span>|</span>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Accessibility
                </a>
              </div>
              <p className="pt-2 font-medium">
                ©2025 Groomit, Inc. All rights reserved.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MobileMenuHeader;
