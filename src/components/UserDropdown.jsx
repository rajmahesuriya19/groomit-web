import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import notificationIcon from '../assets/icon/notification.svg';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/utils/store/slices/auth/authSlice';
import { toast } from 'react-toastify';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { persistor } from '@/utils/store';

const UserDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { dashboard } = useSelector((state) => state.dashboard);
  const { user } = dashboard;

  const handleLogout = async () => {
    showLoader();
    try {
      await dispatch(logoutUser()).unwrap();

      localStorage.clear();
      sessionStorage.clear();
      persistor.purge();

      hideLoader();
      navigate('/');
      toast.success('Logout successful 🎉');
    } catch (error) {
      console.error('Logout failed:', error.message);
      hideLoader();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { label: 'My Account', href: '/user/account' },
    { label: 'Dashboard', href: '/user/dashboard' },
    { label: 'Log Out', onClick: handleLogout },
  ];

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      <div
        className={`
          flex items-center justify-between bg-white
          rounded-full px-3 py-2 gap-2
          transition-all duration-150
        `}
        style={{
          width: '103px', height: '48px', border: '5px solid #FFFFFF',
          boxShadow: '0px 5px 60px 0px #00000033',
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Notification Icon */}
        <div
          className="flex items-center justify-center relative"
        >
          <img
            src={notificationIcon}
            alt="Notification"
            width={26}
            height={26}
          />
          {/* Red dot */}
          {/* <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" /> */}
        </div>

        {/* Divider */}
        <div
          className="bg-primary-light opacity-30"
          style={{
            width: '1px',
            height: '19px',
          }}
        />

        {/* User Avatar */}
        <div
          className="flex items-center justify-center rounded-full overflow-hidden"
          style={{ width: '28px', height: '28px' }}
        >
          {user?.photo ? <img
            src={user?.photo}
            alt={user.name}
            className="object-cover w-full h-full"
          /> : <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="User Avatar"
            className="object-cover w-full h-full"
          />}
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {menuItems.map((item, index) => (
            <div key={item.label}>
              {item.onClick ? (
                <button
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none"
                >
                  <span>{item.label}</span>
                  <ChevronDown size={14} className="text-gray-400 -rotate-90" />
                </Link>
              )}
              {index < menuItems.length - 1 && <hr className="border-gray-100" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
