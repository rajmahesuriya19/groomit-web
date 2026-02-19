import React, { useEffect } from 'react';
import SupportItems from '@/common/SupportItems/SupportItems';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import { getAppointments } from '@/utils/store/slices/appointments/appointmentsSlice';

// components
import AppointmentsList from './AppointmentsList/AppointmentsList';
import calendar from '../../assets/menu-new/calendar-gray.svg';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';

import Upcoming from './Upcoming';
import History from './History';
const CustomTabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index} aria-labelledby={`custom-tab-${index}`}>
            {value === index && <Box className="p-2">{children}</Box>}
        </div>
    );
};

const EmptyState = ({ title, description, buttonText }) => (
    <div className="flex flex-col items-center justify-center h-[500px] w-full gap-2 p-0">
        {/* <img src={calendar} alt="calendar" className="w-[60px] h-[60px]" /> */}
        <div className="font-inter font-bold text-xl text-center">{title}</div>
        <div className="font-inter font-normal text-base text-center">{description}</div>
        <button
            type="button"
            className="h-[50px] px-[27px] bg-primary-dark text-white rounded-[10px] hover:opacity-90 transition"
        >
            {buttonText}
        </button>
    </div>
);

const Appointments = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const { showLoader, hideLoader } = useLoader();
    const dispatch = useDispatch();

    const { appointments } = useSelector((state) => state.appointments);

    useEffect(() => {
        showLoader();
        dispatch(getAppointments()).finally(() => hideLoader());
    }, [dispatch]);

    const tabs = [
        { label: 'Upcoming', type: 'upcoming' },
        { label: 'History', type: 'history' },
    ];

    const getTabData = (type) => {
        if (!appointments) return [];
        return type === 'history' ? appointments?.completed_appts || [] : appointments?.upcoming_appts || [];
    };

    return (
        <div className="px-4 sm:px-5 py-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-2 md:gap-6 lg:gap-8 relative">
            {/* Tabs Section */}
            <div className="space-y-4">
                {/* Tab Buttons */}
                <div className="flex w-full">
                    {tabs.map((tab, index) => {
                        const isActive = index === activeTab;
                        return (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`w-1/2 h-[41px] px-[15px] text-center font-inter text-sm transition-all duration-200 ${isActive
                                    ? 'font-bold text-white bg-primary-dark'
                                    : 'bg-white font-normal text-primary-dark border-[1.5px] border-primary-line'
                                    }`}
                                style={{
                                    borderRadius: index === 0 ? '10px 0 0 10px' : '0 10px 10px 0',
                                }}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Panels */}
                <CustomTabPanel value={activeTab} index={0}>
                    <Upcoming data={appointments?.upcoming_appts || []} />
                </CustomTabPanel>

                <CustomTabPanel value={activeTab} index={1}>
                    <History data={appointments?.completed_appts || []} />
                </CustomTabPanel>

                {/* {tabs.map((tab, index) => {
                    const tabData = getTabData(tab.type);
                    console.log('tabData', tab);
                    
                    return (
                        <CustomTabPanel key={index} value={activeTab} index={index}>
                            {tabData.length > 0 ? (
                                <AppointmentsList data={tabData} type={tab.type} />
                            ) : (
                                <EmptyState
                                    title="No appointments scheduled yet"
                                    description="Book your pet’s next groom today!"
                                    buttonText="Book Appointment"
                                />
                            )}
                        </CustomTabPanel>
                    );
                })} */}
            </div>

            {/* Divider */}
            <div className="hidden md:flex justify-center">
                <div className="h-full w-[1px] bg-[#E4E4E4]" />
            </div>

            {/* Right Section */}
            <div className="hidden md:block w-full min-w-0">
                <div className="sticky top-24 space-y-4">
                    <SupportItems />
                </div>
            </div>
        </div>
    );
};

export default Appointments;
