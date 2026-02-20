import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, UserPlus, UserRound } from 'lucide-react';
import notificationIcon from '../assets/icon/notification.svg';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '@/utils/store/slices/auth/authSlice';
import { toast } from 'react-toastify';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { persistor } from '@/utils/store';

const UserDropdown = ({ onProtectedAction }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { showLoader, hideLoader } = useLoader();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { dashboard = [] } = useSelector((state) => state.dashboard);
  const { user = null } = dashboard;

  const showDropdown = location.pathname.startsWith('/user');

  const localToken = localStorage.getItem('token');

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

  const handleLogin = async () => {
    const email = 'nitesh111@groomit.me';
    const password = 'Nitesh99';

    showLoader();
    try {
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        toast.success('Login successful 🎉');
        hideLoader();
        navigate('/user/dashboard');
      } else {
        toast.error(result.payload?.message || 'Login failed 😢');
        hideLoader();
      }
    } catch (error) {
      hideLoader();
      toast.error(error.message || 'Something went wrong 🚨');
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
    {
      label: 'My Account',
      action: () => onProtectedAction?.('/user/account'),
    },
    {
      label: 'Dashboard',
      action: () => onProtectedAction?.('/user/dashboard'),
    },
    {
      label: 'Log Out',
      onClick: handleLogout,
    },
  ];

  const menuItemsOffline = [
    { label: 'Login', onClick: handleLogin, type: 'offline', icon: <UserRound size={24} className="text-brand" /> },
    { label: 'Sign Up', onClick: handleLogin, type: 'offline', icon: <UserPlus size={24} className="text-brand" /> },
  ];

  // ✅ Choose which menu to show
  const activeMenu = localToken ? menuItems : menuItemsOffline;

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      <div
        className={`${showDropdown ? '' : 'flex items-center justify-between bg-white rounded-full px-3 py-2 gap-2 transition-all duration-150'}`}
        style={
          !showDropdown
            ? {
              width: '103px',
              height: '48px',
              border: '5px solid #FFFFFF',
              boxShadow: '0px 5px 60px 0px #00000033',
            }
            : {}
        }
        onClick={() => {
          if (!showDropdown) {
            setIsOpen(!isOpen);
          } else {
            onProtectedAction?.('/user/account');
          }
        }}
      >
        {/* Notification Icon */}
        {!showDropdown && <div className="flex items-center justify-center relative">
          <img src={notificationIcon} alt="Notification" width={26} height={26} />
        </div>}

        {/* Divider */}
        {!showDropdown && <div
          className="bg-primary-light opacity-30"
          style={{ width: '1px', height: '19px' }}
        />}

        {/* User Avatar */}
        <div
          className="flex items-center justify-center rounded-[10px] overflow-hidden"
          style={
            !showDropdown
              ? {
                width: '28px', height: '28px'
              }
              : {}
          }
        >
          {user?.photo ? (
            <div onClick={() => navigate("/user/account")}>
              <img src={user.photo} alt={user.name} className={`${showDropdown ? 'w-[45px] h-[45px] object-contain' : 'w-[45px] h-[45px] object-contain'}`} />
            </div>
          ) : (
            <div
            //  onClick={() => navigate("/user/account")}
            >
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="User Avatar"
                className="w-[45px] h-[45px] object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      {
        isOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {activeMenu.map((item, index) => (
              <div key={item.label}>
                {item.onClick ? (
                  <button
                    onClick={() => {
                      item.onClick();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {/* 👇 If offline, show icon */}
                    {item.type === 'offline' && item.icon}
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      item.action?.();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={14} className="text-gray-400 -rotate-90" />
                  </button>
                )}
                {index < activeMenu.length - 1 && <hr className="border-gray-100" />}
              </div>
            ))}
          </div>
        )
      }
    </div >
  );
};

export default UserDropdown;
