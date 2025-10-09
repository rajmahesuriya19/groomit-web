import React from 'react'
import Card from '../Card'
import { ChevronRight } from 'lucide-react';

import Calender from '../../../assets/icon/calendar-black.svg';
import Home from '../../../assets/icon/home-selection-a.svg';
import Location from '../../../assets/icon/location.svg';
import AppointmentInfo from '@/common/AppointmentCard/AppointmentInfo';
import { formatAppointmentDate } from '@/common/helpers';
import MyPets from '../Pets Information/Pets';
import Cards from '../Cards Section/Cards';
import AppointmentHeader from '../Appointment Detail Header/AppointmentHeader';

const GroomerMatchInProgressDetail = ({ selectedAppointment }) => {
    const address = selectedAppointment?.address
        ? `${selectedAppointment.address.address1}, ${selectedAppointment.address.city}, ${selectedAppointment.address.state}, ${selectedAppointment.address.zip}`
        : 'N/A';
    return (
        <>
            <Card borderColor="#FFBF00">
                <AppointmentHeader appointment={selectedAppointment} />
            </Card>

            <Card>
                <AppointmentInfo
                    type="detail"
                    icon={Calender}
                    title={`${formatAppointmentDate(selectedAppointment?.appt_detail?.display_date)} | ${selectedAppointment?.appt_detail?.display_time}`}
                    subtitle="Requested Time"
                />
                <AppointmentInfo
                    icon={Home}
                    title={selectedAppointment?.appt_detail?.inhome_mv === "InHome" ? 'In Home' : 'Mobile Van'}
                    subtitle="Service Type"
                />
                <AppointmentInfo icon={Location} title={address} subtitle="Service Address" />
                <PreferredGroomer groomer={selectedAppointment?.groomer} />
            </Card>

            <Card>
                <div className="flex justify-between items-center">
                    <div className="font-inter font-bold text-primary-dark text-base">Pet Information</div>
                    <div className="flex items-center">
                        <div className="font-inter font-normal text-[#3064A3] text-sm">Details</div>
                        <ChevronRight size={15} className="text-[#3064A3]" />
                    </div>
                </div>
                <MyPets pets={selectedAppointment?.pets} />
            </Card>

            <Card>
                <Cards cards={selectedAppointment?.card} charged={selectedAppointment?.total_charged} />
            </Card>
        </>
    )
}

export default GroomerMatchInProgressDetail;

/* 💇 Preferred Groomer */
const PreferredGroomer = ({ groomer }) => {
    if (!groomer) return null;

    const {
        first_name,
        last_name,
        profile_photo_url,
        groomer_type,
    } = groomer;

    return (
        <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-start gap-4">
                <img
                    src={profile_photo_url || 'https://www.groomit.me/v7/images/icons/profile-circle.svg'}
                    alt={first_name || 'Groomer'}
                    className="w-[40px] h-[40px] rounded-md object-cover"
                />

                <div className="flex-1">
                    <p className="font-inter font-bold text-sm text-primary-dark">
                        {first_name} {last_name?.[0] || ''}.
                    </p>
                    <p className="font-inter text-xs text-gray-500 mt-1">{groomer_type || 'Preferred Groomer'}</p>
                </div>
            </div>
        </div>
    );
};