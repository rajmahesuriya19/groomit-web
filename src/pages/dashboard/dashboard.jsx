import React, { useState } from 'react'
import SupportItems from '@/common/SupportItems/SupportItems'
import { ChevronRight } from 'lucide-react'

// icons
import RecurringIcon from '../../assets/icon/white-groomit.png';
import CopyIcon from '../../assets/icon/copyy.svg';
import Home from '../../assets/icon/home-selection-a.svg';
import Paw from '../../assets/icon/pet.svg';
import Location from '../../assets/icon/location.svg';
import Share from '../../assets/icon/share-white.svg';
import Calender from '../../assets/icon/calendar-black.svg';
import Scissor from '../../assets/menu-new/scissor-a.svg';
import CatAnimation from '../../assets/animation/Cat Animation.gif';
import DogAnimation from '../../assets/animation/Dog Animation.gif';
import { useSelector } from 'react-redux';
import DashboardCarousel from '@/common/DashboardCarousel/DashboardCarousel';
import { Tooltip } from '@mui/material';

const dashboard = () => {
  const [tooltip, setTooltip] = useState('Click to copy');
  const appointmentID = '#1234567';
  const { user } = useSelector((state) => state.user || {});

  const handleCopy = () => {
    navigator.clipboard.writeText(appointmentID);
    setTooltip('ID Copied!');
    setTimeout(() => setTooltip('Click to copy'), 2000);
  };

  return (
    <>
      <div className='w-full overflow-hidden'>
        <div className='bg-white py-2 px-5 w-full hidden md:block'>
          <div className='font-inter font-bold text-xl text-primary-dark'>{`Hi, ${user?.first_name}`}</div>
          <div className='font-inter font-normal text-sm text-primary-dark'>Ready to pamper your pets?</div>
        </div>

        <div className='bg-white py-2 px-5 w-full block md:hidden'>
          <div className='flex items-center gap-2'>
            <img src={user?.photo} alt="User" className="mr-2 object-cover w-10 h-10 rounded-lg" />
            <div>
              <div className='font-inter font-bold text-lg text-primary-dark'>{`Hi, ${user?.first_name}`}</div>
              <div className='font-inter font-normal text-xs text-primary-dark'>Ready to pamper your pets?</div>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between gap-2 bg-[#0A7170] py-[10px] px-[20px] w-full'>
          <div className='flex items-center gap-2 flex-1 min-w-0'>
            <img src={RecurringIcon} alt="Recurring" className="w-6 h-6 flex-shrink-0" />
            <div className='font-inter font-bold text-sm text-white truncate'>Recurring Plan (Next Billing: 14 July)</div>
          </div>

          <div className='flex-shrink-0'>
            <ChevronRight size={24} className="text-white" />
          </div>
        </div>
      </div>

      <div className="px-5 py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
        <div className="space-y-4">
          <DashboardCarousel />

          {/* First Appointment Card */}
          <div className="rounded-2xl p-1 bg-white shadow-md">
            <div className="bg-[#F2F2F2] rounded-xl py-4 px-6">
              <h3 className="flex items-center font-inter font-bold text-xl">
                <img src={Scissor} className="mr-2 w-6 h-6" alt="Scissor" />
                Let’s get started!
              </h3>
              <p className="font-inter text-sm text-gray-700 mt-2 leading-6">
                Book your first grooming appointment and give your pet the pampering they deserve.
              </p>
              <button className="w-full bg-primary-dark rounded-lg h-12 mt-6 mb-3 text-white font-inter font-bold text-base hover:bg-primary-light transition-all">
                Book Your First Appointment
              </button>
              <p className="font-inter text-[11px] text-gray-500 text-center">
                It only takes a few seconds to book ✨
              </p>
            </div>
          </div>

          {/* Reminder Card */}
          <div className="rounded-2xl p-1 bg-white shadow-md">
            <div className="bg-[#FFF6DB] rounded-xl py-4 px-6">
              <h3 className="text-center font-inter font-bold text-xl">
                Time for Bruno’s Next Grooming!
              </h3>
              <p className="text-center font-inter text-sm mt-2 leading-6 text-gray-700">
                It’s been <span className="text-[#EB5757] font-semibold">4 weeks</span> since Bruno’s last grooming.
                Let’s keep Bruno looking & feeling his best! 🐶
              </p>
              <button className="w-full bg-primary-dark rounded-lg h-12 mt-6 mb-4 text-white font-inter font-bold text-base hover:bg-primary-light transition-all">
                Book Now
              </button>
              <div className="px-2 py-3 bg-white rounded-lg">
                <p className="text-center font-inter text-sm text-primary-dark leading-6">
                  “Golden Retrievers need grooming <span className="font-bold">every 4–6 weeks</span>
                  to prevent matting & skin issues.”
                </p>
                <p className="mt-3 text-center font-inter font-bold text-xs uppercase text-[#3064A3]">
                  — Experts
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-1 bg-white shadow-md">
            <div className="py-3 px-3">
              <h3 className="font-inter font-bold text-base">Add Your Pets</h3>
              <p className="font-inter text-sm text-gray-600 mt-1">
                Tell us about your furry friends 🐾
              </p>

              <div className="flex gap-4 mt-5">
                {/* Dog Card */}
                <div className="flex-1 bg-[#FBFCFC] border border-primary-light rounded-xl p-4 hover:shadow-lg hover:border-primary-dark transition-all cursor-pointer">
                  <h4 className="font-inter font-semibold text-base text-center">Add Dog</h4>
                  <img
                    src={DogAnimation}
                    className="w-full h-[120px] mx-auto object-contain"
                    alt="Dog Animation"
                  />
                </div>

                {/* Cat Card */}
                <div className="flex-1 bg-[#FBFCFC] border border-primary-light rounded-xl p-4 hover:shadow-lg hover:border-primary-dark transition-all cursor-pointer">
                  <h4 className="font-inter font-semibold text-base text-center">Add Cat</h4>
                  <img
                    src={CatAnimation}
                    className="w-full h-[120px] mx-auto object-contain"
                    alt="Cat Animation"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1 py-3 px-3">
              <div className='flex items-center justify-between'>
                <h3 className="font-inter font-bold text-xl">My Pets</h3>
                <p className="flex items-center justify-center font-inter font-normal text-sm text-[#3064A3]">
                  View <ChevronRight size={16} className="text-[#3064A3]" />
                </p>
              </div>
            </div>

            <div className='mb-3 p-4 bg-white rounded-2xl shadow-md'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-3 items-center'>
                  <img src="https://dev.groomit.me/v7/images/sample-up.jpg" className="w-9 h-9 object-cover rounded-[10px] cursor-pointer" alt="Pet Profile"></img>
                  <div>
                    <h4 className="font-inter font-bold text-base cursor-pointer">Bruno</h4>
                    <div className="font-inter font-normal text-sm">Golden Retriever, Large</div>
                  </div>
                </div>

                <button className="px-4 py-2 border border-primary-dark rounded-[10px] text-primary-dark font-inter font-bold text-base">
                  Book
                </button>
              </div>
            </div>

            <div className='mb-3 p-4 bg-white rounded-2xl shadow-md'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-3 items-center'>
                  <img src="https://dev.groomit.me/v7/images/sample-up.jpg" className="w-9 h-9 object-cover rounded-[10px] cursor-pointer" alt="Pet Profile"></img>
                  <div>
                    <h4 className="font-inter font-bold text-base cursor-pointer">Bruno</h4>
                    <div className="font-inter font-normal text-sm">Golden Retriever, Large</div>
                  </div>
                </div>

                <button className="px-4 py-2 border border-primary-dark rounded-[10px] text-primary-dark font-inter font-bold text-base">
                  Book
                </button>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 px-3">
              <h3 className="font-inter font-bold text-xl text-primary-dark">Last Appointment</h3>
            </div>

            <div className="mb-4 p-5 bg-white rounded-2xl shadow-md border-t-[3px] border-[#438B53] transition hover:shadow-lg">
              <div className="flex justify-between items-center">
                <div className='cursor-pointer' onClick={handleCopy}>
                  <Tooltip
                    title={tooltip}
                    arrow
                    placement="top"
                    componentsProps={{
                      tooltip: {
                        sx: {
                          backgroundColor: "black",
                          color: "white",
                          fontSize: 12,
                          padding: "6px 12px",
                          borderRadius: "4px",
                        },
                      },
                      arrow: {
                        sx: {
                          color: "black",
                        },
                      },
                    }}
                  >
                    <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide relative group">
                      {appointmentID}
                      <img
                        src={CopyIcon}
                        alt="Copy"
                        className="w-3 h-3 cursor-pointer opacity-80 hover:opacity-100 transition"
                      />
                    </div>
                  </Tooltip>
                  <p className="font-inter font-bold text-base text-gray-800 mt-1">
                    Appointment Completed
                  </p>
                </div>
                <ChevronRight size={24} className="text-primary-dark" />
              </div>

              <div className="flex items-start mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg me-3 w-[40px] h-[40px]">
                  <img src={Calender} alt="Calendar" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-inter font-bold text-primary-dark text-sm">
                    Thu, Jan 23 ETA 3:30 PM – 4:30 PM
                  </p>
                  <p className="font-inter text-xs text-gray-500 mt-1">Requested Time</p>
                </div>
              </div>

              <div className="flex items-start mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg me-3 w-[40px] h-[40px]">
                  <img src={Home} alt="Calendar" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-inter font-bold text-primary-dark text-sm">
                    In Home
                  </p>
                  <p className="font-inter text-xs text-gray-500 mt-1">Service Type</p>
                </div>
              </div>

              <div className="flex items-start mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg me-3 w-[40px] h-[40px]">
                  <img src={Paw} alt="Calendar" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-inter font-bold text-primary-dark text-sm">
                    scooby, oiioii
                  </p>
                  <p className="font-inter text-xs text-gray-500 mt-1">Pets to be Groomed</p>
                </div>
              </div>

              <div className="flex items-start mt-4 pt-3 border-t border-gray-200">
                <div className="flex justify-center items-center bg-[#F9FAFB] rounded-lg me-3 w-[40px] h-[40px]">
                  <img src={Location} alt="Calendar" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-inter font-bold text-primary-dark text-sm">
                    11 West 42nd Street, New York, NY, USA, New York
                  </p>
                  <p className="font-inter text-xs text-gray-500 mt-1">Service Address</p>
                </div>
              </div>
            </div>
          </div>
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
  )
}

export default dashboard