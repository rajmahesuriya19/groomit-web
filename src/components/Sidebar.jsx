import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// SVG Icons
import Home from '../assets/icon/home.svg';
import Calendar from '../assets/icon/calendar.svg';
import PawPrint from '../assets/icon/pet-paw.svg';
import Inbox from '../assets/icon/inbox.svg';
import User from '../assets/icon/user.svg';
import LogOut from '../assets/icon/logout.svg';
import HelpCircle from '../assets/icon/info-blue.svg';
import Star from '../assets/icon/star.svg';
import PlayStore from '../assets/images/play-store.svg';
import AppStore from '../assets/images/app-store.svg';
import Instagram from '../assets/social/instagram.svg';
import Youtube from '../assets/social/you-tube.svg';
import Linkedin from '../assets/social/linkdein.svg';
import Twitter from '../assets/social/x.svg';
import Facebook from '../assets/social/fb.svg';

// Reusable Sidebar Item
const SidebarItem = ({ iconImg, label, href, active }) => (
  <Link to={href}>
    <div
      className={`group flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer transition-colors 
        ${active ? 'text-brand' : 'text-primary-dark hover:text-brand'}
      `}
    >
      <img
        src={iconImg}
        alt={`${label} Icon`}
        className="w-6 h-6 transition-all group-hover:brightness-0 group-hover:invert-[27%] group-hover:sepia-[70%] group-hover:saturate-[700%] group-hover:hue-rotate-[330deg]"
      />
      <span className="text-lg font-medium font-inter transition-colors">
        {label}
      </span>
    </div>
  </Link>
);

export default function Sidebar() {
  const location = useLocation();

  const socialIcons = {
    instagram: Instagram,
    youtube: Youtube,
    linkedin: Linkedin,
    x: Twitter,
    facebook: Facebook,
  };

  const mainMenu = [
    { label: 'Dashboard', href: '/user/dashboard', iconImg: Home },
    { label: 'My Pets', href: '/user/pet/list', iconImg: PawPrint },
    { label: 'Appointments', href: '/user/appointments', iconImg: Calendar },
    { label: 'Inbox', href: '/user/inbox', iconImg: Inbox },
    { label: 'My Account', href: '/user/account', iconImg: User },
  ];

  const secondaryMenu = [
    { label: 'Review Us', href: '#/', iconImg: Star },
    { label: 'How It Works', href: '#/', iconImg: HelpCircle },
  ];

  const logoutMenu = [
    { label: 'Logout', href: '#/', iconImg: LogOut },
  ];

  return (
    <div className="hidden md:flex px-6 py-8">
      <div className="w-[265px] bg-white shadow-2xl rounded-3xl flex flex-col justify-between px-4 py-6">

        {/* Menu Section */}
        <div className="flex flex-col space-y-6 w-full">

          {/* Main Menu */}
          <div className="space-y-2">
            {mainMenu.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                active={location.pathname === item.href}
              />
            ))}
          </div>

          {/* Book Appointment */}
          <div>
            <button className="w-full bg-brand text-white py-2 text-sm font-medium rounded-full hover:bg-brand transition">
              Book Appointment
            </button>
          </div>

          {/* Secondary Menu */}
          <div className="space-y-2 border-t pt-4">
            {secondaryMenu.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                active={location.pathname === item.href}
              />
            ))}
          </div>

          {/* Logout */}
          <div className="space-y-2 border-t pt-4">
            {logoutMenu.map((item) => (
              <SidebarItem
                key={item.label}
                {...item}
                active={location.pathname === item.href}
              />
            ))}
          </div>
        </div>

        {/* App Download Section */}
        <div className="mt-6 pt-6 border-t">
          <p className="font-inter font-semibold text-xs text-primary-light tracking-[0.15em] leading-[100%] text-center uppercase mb-3">
            Download the App
          </p>
          <div className="flex justify-center gap-3">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src={PlayStore}
                alt="Google Play"
                className="w-[94px]"
              />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img
                src={AppStore}
                alt="App Store"
                className="w-[94px]"
              />
            </a>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mt-5">
          {Object.entries(socialIcons).map(([key, icon]) => (
            <a href="#" key={key} target="_blank" rel="noopener noreferrer">
              <img
                src={icon}
                alt={key}
                className="h-[25px] w-[25px] opacity-80 hover:opacity-100 transition"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
