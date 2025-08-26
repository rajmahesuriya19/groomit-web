import React, { useEffect, useState } from 'react';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import Tooltip from "@mui/material/Tooltip";
import Edit2 from '../../assets/icon/edit.svg';
import Mail from '../../assets/icon/sms-red.svg';
import Phone from '../../assets/icon/phone-red.svg';
import Info from '../../assets/icon/info-circle-yellow.svg';
import infoRed from '../../assets/icon/info-circle.svg';
import infoGrey from '../../assets/icon/info-circle-grey.svg';
import heartFilled from '../../assets/icon/heart-fill.svg';
import heartGrey from '../../assets/icon/heart-grey.svg';
import blocked from '../../assets/icon/blocked.svg';
import Message from '../../assets/icon/messages-red.svg';
import FeedbackIcon from '../../assets/icon/red-star.svg';
import PasswordIcon from '../../assets/icon/red-lock.svg';
import Share from '../../assets/icon/share.svg';
import LogOut from '../../assets/icon/logout.svg';
import Add from '../../assets/icon/add-blue.svg';
import Location from '../../assets/icon/location-red.svg';
import Card from '../../assets/icon/card-red.svg';
import FillStar from '../../assets/icon/fill-star.svg';
import Visa from '../../assets/cards/Visa-light.svg';
import JCB from '../../assets/cards/jcb-icon.svg';
import MasterCard from '../../assets/cards/mastercard-icon.svg';
import Fallback from '../../assets/cards/fall-card.svg';
import Earn from '../../assets/images/earn-image.svg';
import { useNavigate } from 'react-router';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '@/utils/store/slices/userInfo/userInfoSlice';
import { toast } from 'react-toastify';
import { fetchPaymentCards } from '@/utils/store/slices/paymentCards/paymentCardSlice';
import { logoutUser } from '@/utils/store/slices/auth/authSlice';
import { formatPhoneNumber } from '@/common/helpers';
import { fetchAddresses } from '@/utils/store/slices/serviceAddressList/serviceAddressListSlice';
import { addGroomerFav, getGroomersList, removeGroomerFav, toggleFavLocal } from '@/utils/store/slices/groomersList/groomersListSlice';

const supportItems = [
  { label: 'FAQs', icon: infoRed },
  { label: 'Cancelation Policy', icon: infoRed },
  { label: 'Live Chat', icon: Message },
  { label: 'Give us feedback', icon: FeedbackIcon },
  { label: 'Change Password', icon: PasswordIcon },
];

