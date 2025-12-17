import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// icons
import CopyIcon from '../../../assets/icon/copyy.svg';
import Home from '../../../assets/icon/home-selection-a.svg';
import Paw from '../../../assets/icon/pet.svg';
import Location from '../../../assets/icon/location.svg';
import Message from '../../../assets/icon/message-blue.svg';
import Call from '../../../assets/icon/call-green.svg';
import Calender from '../../../assets/icon/calendar-black.svg';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router';

const RebookConfirmation = ({ appointment, onPressCancelAppoitment, onPressChangeDateTime, onPressConfirm, loading }) => {
  const navigate = useNavigate();
  const [tooltip, setTooltip] = useState('Click to copy');

  return (
      <div key={appointment?.id} className="mb-4 p-5 bg-white rounded-2xl shadow-md border-t-[3px] border-[#FFBF00] transition hover:shadow-lg">
        <div className="flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => handleCopy(appointment?.address?.booking_session_id)}>
            <Tooltip
              title={tooltip}
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    backgroundColor: 'black',
                    color: 'white',
                    fontSize: 12,
                    padding: '6px 12px',
                    borderRadius: '4px',
                  },
                },
                arrow: {
                  sx: { color: 'black' },
                },
              }}
            >
              <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide relative group">
                #{appointment?.address?.booking_session_id}
                <img src={CopyIcon} alt="Copy" className="w-3 h-3 cursor-pointer opacity-80 hover:opacity-100 transition" />
              </div>
            </Tooltip>
            <p className="font-inter font-bold text-base text-gray-800 mt-1">{`Rebooking suggested by ${appointment?.rebook_groomer?.first_name}`}</p>
          </div>
          <div className="cursor-pointer" onClick={() => navigate(`/user/view-rebook-confirmation-session/${appointment?.id}`)}>
            <ChevronRight size={24} className="text-primary-dark" />
          </div>
        </div>

        {/* Requested Time */}
        <div className="flex items-start mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg me-3 w-[40px] h-[40px]">
            <img src={Calender} alt="Calendar" className="w-5 h-5" />
          </div>
          <div>
            <p className="font-inter font-bold text-primary-dark text-sm">
              {appointment?.display_date} | {appointment?.display_time}
            </p>
            <p className="font-inter text-xs text-gray-500 mt-1">Requested Time</p>
          </div>
        </div>

        {/* Service Type */}
        <div className="flex items-start mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg me-3 w-[40px] h-[40px]">
            <img src={Home} alt="Home" className="w-5 h-5" />
          </div>
          <div>
            <p className="font-inter font-bold text-primary-dark text-sm">
              {appointment?.service_type == 'InHome' || appointment?.service_type == 'in-home' ? 'In Home' : 'Mobile Van'}
            </p>
            <p className="font-inter text-xs text-gray-500 mt-1">Service Type</p>
          </div>
        </div>

        {/* Pets */}
        <div className="flex items-start mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg me-3 w-[40px] h-[40px]">
            <img src={Paw} alt="Pets" className="w-5 h-5" />
          </div>
          <div>
            <p className="font-inter font-bold text-primary-dark text-sm">{appointment?.pets?.map((pet) => pet.name).join(', ')}</p>
            <p className="font-inter text-xs text-gray-500 mt-1">Pets to be Groomed</p>
          </div>
        </div>

        {/* Service Address */}
        <div className="flex items-start mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg me-3 w-[40px] h-[40px]">
            <img src={Location} alt="Location" className="w-5 h-5" />
          </div>
          <div>
            <p className="font-inter font-bold text-primary-dark text-sm">
              {appointment?.address?.street}, {appointment?.address?.city}, {appointment?.address?.state}, {appointment?.address?.zip}
            </p>
            <p className="font-inter text-xs text-gray-500 mt-1">Service Address</p>
          </div>
        </div>

        {/* Preferred Groomer */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-start gap-4">
            <div className="flex justify-center items-center rounded-lg">
              <img
                src={appointment?.rebook_groomer?.profile_photo_url}
                alt={appointment?.rebook_groomer?.first_name}
                className="object-cover rounded-md w-[40px] h-[40px]"
              />
            </div>

            <div className="flex-1">
              <p className="font-inter font-bold text-primary-dark text-sm">
                {appointment?.rebook_groomer?.first_name} {appointment?.rebook_groomer?.last_name?.[0]}.
              </p>
              <p className="font-inter text-xs text-gray-500 mt-1">Preferred Groomer</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-line justify-center rounded-[10px] w-[40px] h-[40px]">
                <img src={Message} alt="Message" className="w-6 h-6" />
              </div>
              <div className="flex items-center border border-line justify-center rounded-[10px] w-[40px] h-[40px]">
                <img src={Call} alt="Call" className="w-6 h-6" />
              </div>
            </div>
          </div>

          <p className="mt-2 font-inter font-normal text-xs text-gray-600">Calling is available only through the app</p>
        </div>

        {/* Change Date/Time and Confirm Buttons */}
        <div>
          <div className="flex items-start mt-4 pt-3 border-t border-gray-200 gap-3">
            <button
              className="font-inter font-bold text-base w-full h-[38px] rounded-[10px] border border-gray-200"
              onClick={() => setChangeTimeModal(true)}
            >
              Change Date/Time
            </button>
            <button className="font-inter bg-primary-dark font-bold text-base text-white w-full h-[38px] rounded-[10px] border border-gray-200">
              Confirm
            </button>
          </div>

          <div
            className="cursor-pointer mt-4 text-center font-inter font-normal text-sm underline text-[#3064A3]"
            onClick={() => setCancelAppModal(true)}
          >
            Reject Request
          </div>
        </div>
      </div>
  );
};

export default RebookConfirmation;
