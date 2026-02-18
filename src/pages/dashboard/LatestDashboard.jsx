import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';

import ServiceLocationCard from './DashboardLayout/LeftPanel/ServiceLocationCard';
import { fetchAddresses } from '@/utils/store/slices/serviceAddressList/serviceAddressListSlice';
import PromoCard from './DashboardLayout/LeftPanel/PromoCard';
import ReviewsSection from './DashboardLayout/LeftPanel/ReviewsSection';
import { getReviews } from '@/utils/store/slices/reviews/reviewsSlice';
import { getDashboardData } from '@/utils/store/slices/dashboard/dashboardSlice';
import { getUserInfo } from '@/utils/store/slices/userInfo/userInfoSlice';
import GroomingOptionsAccordion from './DashboardLayout/RightPanel/GroomingOptionsAccordion';
import { ChevronRight } from 'lucide-react';
import AppointmentCard from '../appointments/AppointmentCard';
import { useNavigate } from 'react-router';

const CommonCard = ({ children, className = "" }) => (
    <div className={`rounded-[15px] p-[15px] bg-white ${className}`}>
        {children}
    </div>
);

/* ========================= MAIN ========================= */

const LatestDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const { addresses = [] } = useSelector((state) => state.addresses);
    const { dashboard } = useSelector((state) => state.dashboard);
    const {
        user = null,
        catPets = [],
        dogPets = [],
        upcoming_appts = [],
        rebook_requests = [],
        completed_appts = [],
        recurring_cancelled = [],
        current_appts = []
    } = dashboard;

    const allPets = [...dogPets, ...catPets];
    const hasAnyPet = dogPets?.length > 0 || catPets?.length > 0;

    const isAnyAppoitment =
        completed_appts?.length > 0 ||
        rebook_requests?.length > 0 ||
        recurring_cancelled?.length > 0 ||
        upcoming_appts?.length > 0 ||
        current_appts?.length > 0

    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();

                await Promise.all([
                    dispatch(getDashboardData()),
                    dispatch(getReviews()),
                    dispatch(getUserInfo()),
                    dispatch(fetchAddresses())
                ]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [dispatch]);

    const renderItem = ({ item, index }) => (
        <AppointmentCard item={item} index={index} onPressAppointmentCard={() => { }} />
    )

    /* ========================= UI ========================= */

    return (
        <>
            <div className='hidden md:flex bg-white items-center justify-between overflow-hidden w-full'
                style={{ padding: '20px 45px 20px 20px' }}>
                <div>
                    <div className='font-inter font-bold text-xl text-primary-dark capitalize'>
                        {`Welcome, ${user?.first_name} 👋`}
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-5 py-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 md:gap-6 lg:gap-8">
                <div className="space-y-4">
                    {(!addresses.length) && <CommonCard className='flex flex-col items-start gap-[15px]'>
                        <ServiceLocationCard />
                    </CommonCard>}

                    {(!hasAnyPet || !isAnyAppoitment) && <CommonCard className='flex flex-col items-center gap-[15px]'>
                        <PromoCard />
                    </CommonCard>}

                    {!isAnyAppoitment && <CommonCard className='flex flex-col items-start gap-[15px] w-full'>
                        <ReviewsSection />
                    </CommonCard>}

                    {/* If Rebook Appointments are available */}
                    {rebook_requests?.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-inter font-bold text-xl text-primary-dark">Rebooking Request</h3>
                                <div className="flex items-center cursor-pointer" onClick={() => navigate(`/user/appointments`)}>
                                    <h3 className="font-inter font-normal text-sm text-primary-light">All Appointments</h3>
                                    <ChevronRight size={20} className="text-primary-light" onClick={() => navigate(`/user/appointments`)} />
                                </div>
                            </div>
                            {rebook_requests?.map((appt, idx) => (
                                <div key={idx}>
                                    <>{appt?.type === 'rebook' && <RebookConfirmation appointment={appt} />}</>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* If CURRENT exists → show only CURRENT */}
                    {current_appts?.length > 0 ? (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-inter font-bold text-xl text-primary-dark">Current Appointment</h3>
                                <div className="flex items-center cursor-pointer" onClick={() => navigate(`/user/appointments`)}>
                                    <h3 className="font-inter font-normal text-sm text-primary-light">All Appointments</h3>
                                    <ChevronRight size={12} className="text-primary-light" onClick={() => navigate(`/user/appointments`)} />
                                </div>
                            </div>
                            {current_appts?.map((item, idx) => (
                                <div key={idx}>
                                    {renderItem({ item, idx })}
                                </div>
                            ))}
                        </div>
                    ) : upcoming_appts?.length > 0 ? ( // No CURRENT → Show UPCOMING if exists
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-inter font-bold text-xl text-primary-dark">Upcoming Appointment</h3>
                                <div className="flex items-center cursor-pointer" onClick={() => navigate(`/user/appointments`)}>
                                    <h3 className="font-inter font-normal text-sm text-primary-light">All Appointments</h3>
                                    <ChevronRight size={12} className="text-primary-light" onClick={() => navigate(`/user/appointments`)} />
                                </div>
                            </div>
                            {upcoming_appts?.map((item, idx) => (
                                <div key={idx}>
                                    {renderItem({ item, idx })}
                                </div>
                            ))}
                        </div>
                    ) : completed_appts?.length > 0 ? ( //  No CURRENT + No UPCOMING → Show COMPLETED
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-inter font-bold text-xl text-primary-dark">Last Appointment</h3>
                                <div className="flex items-center cursor-pointer" onClick={() => navigate(`/user/appointments`)}>
                                    <h3 className="font-inter font-normal text-sm text-primary-light">All Appointments</h3>
                                    <ChevronRight size={12} className="text-primary-light" onClick={() => navigate(`/user/appointments`)} />
                                </div>
                            </div>
                            {completed_appts.map((item, index) => {
                                return (
                                    <div key={index}>
                                        {renderItem({ item, index })}
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}
                </div>

                <div className="hidden md:flex justify-center">
                    <div className="h-full w-[1px] bg-[#E4E4E4]" />
                </div>

                <div className="space-y-4 w-full min-w-0">
                    <GroomingOptionsAccordion allPets={allPets} />
                </div>
            </div>
        </>
    );
};

export default LatestDashboard;