const cardIcons = {
  visa: Visa,
  mastercard: MasterCard,
  jcb: JCB,
};

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [tooltipText, setTooltipText] = useState("Click to Copy");

  const users = useSelector((state) => state.user.user);
  const groomers = useSelector((state) => state.groomers.groomers);
  const addresses = useSelector((state) => state.addresses.addresses);
  const cards = useSelector((state) => state.cards.cards);
  const isEditMode = true;

  const handleClick = () => {
    navigator.clipboard.writeText("SANTIAGO123");
    setTooltipText("Clicked");

    setTimeout(() => {
      setTooltipText("Click to Copy");
    }, 2000);
  };

  const handleFav = (id, isFav) => {
    dispatch(toggleFavLocal(id));

    if (isFav) {
      dispatch(removeGroomerFav(id));
    } else {
      dispatch(addGroomerFav(id));
    }
  };

  const handleLogout = async () => {
    showLoader();
    try {
      await dispatch(logoutUser()).unwrap();
      hideLoader();
      navigate('/')
      toast.success('Logout successful 🎉');
    } catch (error) {
      console.error('Logout failed:', error.message);
      hideLoader();
    }
  };

  useEffect(() => {
    dispatch(getGroomersList());
    dispatch(getUserInfo());
    dispatch(fetchAddresses());
    dispatch(fetchPaymentCards());
  }, [dispatch]);


  return (
    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-[auto_auto_auto] gap-6">
      {/* Left Section */}
      <div className="space-y-4">
        <div>
          <div className="hidden md:flex justify-between items-center mb-6">
            <h2 className="mb-3 text-xl font-bold text-primary-dark leading-[100%] tracking-[-0.01em]">
              My Account
            </h2>
            <div className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-brand px-3 py-2">
              <p className="text-[10px] font-bold text-white leading-none tracking-normal">
                CREDITS
              </p>
              <p className="text-lg font-bold text-white leading-none tracking-[-0.01em]">
                $518
              </p>
            </div>
          </div>

          <div className="md:mx-0 -mx-4 -my-4 mb-6">
            <div className="flex md:hidden items-center justify-between bg-white px-5 py-4 h-[64px] w-full">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center"
              >
                <ChevronLeft size={24} className="text-primary-light" />
              </button>

              <h2 className="text-xl font-['Filson Soft'] font-bold text-primary-dark leading-[100%] tracking-[-0.01em] capitalize">
                My Account
              </h2>

              <div className="w-[62px] h-[38px] bg-brand rounded-[5px] px-2 py-1 flex flex-col justify-center items-center gap-[2px]">
                <span className="text-[8px] font-bold text-white leading-none tracking-[0px]">
                  CREDITS
                </span>
                <span className="text-sm font-bold text-white leading-none tracking-[-0.01em]">
                  $518
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div
          className="bg-white rounded-[15px] shadow-md flex justify-center items-start px-4 py-3"
          style={{ height: '113px' }}
        >
          {/* Avatar */}
          <img
            src={users?.photo}
            alt="Profile"
            className="rounded-full w-[82px] h-[82px]"
          />

          {/* Profile Text */}
          <div className="flex-1 ml-4 flex flex-col gap-[4px]">
            <h2
              className="text-xl font-bold text-primary-dark leading-[100%] tracking-[-0.01em]"
            >
              {users?.name}
            </h2>
            <div className="flex items-center text-sm text-gray-700 space-x-2 mt-1">
              <img
                src={Mail}
                alt="Mail"
                className="w-[20px] h-[20px]"
              />
              <span className="text-sm font-normal text-primary-dark leading-[100%] tracking-[-0.01em]">
                {users?.email}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-700 space-x-2 mt-1">
              <img
                src={Phone}
                alt="Phone"
                className="w-[20px] h-[20px]"
              />
              <span className="text-sm font-medium text-primary-dark leading-[100%] tracking-[-0.01em]">
                {formatPhoneNumber(users?.phone)}
              </span>
              {users?.is_phone_verified !== true && <img
                src={Info}
                alt="Info"
                className="w-[20px] h-[20px]"
              />}
            </div>
          </div>

          {/* Edit Icon */}
          <button
            onClick={() => navigate(isEditMode ? `/user/account/edit/${users?.user_id}` : "/user/account/create")}
          >
            <img
              src={Edit2}
              alt="Edit"
              className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] lg:w-[35px] lg:h-[35px]"
            />
          </button>
        </div>

        {/* Add Service Address */}
        {addresses?.length > 0 ? (
          // If addresses exist
          <div className="rounded-[15px] shadow-md bg-white p-[15px] flex flex-col gap-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#BEC3C5]">
              <div className="flex items-center justify-center gap-1">
                <img
                  src={Location}
                  alt="Location Icon"
                  className="w-[24px] h-[24px]"
                />
                <h3 className="text-base font-bold text-primary-dark leading-[100%] tracking-[0]">
                  Addresses
                </h3>
              </div>
              <button className="flex items-center justify-center gap-1" onClick={() => navigate("/user/address/add")}>
                <img
                  src={Add}
                  alt="Add Icon"
                  className="w-[15px] h-[15px]"
                />
                <span className="text-sm font-normal text-right text-[#3064A3] leading-[100%] tracking-[-0.01em]">
                  Add
                </span>
              </button>
            </div>

            {addresses.map((item, index) => (
              <div
                key={item?.address_id}
                className={`flex justify-between items-start pt-2 ${index !== addresses.length - 1 ? 'pb-2 border-b border-[#F2F2F2]' : 'pb-0'
                  }`}
              >
                <div className="flex flex-col w-[220px] gap-1">
                  <span className="text-sm font-bold text-primary-dark leading-[18px] font-inter">
                    {item?.address1} {item?.address2}
                  </span>
                  <span className="text-sm font-normal text-primary-dark leading-[18px] font-inter">
                    {item?.city}, {item?.state} {item?.zip}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item?.default_address == "Y" && <div className="bg-[#28B446] text-white text-[10px] font-bold uppercase rounded-full px-[6px] h-[18px] flex items-center justify-center font-inter">
                    Default
                  </div>}
                  <button
                    onClick={() => navigate(`/user/address/edit/${item?.address_id}`)}
                  >
                    <ChevronRight size={24} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[15px] shadow-md bg-white p-[15px] flex items-center justify-center">
            <div className="w-full bg-[#F1F1F1] rounded-[10px] px-[15px] py-[15px] flex items-center justify-between">
              <div className="flex flex-col gap-[4px]">
                <h3 className="text-primary-dark text-base font-bold leading-[100%] tracking-[0%]">
                  Add Service Address
                </h3>
                <p className="text-primary-light text-sm font-normal leading-[100%] tracking-[-0.01em]">
                  You can Add Multiple Service addresses
                </p>
              </div>
              <button className="bg-brand text-white rounded-[10px] flex items-center justify-center p-[10px]" onClick={() => navigate("/user/address/add")}>
                <Plus size={20} />
              </button>
            </div>
          </div>
        )}


        {/* Add Card */}
        {cards?.length > 0 ? (
          // If Card exist
          <div className="rounded-[15px] shadow-md bg-white p-[15px] flex flex-col gap-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#BEC3C5]">
              <div className="flex items-center justify-center gap-1">
                <img
                  src={Card}
                  alt="Card Icon"
                  className="w-[24px] h-[24px]"
                />
                <h3 className="text-base font-bold text-primary-dark leading-[100%] tracking-[0]">
                  Payment Methods
                </h3>
              </div>
              <button className="flex items-center justify-center gap-1" onClick={() => navigate("/user/card/add")}>
                <img
                  src={Add}
                  alt="Add Icon"
                  className="w-[15px] h-[15px]"
                />
                <span className="text-sm font-normal text-right text-[#3064A3] leading-[100%] tracking-[-0.01em]">
                  Add
                </span>
              </button>
            </div>

            {cards.map((item, index) => (
              <div
                key={item.label}
                className={`flex justify-between items-center pt-2 ${index !== cards.length - 1 ? 'pb-2 border-b border-[#F2F2F2]' : 'pb-0'
                  }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <img
                    src={cardIcons[item.card_provider?.toLowerCase()] || Fallback}
                    alt={item.card_provider || "Card"}
                    className="w-[47px] h-[28px]"
                  />
                  <div className="flex flex-col gap-1 w-[219px]">
                    <span className="text-sm font-bold text-primary-dark leading-[22px] tracking-[-0.01em] font-inter">
                      {`Ending with ${item.card_number}`}
                    </span>
                    {!item.verified_at ? (
                      <span className="text-sm font-normal text-primary-dark leading-[22px] tracking-[-0.01em] font-inter">
                        {item.card_holder}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 py-[2px] rounded-[4px] w-fit">
                        <img src={Info} alt="Info" className="w-[16px] h-[16px]" />
                        <span className="text-xs font-semibold text-[#ED9F00] leading-[14px] tracking-[0] font-inter">
                          NOT VERIFIED
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item?.default_card === "Y" && <div className="bg-[#28B446] text-white text-[10px] font-bold uppercase rounded-full px-[6px] h-[18px] flex items-center justify-center font-inter">
                    Default
                  </div>}
                  <button
                    onClick={() => navigate(!item?.card_holder ? "/user/card/edit/1" : `/user/card/view/${item?.billing_id}`)}
                  >
                    <ChevronRight size={24} className="text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) :
          (<div
            className="bg-white rounded-[15px] shadow-md p-[15px] flex items-center justify-center"
          >
            <div className="w-full bg-[#F1F1F1] rounded-[10px] px-[15px] py-[15px] flex items-center justify-between">
              <div className="flex flex-col gap-[4px]">
                <h3 className="text-primary-dark text-base font-bold leading-[100%] tracking-[0%]">
                  Add a Debit/Credit Card
                </h3>
                <p className="text-primary-light text-sm font-normal leading-[100%] tracking-[-0.01em]">
                  Add Visa, Mastercard, AMEX, Discover
                </p>
              </div>
              <button className="bg-brand text-white rounded-[10px] flex items-center justify-center p-[10px]" onClick={() => navigate("/user/card/add")}>
                <Plus size={20} />
              </button>
            </div>
          </div>)}

        {/* Add Groomers List */}
        {groomers?.length > 0 && (
          // If Groomer exist
          <div className="rounded-[15px] shadow-md bg-white p-[15px] flex flex-col gap-3">
            <div className="flex justify-between items-center pb-3 border-b border-[#BEC3C5]">
              <div className="flex items-center justify-center gap-1">
                <h3 className="text-base font-bold text-primary-dark leading-[100%] tracking-[0]">
                  My Groomers
                </h3>
              </div>
            </div>

            {groomers.map((item, index) => (
              <div
                key={item.name}
                className={`flex justify-between items-center pt-2 ${index !== groomers.length - 1 ? 'pb-2 border-b border-[#F2F2F2]' : 'pb-0'
                  }`}
              >
                <div className="flex items-center gap-2 w-full">
                  {item.profile_photo_url && (
                    <img
                      src={item.profile_photo_url}
                      alt={item.name}
                      className="rounded-full w-[48px] h-[48px]"
                    />
                  )}
                  <div className="flex flex-col gap-1 w-[219px]">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-primary-dark leading-[22px] tracking-[-0.01em] font-inter">
                        {item.name}
                      </span>
                      <img
                        src={infoGrey}
                        alt="Info"
                        className="w-[20px] h-[20px]"
                      />
                    </div>
                    {(item.rating_avg || item.rating_qty) && (
                      <div className="flex items-center gap-1 bg-primary-dark rounded-[25px] px-[6px] py-[4px] w-[85px]">
                        {item.rating_avg && (
                          <>
                            <img src={FillStar} alt="Rating" className="w-[10px] h-[11px]" />
                            <span className="text-xs font-bold text-white leading-[11px] tracking-[0]">
                              {item.rating_avg}
                            </span>
                          </>
                        )}

                        {item.rating_qty && (
                          <span className="text-xs font-bold text-white leading-[11px] tracking-[0]">
                            {item.rating_avg ? `| ${item.rating_qty}` : item.rating_qty}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {item.blocked_by ? (
                  <button className="cursor-pointer">
                    <img
                      src={blocked}
                      alt="Blocked"
                      className="w-[34px] h-[34px]"
                    />
                  </button>
                ) : (
                  <button
                    key={item.groomer_id}
                    className="cursor-pointer"
                    onClick={() => handleFav(item.groomer_id, item.is_fav_groomer)}
                  >
                    <img
                      src={!item.is_fav_groomer ? heartGrey : heartFilled}
                      alt={!item.is_fav_groomer ? "Not Favourite" : "Favourite"}
                      className="w-[34px] h-[34px]"
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
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
            <h3 className="text-base font-bold text-primary-dark leading-[100%] tracking-[0]">
              Support
            </h3>
            <span className="text-sm font-normal text-right text-primary-light leading-[100%] tracking-[-0.01em]">
              Have Questions?
            </span>
          </div>

          {supportItems.map((item, index) => (
            <div
              key={item.label}
              className={`flex justify-between items-center cursor-pointer pt-3 ${index !== supportItems.length - 1 ? 'pb-3 border-b border-[#F2F2F2]' : 'pb-0'}`}
            >
              <div className="flex items-center gap-2">
                <img src={item.icon} alt={item.label} className="w-6 h-6" />
                <span className="text-sm font-bold text-primary-dark tracking-[-0.01em] font-inter">
                  {item.label}
                </span>
              </div>
              <ChevronRight size={24} className="text-gray-400" />
            </div>
          ))}
        </div>

        {/* Share & Earn */}
        <div className="bg-white rounded-2xl p-4 shadow-md flex md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full">
            <h3 className="text-xl font-bold text-primary-dark leading-[100%] tracking-[0]">
              Share & Earn
            </h3>
            <p className="text-base font-medium text-primary-light leading-[100%] tracking-[0] font-inter py-1">
              Refer a Friend & both receive{' '}
              <span className="text-brand font-semibold font-inter tracking-[0]">
                $10 Credits
              </span>
            </p>

            <Tooltip
              title={tooltipText}
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
              <div
                onClick={handleClick}
                className="max-w-[172px] h-[38px] flex items-center justify-center gap-2 mt-2 border border-[#BEC3C5] px-4 py-1 rounded-full cursor-pointer"
              >
                <img src={Share} alt="Share Icon" className="w-[24px] h-[24px]" />
                <p className="text-base font-semibold text-primary-dark font-inter text-center">
                  SANTIAGO123
                </p>
              </div>
            </Tooltip>
          </div>

          <div className="w-full max-w-[130px] md:w-[130px] md:h-[130px] flex-shrink-0">
            <img
              src={Earn}
              alt="Share & Earn"
              className="w-full h-auto object-contain mx-auto"
            />
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl p-4 shadow-md flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <img src={LogOut} alt="Logout" className="w-6 h-6" />
            <span className="text-sm font-bold text-primary-dark tracking-[-0.01em] font-inter">
              Log Out
            </span>
          </div>
          <button onClick={handleLogout}>
            <ChevronRight size={24} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
