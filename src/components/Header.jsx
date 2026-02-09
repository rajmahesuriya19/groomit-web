import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import UserDropdown from './UserDropdown.jsx';
import info from '../assets/icon/help-circle-black.svg';
import Rating from '../assets/icon/fill-star.svg';
import MobileMenuHeader from './MobileMenuHeader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import CancelBookingFlowModal from './Modals/CancelBookingFlowModal.jsx';
import { clearBookingFlow } from '@/utils/store/slices/booking-flow/bookingFlowSlice.js';
import { clearSelectedPet } from '@/utils/store/slices/petList/petListSlice.js';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const bookingFlow = useSelector((state) => state.bookingFlow);

    const {
        selectedPetIdsfromAPI,
        petsDraft,
        petCounts = { dog: 0, cat: 0 }
    } = bookingFlow;

    const dogCount = petCounts?.dog || 0;
    const catCount = petCounts?.cat || 0;
    const totalPets = dogCount + catCount;

    const shouldBlockNavigation =
        totalPets > 0 &&
        selectedPetIdsfromAPI?.length > 0 &&
        petsDraft?.length > 0;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cancelBookingFlow, setCancelBookingFlow] = useState(false);
    const [pendingRoute, setPendingRoute] = useState(null);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleProtectedNavigation = (route) => {
        console.log(route);

        if (shouldBlockNavigation) {
            setPendingRoute(route);
            setCancelBookingFlow(true);
        } else {
            navigate(route);
        }
    };

    const booking_flow = location.pathname.startsWith('/book');

    return (
        <>
            {/* Main Header */}
            <nav className={`bg-white border-b border-[#BEC3C5] sticky top-0 z-50 shadow-sm ${booking_flow ? 'hidden md:block' : ''}`}>
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">

                        <div className="flex-shrink-0 hidden md:block">
                            <Link
                                to="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleProtectedNavigation("/");
                                }}
                            >
                                <img
                                    className="h-12 w-40"
                                    src="https://groomit.me/v7/images/home/groomit-logo.svg"
                                    alt="Groomit.me"
                                />
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        {/* Logo */}
                        <div className="flex-shrink-0 md:hidden block">
                            <Link to="/" className="flex items-center">
                                <img
                                    className="h-10 w-40"
                                    src="https://groomit.me/v7/images/home/groomit-logo.svg"
                                    alt="Groomit.me"
                                />
                            </Link>
                        </div>

                        <div className='flex items-center gap-4'>
                            <div className="md:hidden items-center flex gap-1 w-100">
                                <img src={Rating} className="w-5 h-5" alt="Star" />
                                <a href="https://groomit.me/reviews">
                                    <div className="font-inter text-sm font-bold underline">
                                        4.9 (147)
                                    </div>
                                </a>
                            </div>
                            <div className="md:hidden">
                                <button
                                    onClick={toggleMobileMenu}
                                    className="p-1 rounded-[10px] border border-[#8A8D8E] text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                    {isMobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
                                </button>
                            </div>
                        </div>


                        {/* Desktop Header */}
                        <div className="hidden md:flex items-center justify-between ml-8 min-w-0">
                            {/* Right Side Items */}
                            <div className="flex flex-wrap items-center gap-4 min-w-0 ml-4">

                                {/* Credits Display */}
                                {!booking_flow && <div className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-primary-dark px-3 py-2">
                                    <p className="text-xs font-medium text-white leading-none font-inter tracking-normal">
                                        CREDITS
                                    </p>
                                    <p className="text-base font-extrabold text-white leading-none font-inter tracking-[-0.01em]">
                                        $1,500.00
                                    </p>
                                </div>}

                                {/* User Dropdown */}
                                <UserDropdown onProtectedAction={handleProtectedNavigation} />

                                {/* Help Link */}
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleProtectedNavigation("/book/service-address");
                                    }}
                                    className="flex items-center px-[12px] py-[10px] rounded-[10px] border"
                                >
                                    <img src={info} alt="Help Icon" className="w-[24px] h-[24px]" />
                                    <span className="text-sm font-semibold px-2">Need Help?</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {!booking_flow && (
                <MobileMenuHeader
                    isOpen={isMobileMenuOpen}
                    onClose={() => setIsMobileMenuOpen(false)}
                />
            )}

            <CancelBookingFlowModal
                open={cancelBookingFlow}
                onClose={() => setCancelBookingFlow(false)}
                title={'Exit Booking Confirmation'}
                decs={'Are you sure you want to drop the booking process? All your booking selections will be erased.'}
                onConfirm={() => {
                    dispatch(clearBookingFlow());
                    dispatch(clearSelectedPet());

                    setCancelBookingFlow(false);

                    if (pendingRoute) {
                        navigate(pendingRoute);
                        setPendingRoute(null);
                    }
                }}
            />
        </>
    );
};

export default Header;
