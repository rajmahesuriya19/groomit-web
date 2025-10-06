import { Tooltip } from '@mui/material';
import React, { useState } from 'react';

import Calender from '../../assets/icon/calendar-black.svg';
import Home from '../../assets/icon/home-selection-a.svg';
import Paw from '../../assets/icon/pet.svg';
import Location from '../../assets/icon/location.svg';
import CopyIcon from '../../assets/icon/copyy.svg';
import Message from '../../assets/icon/message-blue.svg';
import Call from '../../assets/icon/call-green.svg';
import { ChevronRight } from 'lucide-react';
import { formatAppointmentDate } from '../helpers';
import AppointmentInfo from '../AppointmentCard/AppointmentInfo';
import CopyTooltip from '../CopyTooltip/CopyTooltip';
import { useNavigate } from 'react-router';

const GroomerConfirmationPending = ({ appointment }) => {
    const navigate = useNavigate();

    const pets = appointment?.pets?.map((pet) => pet.name).join(', ') || 'N/A';
    const address = appointment?.addressInfo
        ? `${appointment.addressInfo.address1}, ${appointment.addressInfo.city}, ${appointment.addressInfo.state}, ${appointment.addressInfo.zip}`
        : 'N/A';

    return (
        <div className="mb-4 p-5 bg-white rounded-2xl shadow-md border-t-4 border-[#FFBF00] hover:shadow-lg transition">

            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="cursor-pointer">
                    <CopyTooltip textToCopy={`#${appointment?.appointment_id}`}>
                        <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide">
                            #{appointment?.appointment_id}
                            <img
                                src={CopyIcon}
                                alt="Copy"
                                className="w-3 h-3 cursor-pointer opacity-80 hover:opacity-100 transition"
                            />
                        </div>
                    </CopyTooltip>

                    <p className="font-inter font-bold text-base text-gray-800 mt-1">
                        {appointment.appointment_status_label}
                    </p>
                </div>
                <div className="cursor-pointer" onClick={() => navigate(`/user/appointment/${appointment?.appointment_id}`)}>
                    <ChevronRight size={24} className="text-primary-dark" />
                </div>
            </div>

            {/* Appointment Details */}
            <AppointmentInfo icon={Calender} title={`${formatAppointmentDate(appointment?.ap_date)} | ${appointment?.display_time}`} subtitle="Requested Time" />
            <AppointmentInfo
                icon={Home}
                title={appointment?.inhome_mv === "InHome" ? 'In Home' : 'Mobile Van'}
                subtitle="Service Type"
            />
            <AppointmentInfo icon={Paw} title={pets} subtitle="Pets to be Groomed" />
            <AppointmentInfo icon={Location} title={address} subtitle="Service Address" />

            {/* Preferred Groomer */}
            <PreferredGroomer groomer={appointment?.groomer} />
        </div>
    );
};

const PreferredGroomer = ({ groomer }) => {
    if (!groomer) return null;

    return (
        <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-start gap-4">
                <img
                    src={groomer.profile_photo_url || 'https://www.groomit.me/v7/images/icons/profile-circle.svg'}
                    alt={groomer.first_name}
                    className="w-[40px] h-[40px] rounded-md object-cover"
                />
                <div className="flex-1">
                    <p className="font-inter font-bold text-sm text-primary-dark">
                        {groomer.first_name} {groomer.last_name?.[0]}.
                    </p>
                    <p className="font-inter text-xs text-gray-500 mt-1">{groomer.groomer_type || 'Preferred Groomer'}</p>
                </div>

                <div className="flex gap-2">
                    {groomer.isAllowedMessage && <ActionButton icon={Message} />}
                    {groomer.isAllowedCall && <ActionButton icon={Call} />}
                </div>
            </div>
            {groomer.isAllowedMessage && groomer.isAllowedCall && <p className="mt-2 font-inter text-xs text-gray-600">
                Calling is available only through the app
            </p>}
        </div>
    );
};

const ActionButton = ({ icon }) => (
    <div className="w-[40px] h-[40px] flex items-center justify-center border border-line rounded-[10px]">
        <img src={icon} alt="action" className="w-6 h-6" />
    </div>
);

export default GroomerConfirmationPending;
