import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import SupportItems from '@/common/SupportItems/SupportItems';

import RecurringGreenIcon from '../../../assets/icon/green-groomit.svg';
import Edit3 from '../../../assets/icon/edit-3.svg';
import dogAvatar from '../../../assets/icon/dog-avatar.jpg';
import Info from '../../../assets/icon/info-circle-grey.svg';
import TickbgBlack from '../../../assets/icon/tick-bgBlack.svg';
import ClockGray from '../../../assets/icon/clock-gray.svg';
import ScissorBlack from '../../../assets/icon/scissor-black.svg';
import Location from '../../../assets/icon/location.svg';
import CardIcon from '../../../assets/icon/card.svg';
import MobileVan from '../../../assets/icon/mobile-van.svg';

const RecurringScheduleDetails = () => {
  return (
    <>
      {/* Page Header */}
      <div className="w-full overflow-hidden py-[10px] bg-white shadow-sm hover:shadow-lg transition">
        <div className="py-2 px-5 w-full hidden md:flex gap-3 items-center">
          <ChevronLeft size={24} className="text-primary-dark cursor-pointer" onClick={() => navigate(-1)} />
          <div className="font-filson font-bold text-xl text-primary-dark">Flexible Recurring</div>
        </div>

        <div className="px-2 w-full block md:hidden">
          <div className="flex items-center gap-2 w-full">
            <ChevronLeft size={24} className="text-primary-dark cursor-pointer" onClick={() => navigate(-1)} />
            <div className="w-full text-center font-filson font-bold text-xl text-primary-dark">Flexible Recurring</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 py-6 grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
        {/* Left Section */}
        <div className="space-y-4">
          {/* Recurring section */}
          <div className={`mb-4 p-[15px] bg-white rounded-2xl shadow-md`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-[10px]">
                <img src={RecurringGreenIcon} alt="Recurring" className="w-[35px] h-[35px] rounded-full object-cover" />

                <div className="flex flex-col justify-center">
                  <span className="font-inter font-semibold text-base text-primary-dark">Flexible Recurring (4 Weeks)</span>
                  <span className="font-inter font-normal text-xs text-primary-dark">Started On 25 Nov, 2024</span>
                </div>
              </div>

              <div className="w-[35px] h-[35px] border rounded-lg flex justify-center items-center text-primary-line" onClick={() => {}}>
                <img src={Edit3} alt="edit" className="w-[21px] h-[21px] rounded-full object-cover" />
              </div>
            </div>
          </div>

          {/* Pets section */}
          <div className={`mb-4 p-[15px] bg-white rounded-2xl shadow-md`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-[10px]">
                <img src={dogAvatar} alt="pet" className="w-[35px] h-[35px] rounded-lg object-cover" />

                <div className="flex flex-col justify-center">
                  <span className="font-inter font-semibold text-primary-dark text-sm">Bruno</span>
                  <span className="font-inter font-normal text-xs text-primary-dark">Gold Package</span>
                </div>
              </div>

              <button className="items-center justify-center py-2">
                <ChevronRight size={21} className="text-primary-light" />
              </button>
            </div>

            <div className="my-[10px] border-t border-borderLight" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-[10px] w-full">
                <img src={TickbgBlack} alt="pet" className="w-[22px] h-[22px] object-cover" />
                <span className="font-inter font-semibold text-green-dark text-sm">Recurring Bundle</span>

                <div className="ml-auto mr-[10px] flex items-baseline">
                  <span className="font-inter font-semibold text-base text-primary-light">$40</span>
                  <span className="pl-[5px] font-inter font-semibold text-base text-primary-dark">$20</span>
                </div>
              </div>

              <button className="items-center justify-center py-2">
                <img src={Info} alt="info" className="w-[22px] h-[22px] object-cover" />
              </button>
            </div>
          </div>

          {/* Service Details */}
          <div className={`mb-4 p-[15px] bg-white rounded-2xl shadow-md`}>
            <span className="font-inter font-semibold text-base text-primary-dark">Service Details</span>
            <div className="my-[10px] border-t border-borderLight" />

            <div className="flex items-center gap-[10px]">
              <div className="w-[35px] h-[35px] rounded-lg bg-lightGray flex justify-center items-center">
                <img src={ClockGray} alt="clock" className="w-[21px] h-[21px] object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-inter font-semibold text-primary-dark text-sm">Monday | Morning</span>
                <span className="font-inter font-normal text-xs text-primary-dark">Preferred Day & Time</span>
              </div>
            </div>

            <div className="my-[10px] border-t border-borderLight" />
            <div className="flex items-center gap-[10px]">
              <div className="w-[35px] h-[35px] rounded-lg bg-lightGray flex justify-center items-center">
                <img src={ScissorBlack} alt="scissor" className="w-[21px] h-[21px] object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-inter font-semibold text-primary-dark text-sm">Best match groomer</span>
                <span className="font-inter font-normal text-xs text-primary-dark">Requested Groomer</span>
              </div>
            </div>

            <div className="my-[10px] border-t border-borderLight" />
            <div className="flex items-center gap-[10px]">
              <div className="w-[35px] h-[35px] rounded-lg bg-lightGray flex justify-center items-center">
                <img src={MobileVan} alt="mobilevan" className="w-[21px] h-[21px] object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-inter font-semibold text-primary-dark text-sm">Mobile Van</span>
                <span className="font-inter font-normal text-xs text-primary-dark">Service Type</span>
              </div>
            </div>

            <div className="my-[10px] border-t border-borderLight" />
            <div className="flex items-center gap-[10px]">
              <div className="w-[35px] h-[35px] rounded-lg bg-lightGray flex justify-center items-center">
                <img src={Location} alt="location" className="w-[21px] h-[21px] object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-inter font-semibold text-primary-dark text-sm">123 Madison Avenue, Apt 4B</span>
                <span className="font-inter font-normal text-xs text-primary-dark">Service Address</span>
              </div>
            </div>

            <div className="my-[10px] border-t border-borderLight" />
            <div className="flex items-center gap-[10px]">
              <div className="w-[35px] h-[35px] rounded-lg bg-lightGray flex justify-center items-center">
                <img src={CardIcon} alt="card" className="w-[21px] h-[21px] object-cover" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-inter font-semibold text-primary-dark text-sm">Master Card •••••5456</span>
                <span className="font-inter font-normal text-xs text-primary-dark">Credit Card</span>
              </div> 
            </div>
          </div>

       <button className='w-full py-[8px] bg-white border border-primary-line rounded-[10px] flex justify-center items-center mt-2'>
        <span className="font-inter font-semibold text-base text-red">Cancel Recurring Plan</span>
       </button>

        </div>
        {/* Divider */}
        <div className="hidden md:flex justify-center">
          <div className="h-full w-[1px] bg-[#E4E4E4]" />
        </div>

        {/* Right Section */}
        <div className="space-y-4 w-full min-w-0 hidden md:block">
          <SupportItems />
        </div>
      </div>
    </>
  );
};

export default RecurringScheduleDetails;
