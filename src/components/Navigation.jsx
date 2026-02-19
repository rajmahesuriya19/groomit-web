import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Menu, PlusIcon, X } from 'lucide-react';
import UserDropdown from './UserDropdown.jsx';
import MobileMenu from './MobileMenu.jsx';
import info from '../assets/icon/help-circle-black.svg';
import FallbackUser from "../assets/static/logo.svg";
import Rating from '../assets/icon/fill-star.svg';
import Logo from '../assets/logo/header-logo.png';
import { useSelector } from 'react-redux';
import AddPetsModal from './Modals/AddPetsModal.jsx';

const PET_LABELS = {
  dog: "Dog",
  cat: "Cat",
};

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [petsModal, setPetsModal] = useState(false);

  const { dashboard } = useSelector((state) => state.dashboard);
  const { user } = dashboard;
  const showRating = location.pathname.startsWith('/user');

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const hasIdInPath = /\d+$/.test(location.pathname);

  // extract pet type from pathname
  const petKey = Object.keys(PET_LABELS).find((key) =>
    location.pathname.split("/").includes(key)
  );

  const petType = petKey ? PET_LABELS[petKey] : "";

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={`bg-white shadow-sm border-b border-[#BEC3C5] sticky top-0 z-50
    ${(hasIdInPath && !petType && !location.pathname.includes("/user/account/edit") && !location.pathname.includes("/user/address/edit")) ? "hidden md:block" : ""}
  `}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            <div className="flex-shrink-0 hidden md:block">
              <Link to="/" className="flex items-center">
                <img
                  className="h-12 w-40"
                  src={Logo}
                  alt="Groomit.me"
                />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            {/* Logo */}
            <div className={`${location.pathname === "/user/account" && 'w-full'} flex-shrink-0 md:hidden block`}>
              {!showRating ? <Link to="/" className="flex items-center">
                <img
                  className="h-10 w-40"
                  src="https://groomit.me/v7/images/web_logo.svg"
                  alt="Groomit.me"
                />
              </Link> : location.pathname.includes("/user/account/edit") ?
                <div className='flex items-center gap-2'>
                  <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate("/user/account")} />
                  <div className='font-filson font-bold text-xl text-primary-dark'>Edit Profile</div>
                </div> : location.pathname === "/user/account" ?
                  <div className="flex items-center justify-between w-full">
                    {/* Left: My Account */}
                    <div className="font-bold font-filson text-primary-dark text-xl w-full">
                      My Account
                    </div>

                    <div className='flex gap-2 items-center'>
                      {/* Right: Credits Box */}
                      <div className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-primary-dark p-2">
                        <p className="text-xs font-bold text-white leading-none font-inter tracking-normal">
                          CREDITS
                        </p>
                        <p className="text-base font-bold text-white leading-none font-inter tracking-[-0.01em]">
                          ${user?.available_credit}.00
                        </p>
                      </div>

                      <button
                        onClick={toggleMobileMenu}
                        className="p-1 rounded-[10px] border border-[#8A8D8E] text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        {isMobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
                      </button>
                    </div>
                  </div> : (location.pathname === "/user/pet/list" || location.pathname === "/user/address" || location.pathname === "/user/payment/card/list") ?
                    <div className="w-full">
                      <div className="flex items-center gap-2 w-full">
                        <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                        <div className="font-filson font-bold text-xl text-primary-dark">{location.pathname === "/user/pet/list" ? 'My Pets' : location.pathname === "/user/payment/card/list" ? 'Payment Method' : 'Service Address'}</div>
                      </div>
                    </div>
                    : location.pathname.includes("/user/address") ?
                      <div className="w-full">
                        <div className="flex items-center gap-2 w-full">
                          <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                          <div className="font-filson font-bold text-xl text-primary-dark">{location.pathname.includes("/user/address/edit") ? `Edit Service Address` : `Add Service Address`}</div>
                        </div>
                      </div>
                      : location.pathname.includes("/user/notifications-preferences") ?
                        <div className="w-full">
                          <div className="flex items-center gap-2 w-full">
                            <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                            <div className="font-filson font-bold text-xl text-primary-dark">Notification Preferences</div>
                          </div>
                        </div>
                        : location.pathname.includes("/user/account/password/change") ?
                          <div className="w-full">
                            <div className="flex items-center gap-2 w-full">
                              <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                              <div className="font-filson font-bold text-xl text-primary-dark">Change Password</div>
                            </div>
                          </div>
                          : location.pathname.includes("/user/payment/card") ?
                            <div className="w-full">
                              <div className="flex items-center gap-2 w-full">
                                <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                                <div className="font-filson font-bold text-xl text-primary-dark">{location.pathname.includes("/user/payment/card/add") ? `Add Card` : `Edit Card`}</div>
                              </div>
                            </div>
                            :
                            petType ?
                              <div className="w-full">
                                <div className="flex items-center gap-2 w-full">
                                  <ChevronLeft size={24} className="text-primary-light cursor-pointer" onClick={() => navigate(-1)} />
                                  <div className="font-filson font-bold text-xl text-primary-dark">
                                    {location.pathname.includes("/user/pet/edit") ? `Edit ${petType}` : `Add ${petType}`}
                                  </div>
                                </div>
                              </div>
                              : location.pathname === "/user/inbox" ? <div>
                                <div className="font-filson font-bold text-xl text-primary-dark">Inbox</div>
                              </div> : location.pathname === "/user/groomers" ? <div>
                                <div className="font-filson font-bold text-xl text-primary-dark">My Groomers</div>
                              </div> : location.pathname === "/user/appointments" ? <div>
                                <div className="font-filson font-bold text-xl text-primary-dark">Appointments</div>
                              </div> :
                                <div className="w-full">
                                  <div className="flex items-center gap-1">
                                    <img src={user?.photo ? user?.photo : FallbackUser} alt="User" className="mr-2 object-cover w-8 h-8 rounded-[4px]" />
                                    {/* <div>
                              <div className="font-inter font-bold text-base text-primary-dark">{`Hi, ${user?.first_name}`}</div>
                              <div className="font-inter font-normal text-xs text-primary-dark">Ready to pamper your pets?</div>
                            </div> */}
                                    <div>
                                      <div className='font-inter font-semibold text-xl text-primary-dark capitalize'>{`Welcome, ${user?.first_name} 👋`}</div>
                                    </div>
                                  </div>
                                </div>
              }
            </div>

            <div className='flex items-center gap-2'>
              {!showRating && <div className="md:hidden items-center flex gap-1 w-100">
                <img src={Rating} className="w-5 h-5" alt="Star" />
                <a href="https://groomit.me/reviews">
                  <div className="font-inter text-sm font-bold underline">
                    4.9 (147)
                  </div>
                </a>
              </div>}
              {(location.pathname === '/user/pet/list' || location.pathname === "/user/address") && <div className="md:hidden">
                <button
                  onClick={() => {
                    if (location.pathname === "/user/address") {
                      navigate("/user/address/add")
                    } else {
                      setPetsModal(true)
                    }
                  }}
                  className="p-1 rounded-[10px] border border-[#8A8D8E] text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  {isMobileMenuOpen ? <X size={25} /> : <PlusIcon size={25} className='text-primary-dark' />}
                </button>
              </div>}
              {location.pathname !== '/user/account' && <div className="md:hidden">
                <button
                  onClick={toggleMobileMenu}
                  className="p-1 rounded-[10px] border border-[#8A8D8E] text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  {isMobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>
              </div>}
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
                  to="/book/service-address"
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

      <AddPetsModal open={petsModal}
        onClose={() => setPetsModal(false)} />

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

export default Navigation;
