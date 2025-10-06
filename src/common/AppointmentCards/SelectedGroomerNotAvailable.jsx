import React from 'react';
import { ChevronRight } from 'lucide-react';

import Calender from '../../assets/icon/calendar-black.svg';
import CopyIcon from '../../assets/icon/copyy.svg';
import Message from '../../assets/icon/message-blue.svg';
import Call from '../../assets/icon/call-green.svg';

import CopyTooltip from '../CopyTooltip/CopyTooltip';
import AppointmentInfo from '../AppointmentCard/AppointmentInfo';
import { formatAppointmentDate } from '../helpers';
import { useNavigate } from 'react-router';

const SelectedGroomerNotAvailable = ({ appointment }) => {
    const navigate = useNavigate();
    return (
        <div className="mb-4 p-5 bg-white rounded-2xl shadow-md border-t-4 border-[#EB5757] hover:shadow-lg transition">
            <div className="flex justify-between items-center">
                <CopyTooltip textToCopy={`#${appointment?.appointment_id}`}>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide">
                            #{appointment?.appointment_id}
                            <img
                                src={CopyIcon}
                                alt="Copy"
                                className="w-3 h-3 cursor-pointer opacity-80 hover:opacity-100 transition"
                            />
                        </div>
                        <p className="font-inter font-bold text-base text-gray-800 mt-1">
                            {appointment.appointment_status_label}
                        </p>
                    </div>
                </CopyTooltip>

                <div className="cursor-pointer" onClick={() => navigate(`/user/appointment/${appointment?.appointment_id}`)}>
                    <ChevronRight size={24} className="text-primary-dark mt-1" />
                </div>
            </div>

            {/* Appointment Details */}
            <AppointmentInfo
                icon={Calender}
                title={`${formatAppointmentDate(appointment?.ap_date)} | ${appointment?.display_time}`}
                subtitle="Requested Time"
            />

            {/* Preferred Groomer */}
            <PreferredGroomer groomer={appointment?.groomer} />

            {/* Actions */}
            <div className="flex gap-3 mt-4">
                <button className="flex-1 h-[38px] rounded-[10px] border border-gray-200 font-inter font-bold text-base">
                    Find Me Groomer
                </button>
                <button className="flex-1 h-[38px] rounded-[10px] border border-gray-200 font-inter font-bold text-base">
                    Reschedule
                </button>
            </div>
        </div>
    );
};

export default SelectedGroomerNotAvailable;

const PreferredGroomer = ({ groomer }) => {
    if (!groomer) return null;

    return (
        <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-start gap-4">
                <img
                    src={groomer.profile_photo_url || 'https://www.groomit.me/v7/images/icons/profile-circle.svg'}
                    alt={groomer.first_name || 'Groomer'}
                    className="w-[40px] h-[40px] rounded-md object-cover"
                />
                <div className="flex-1">
                    <p className="font-inter font-bold text-sm text-primary-dark">
                        {groomer.first_name} {groomer.last_name?.[0] || ''}.
                    </p>
                    <p className="font-inter text-xs text-gray-500 mt-1">{groomer.groomer_type || 'Preferred Groomer'}</p>
                </div>

                <div className="flex gap-2">
                    <ActionButton icon={groomer.isAllowedMessage ? Message : 'https://dev.groomit.me/v7/images/webapp/icons/message-gray.svg'} />
                    <ActionButton icon={groomer.isAllowedCall ? Call : 'https://dev.groomit.me/v7/images/webapp/icons/call-gray.svg'} />
                </div>
            </div>
            <p className="mt-2 font-inter text-xs text-gray-600">Calling is available only through the app</p>
        </div>
    );
};

const ActionButton = ({ icon }) => (
    <div className="w-[40px] h-[40px] flex items-center justify-center border border-line rounded-[10px]">
        <img src={icon} alt="action" className="w-6 h-6" />
    </div>
);
