import React, { useEffect } from 'react';
import Box from '@mui/material/Box';

// components
import AppointmentCard from './AppointmentCard';

const Upcoming = ({ data = [] }) => {
     
    const emptyUpcomingView = () => (
        <div className="flex flex-col items-center justify-center h-[300px] text-center gap-3">
            <img src="/calendar-icon.svg" alt="calendar" className="w-14 h-14" />
            <h3 className="text-lg font-semibold">No upcoming appointments</h3>
            <p className="text-sm text-gray-500">Book your next service today!</p>
    
            <button className="px-5 py-2 bg-primary-dark text-white rounded-lg mt-4 hover:opacity-90">
                Book Appointment
            </button>
        </div>
    );
    
    const renderItem = ({ item, index }) => (
        <AppointmentCard item={item} index={index} onPressAppointmentCard={() => {}} />
    )

    const UpcomingList = () => {
        if (!data || data.length === 0) {
            return (
                <div className="w-full">
                    {emptyUpcomingView()}
                </div>
            );
        }
        return (
            <div>
                {data.map((item, index) => (
                    <div key={index} className="mb-3">
                        {renderItem({ item, index })}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <UpcomingList />
        </div>
    )
}

export default Upcoming;
