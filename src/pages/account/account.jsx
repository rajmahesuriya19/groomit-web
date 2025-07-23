import React, { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import avatar from '../../assets/icon/user-big.svg';
import Edit2 from '../../assets/icon/edit.svg';
import Mail from '../../assets/icon/sms-red.svg';
import Phone from '../../assets/icon/phone-red.svg';
import Info from '../../assets/icon/info-circle-yellow.svg';
import infoRed from '../../assets/icon/info-circle.svg';
import Message from '../../assets/icon/messages-red.svg';
import FeedbackIcon from '../../assets/icon/red-star.svg';
import PasswordIcon from '../../assets/icon/red-lock.svg';
import Share from '../../assets/icon/share.svg';
import LogOut from '../../assets/icon/logout-red.svg';
import Add from '../../assets/icon/add-blue.svg';
import Location from '../../assets/icon/location-red.svg';
import Earn from '../../assets/images/earn-image.svg';

const supportItems = [
  { label: 'FAQs', icon: infoRed },
  { label: 'Cancelation Policy', icon: infoRed },
  { label: 'Live Chat', icon: Message },
  { label: 'Give us feedback', icon: FeedbackIcon },
  { label: 'Change Password', icon: PasswordIcon },
];

const addressItems = [
  { title: 'Health Services 726 Broadway', label: 'New York, NY 10012' },
  { title: '34 Long address with a lot of characters Kevorkian 50 Washington', label: 'New York, NY 10012' },
];

const Account = () => {
  const [hasServiceAddress, setHasServiceAddress] = useState(true);

  return (
    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-[auto_auto_auto] gap-6">
      {/* Left Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-[20px] font-bold text-[#2E2E2E] leading-[100%] tracking-[-0.01em]"
          >
            My Account
          </h2>

          <div className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-[#FF314A] px-3 py-2">
            <p className="text-[10px] font-bold text-white leading-none tracking-normal">
              CREDITS
            </p>
            <p className="text-[18px] font-bold text-white leading-none tracking-[-0.01em]">
              $518
            </p>
          </div>
        </div>
        {/* Profile Card */}
        <div
          className="bg-white rounded-[15px] shadow-md flex justify-center items-start px-4 py-3"
          style={{ height: '113px' }}
        >
          {/* Avatar */}
          <img
            src={avatar}
            alt="Profile"
            className="w-[82px] h-[82px]"
          />

          {/* Profile Text */}
          <div className="flex-1 ml-4 flex flex-col gap-[4px]">
            <h2
              className="text-[20px] font-bold text-[#2E2E2E] leading-[100%] tracking-[-0.01em]"
            >
              Andrew Smith
            </h2>
            <div className="flex items-center text-sm text-gray-700 space-x-2 mt-1">
              <img
                src={Mail}
                alt="Mail"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[14px] font-normal text-[#2E2E2E] leading-[100%] tracking-[-0.01em]">
                andrewsmith123@mail.com
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-700 space-x-2 mt-1">
              <img
                src={Phone}
                alt="Phone"
                className="w-[20px] h-[20px]"
              />
              <span className="text-[14px] font-medium text-[#2E2E2E] leading-[100%] tracking-[-0.01em]">
                +123 456 7890
              </span>
              <img
                src={Info}
                alt="Info"
                className="w-[20px] h-[20px]"
              />
            </div>
          </div>

          {/* Edit Icon */}
          <img
            src={Edit2}
            alt="Edit"
            className="w-[35px] h-[35px]"
          />
        </div>

        {/* Add Service Address */}
        {hasServiceAddress ? (
          // If addresses exist
          <div className="rounded-[15px] shadow-md bg-white p-[15px] flex flex-col gap-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#BEC3C5]">
              <div className="flex items-center justify-center gap-1">
                <img
                  src={Location}
                  alt="Location Icon"
                  className="w-[24px] h-[24px]"
                />
                <h3 className="text-[16px] font-bold text-[#2E2E2E] leading-[100%] tracking-[0]">
                  Addresses
                </h3>
              </div>
              <button className="flex items-center justify-center gap-1">
                <img
                  src={Add}
                  alt="Add Icon"
                  className="w-[15px] h-[15px]"
                />
                <span className="text-[14px] font-normal text-right text-[#3064A3] leading-[100%] tracking-[-0.01em]">
                  Add
                </span>
              </button>
            </div>

            {addressItems.map((item, index) => (
              <div
                key={item.label}
                className={`flex justify-between items-center pt-2 ${index !== addressItems.length - 1 ? 'pb-2 border-b border-[#F2F2F2]' : 'pb-0'
                  }`}
              >
                <div className="flex flex-col gap-1 w-[219px]">
                  <span className="text-[14px] font-medium text-[#2E2E2E] leading-[22px] tracking-[-0.01em] font-inter">
                    {item.title}
                  </span>
                  <span className="text-[14px] font-normal text-[#2E2E2E] leading-[22px] tracking-[-0.01em] font-inter">
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={24} className="text-gray-400" />
              </div>
            ))}

          </div>
        ) : (
          <div className="rounded-[15px] shadow-md bg-white p-[15px] flex items-center justify-center">
            <div className="w-full bg-[#F1F1F1] rounded-[10px] px-[15px] py-[15px] flex items-center justify-between">
              <div className="flex flex-col gap-[4px]">
                <h3 className="text-[#2E2E2E] text-[16px] font-bold leading-[100%] tracking-[0%]">
                  Add Service Address
                </h3>
                <p className="text-[#7C868A] text-[14px] font-normal leading-[100%] tracking-[-0.01em]">
                  You can Add Multiple Service addresses
                </p>
              </div>
              <button className="bg-[#FF314A] text-white rounded-[10px] flex items-center justify-center p-[10px]">
                <Plus size={20} />
              </button>
            </div>
          </div>
        )}


        {/* Add Card */}
        <div
          className="bg-white rounded-[15px] shadow-md p-[15px] flex items-center justify-center"
        >
          <div className="w-full bg-[#F1F1F1] rounded-[10px] px-[15px] py-[15px] flex items-center justify-between">
            <div className="flex flex-col gap-[4px]">
              <h3 className="text-[#2E2E2E] text-[16px] font-bold leading-[100%] tracking-[0%]">
                Add a Debit/Credit Card
              </h3>
              <p className="text-[#7C868A] text-[14px] font-normal leading-[100%] tracking-[-0.01em]">
                Add Visa, Mastercard, AMEX, Discover
              </p>
            </div>
            <button className="bg-[#FF314A] text-white rounded-[10px] flex items-center justify-center p-[10px]">
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Divider Section */}
      <div className="hidden md:flex justify-center">
        <div className="h-full w-[1px] bg-[#C9CFD4]" />
      </div>

      {/* Right Section */}
      <div className="space-y-4">
        {/* Support List */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex justify-between items-center pb-3 border-b border-[#BEC3C5]">
            <h3 className="text-[16px] font-bold text-[#2E2E2E] leading-[100%] tracking-[0]">
              Support
            </h3>
            <span className="text-[14px] font-normal text-right text-[#7C868A] leading-[100%] tracking-[-0.01em]">
              Have Questions?
            </span>
          </div>

          {supportItems.map((item, index) => (
            <div
              key={item.label}
              className={`flex justify-between items-center pt-3 ${index !== supportItems.length - 1 ? 'pb-3 border-b border-[#F2F2F2]' : 'pb-0'
                }`}
            >
              <div className="flex items-center gap-2">
                <img src={item.icon} alt={item.label} className="w-[24px] h-[24px]" />
                <span className="text-[14px] font-bold leading-[100%] tracking-[-0.01em] text-[#2E2E2E] font-inter">
                  {item.label}
                </span>
              </div>
              <ChevronRight size={24} className="text-gray-400" />
            </div>
          ))}
        </div>


        {/* Share & Earn */}
        <div className="bg-white rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <h3 className="text-[20px] font-bold text-[#2E2E2E] leading-[100%] tracking-[0]">
              Share & Earn
            </h3>
            <p className="text-[16px] font-medium text-[#7C868A] leading-[100%] tracking-[0] font-inter py-1">
              Refer a Friend & both receive{' '}
              <span className="text-[#FF314A] font-semibold font-inter leading-[100%] tracking-[0]">
                $10 Credits
              </span>
            </p>
            <div className="w-[172px] h-[38px] flex items-center justify-center gap-[5px] mt-2 border border-[#BEC3C5] px-4 py-1 rounded-full text-sm font-medium tracking-wide">
              <img src={Share} alt="Share Icon" className="w-[24px] h-[24px]" />
              <p className="text-[16px] font-semibold text-[#2E2E2E] leading-[100%] tracking-[0] font-inter text-center">
                SANTIAGO123
              </p>
            </div>
          </div>
          <img src={Earn} alt="Share & Earn" className="w-[130px] h-[130px] object-contain" />
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LogOut} alt="Logout" className="w-[24px] h-[24px]" />
            <span className="text-[14px] font-bold leading-[100%] tracking-[-0.01em] text-[#2E2E2E] font-inter">
              Log Out
            </span>
          </div>
          <ChevronRight size={24} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Account;
