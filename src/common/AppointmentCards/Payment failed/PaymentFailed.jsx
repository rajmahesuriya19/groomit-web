import { Tooltip } from '@mui/material';
import React, { useState } from 'react';

import Calender from '../../../assets/icon/calendar-black.svg';
import CopyIcon from '../../../assets/icon/copyy.svg';
import { ChevronRight } from 'lucide-react';
import { formatAppointmentDate } from '../../helpers';
import AppointmentInfo from '../../AppointmentCard/AppointmentInfo';
import CopyTooltip from '../../CopyTooltip/CopyTooltip';
import { useNavigate } from 'react-router';

const PaymentFailed = ({ appointment }) => {
    const navigate = useNavigate();
    return (
        <div className="mb-4 p-5 bg-white rounded-2xl shadow-md border-t-4 border-[#EB5757] hover:shadow-lg transition">

            {/* Header */}
            <div className="flex justify-between items-start">
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
                    <ChevronRight size={24} className="text-primary-dark mt-1" />
                </div>
            </div>

            {/* Appointment Details */}
            <AppointmentInfo
                icon={Calender}
                title={`${formatAppointmentDate(appointment?.ap_date)} | ${appointment?.display_time}`}
                subtitle="Requested Time"
            />

            {/* Action Button */}
            <div className="flex mt-4">
                <button className="w-full h-[40px] rounded-xl font-inter font-bold text-base border border-gray-200 transition">
                    Update Payment Details
                </button>
            </div>
        </div>
    );
};

export default PaymentFailed;
