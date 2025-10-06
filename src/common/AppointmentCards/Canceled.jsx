import React from 'react';
import { ChevronRight } from 'lucide-react';

import Calendar from '../../assets/icon/calendar-black.svg';
import CopyIcon from '../../assets/icon/copyy.svg';
import Message from '../../assets/icon/message-blue.svg';
import Call from '../../assets/icon/call-green.svg';
import Star from '../../assets/icon/star.svg';

import CopyTooltip from '../CopyTooltip/CopyTooltip';
import AppointmentInfo from '../AppointmentCard/AppointmentInfo';
import { formatAppointmentDate } from '../helpers';
import { useNavigate } from 'react-router';

const Canceled = ({ appointment }) => {
    const navigate = useNavigate();
    const { appointment_id, appointment_status_label, ap_date, display_time, groomer } = appointment || {};

    return (
        <div className="mb-4 p-5 bg-white rounded-2xl shadow-md border-t-4 border-[#EB5757] hover:shadow-lg transition-all duration-200">
            {/* Header */}
            <div className="flex justify-between items-center">
                <CopyTooltip textToCopy={`#${appointment_id}`}>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide">
                            #{appointment_id}
                            <img
                                src={CopyIcon}
                                alt="Copy"
                                className="w-3 h-3 opacity-80 hover:opacity-100 transition"
                            />
                        </div>
                        <p className="font-inter font-bold text-base text-gray-800 mt-1">{appointment_status_label}</p>
                    </div>
                </CopyTooltip>

                <div className="cursor-pointer" onClick={() => navigate(`/user/appointment/${appointment?.appointment_id}`)}>
                    <ChevronRight size={24} className="text-primary-dark mt-1" />
                </div>
            </div>

            {/* Appointment Info */}
            <AppointmentInfo
                icon={Calendar}
                title={`${formatAppointmentDate(ap_date)} | ${display_time}`}
                subtitle="Requested Time"
            />

            {/* Groomer Info */}
            <PreferredGroomer groomer={groomer} />

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col gap-3">
                {/* <div className="flex gap-3">
                    <ActionButton label="Rate Service" icon={Star} />
                    <ActionButton label="Refund Status" />
                </div> */}
                <ActionButton label="Rebook" variant="brand" />
            </div>
        </div>
    );
};

export default Canceled;

const PreferredGroomer = ({ groomer }) => {
    if (!groomer) return null;

    const {
        first_name,
        last_name,
        profile_photo_url,
        groomer_type,
        isAllowedMessage,
        isAllowedCall,
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

                <div className="flex gap-2">
                    <ActionIcon
                        icon={isAllowedMessage ? Message : 'https://dev.groomit.me/v7/images/webapp/icons/message-gray.svg'}
                    />
                    <ActionIcon
                        icon={isAllowedCall ? Call : 'https://dev.groomit.me/v7/images/webapp/icons/call-gray.svg'}
                    />
                </div>
            </div>

            <p className="mt-2 font-inter text-xs text-gray-600">
                Calling is available only through the app
            </p>
        </div>
    );
};

// 🧩 Generic text button (e.g. Rate Service, Refund Status, Rebook)
const ActionButton = ({ label, icon, variant = 'default' }) => {
    const baseStyle =
        'flex-1 h-[40px] rounded-xl border font-inter font-bold text-base flex items-center justify-center gap-2 transition-all duration-200';
    const variants = {
        default: `${baseStyle} border-gray-200 text-gray-800 hover:bg-gray-50`,
        brand: `${baseStyle} py-2 border-brand text-brand hover:bg-brand/10`,
    };

    return (
        <button className={variants[variant]}>
            {icon && <img
                src={icon}
                alt='Star'
                className="w-[22px] h-[22px] flex items-center"
            />}
            <span>{label}</span>
        </button>
    );
};

// 🧩 Icon button with tooltip (for message/call)
const ActionIcon = ({ icon }) => (
    <div className="w-[40px] h-[40px] flex items-center justify-center border border-line rounded-[10px] hover:bg-gray-50 transition">
        <img src={icon} alt="action" className="w-6 h-6" />
    </div>
);
