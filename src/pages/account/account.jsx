import React, { useEffect, useState } from 'react';
import { Plus, ChevronRight, ChevronLeft, PlusIcon } from 'lucide-react';
import Tooltip from "@mui/material/Tooltip";
import Edit2 from '../../assets/icon/edit-3.svg';
import Paw from '../../assets/icon/pet.svg';
import LocationBlack from '../../assets/icon/location.svg';
import CardBlack from '../../assets/icon/card.svg';
import AddDog from '../../assets/icon/add-dog.svg';
import AddCat from '../../assets/icon/add-cat.svg';
import Mail from '../../assets/icon/sms-red.svg';
import Phone from '../../assets/icon/phone-red.svg';
import Info from '../../assets/icon/info-circle-yellow.svg';
import infoGrey from '../../assets/icon/info-circle-grey.svg';
import heartFilled from '../../assets/icon/heart-fill.svg';
import heartGrey from '../../assets/icon/heart-grey.svg';
import blocked from '../../assets/icon/blocked.svg';
import PasswordIcon from '../../assets/icon/lock-black.svg';
import Notification from '../../assets/icon/notification-black.svg';
import Share from '../../assets/icon/share.svg';
import ShareWhite from '../../assets/icon/share-white.svg';
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
import FallbackGroomer from '../../assets/icon/user-photo-image.png';
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
import GroomerDetailsModal from '@/components/Modals/GroomerDetailsModal';
import SupportItems from '@/common/SupportItems/SupportItems';
import { Box } from '@mui/material';
import { getPetList } from '@/utils/store/slices/petList/petListSlice';
import AddPetsModal from '@/components/Modals/AddPetsModal';
import { Link } from 'react-router-dom';

const settingItems = [
  { label: 'Notification', icon: Notification, href: "/user/notifications-preferences" },
  { label: 'Change Password', icon: PasswordIcon, href: "/user/account/password/change" },
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
  const [groomerModal, setGroomerModal] = useState(false);
  const [selectedGroomer, setSelectedGroomer] = useState(null);
  const [petsModal, setPetsModal] = useState(false);

  const { dashboard } = useSelector((state) => state.dashboard);
  const { user } = dashboard;

  const {
    dogPets = [],
    catPets = [],
  } = useSelector((state) => state.pets.pets || {});

  const hasAnyPet = dogPets?.length > 0 || catPets?.length > 0;
  const allPets = [...dogPets, ...catPets];

  const users = useSelector((state) => state.user.user);
  const groomers = useSelector((state) => state.groomers.groomers);
  const addresses = useSelector((state) => state.addresses.addresses);
  const cards = useSelector((state) => state.cards.cards);
  const isEditMode = true;

  // get the selected/default address
  const selectedAddress = addresses.find(addr => addr?.default_address === "Y")
    || addresses[0];

  const selectedCard = cards.find(c => c?.default_card === "Y") || cards[0];

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
    const fetchData = async () => {
      try {
        showLoader();

        await Promise.all([
          dispatch(getGroomersList()),
          dispatch(getPetList()),
          dispatch(getUserInfo()),
          dispatch(fetchAddresses()),
          dispatch(fetchPaymentCards()),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [dispatch]);

  // Create dynamic preview text
  const getPetNamesPreview = () => {
    if (!allPets.length) return "";

    const names = allPets.map(pet => pet?.name);

    if (names.length <= 4) return names.join(", ");

    const visibleNames = names.slice(0, 4).join(", ");
    const extraCount = names.length - 4;

    return `${visibleNames} +${extraCount} More`;
  };

  const getSelectedAddressName = () => {
    if (!selectedAddress) return "";

    const a = selectedAddress;

    return `${a?.address1 || ""} ${a?.address2 || ""}, ${a?.city || ""}, ${a?.state || ""} ${a?.zip || ""}`.trim();
  };

  const getSelectedCardText = () => {
    if (!selectedCard) return "";

    const brand = selectedCard?.payment_type_name || "Card";
    const last4 = selectedCard?.card_number || "";

    return `${brand} **** ${last4}`;
  };

  return (
    <>
      <div className='hidden md:flex bg-white items-center justify-between overflow-hidden w-full' style={{
        padding: '10px 45px 10px 20px'
      }}>
        <div>
          <div className='font-filson font-bold text-xl text-primary-dark'>My Account</div>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 rounded-[12px] bg-primary-dark p-2">
          <p className="text-xs font-bold text-white leading-none font-inter tracking-normal">
            CREDITS
          </p>
          <p className="text-base font-bold text-white leading-none font-inter tracking-[-0.01em]">
            ${user?.available_credit}.00
          </p>
        </div>
      </div>

      <div className="gap-4 grid grid-cols-1 md:gap-8 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] px-5 py-[18px]">
        {/* Left Section */}
        <div className="space-y-4">
          {/* Profile Card */}
          <div
            className="bg-white rounded-[15px] flex p-[15px]"
          >
            {/* Avatar */}
            {users?.photo ? (<img
              src={users?.photo}
              alt="Profile"
              className="h-[80px] rounded-[10px] w-[80px]"
            />) : (<img
              src='https://groomit.me/v6/images/profile-avatar.svg'
              alt="Profile"
              className="h-[80px] rounded-[10px] w-[80px]"
            />)}

            {/* Profile Text */}
            <div className="flex flex-1 flex-col gap-2 ml-4 self-center">
              <h2
                className="text-base font-bold text-primary-dark leading-[100%] tracking-[-0.01em]"
              >
                {users?.name}
              </h2>
              <div className="flex items-center text-sm text-gray-700 space-x-2 mt-1">
                <span className="text-sm font-normal text-primary-dark leading-[100%] tracking-[-0.01em]">
                  {formatPhoneNumber(users?.phone)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-700 space-x-2 mt-1">
                <span className="text-sm font-normal text-primary-dark leading-[100%] tracking-[-0.01em]">
                  {users?.email}
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
              className='h-full p-[7px] border border-primary-line rounded-[10px] mt-1'
            >
              <img
                src={Edit2}
                alt="Edit"
                // className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] lg:w-[35px] lg:h-[35px]"
                className="w-[22px] h-[22px]"
              />
            </button>
          </div>

          {/* Refer Box */}
          <Box className="shadow-md overflow-hidden h-[136px] rounded-[15px] border-[5px] border-white bg-[#E4F5FF]" style={{
            padding: '20px 5px 20px 0px'
          }}>
            <Box className={`w-full h-full`}>
              <div className="bg-[#E4F5FF] rounded-xl pt-4 px-6 h-full">
                <div className='flex justify-between items-center h-full'>
                  <div>
                    <h3 className="flex items-center font-inter font-bold text-base">
                      Refer a Friend
                    </h3>
                    <p className="font-inter text-base text-primary-dark">
                      And Both Receive <span className='text-[#3064A3]'>$25 Credits</span>
                    </p>
                    <button className="flex items-center justify-center gap-2 w-[170px] bg-primary-dark rounded-[10px] h-[38px] my-3 text-white font-inter font-bold text-base">
                      #GROOM123 <img src={ShareWhite} className="w-6 h-6" alt="Share" />
                    </button>
                  </div>

                  <div>
                    <img src="https://groomit.me/v7/images/webapp/icons/banner-cat.svg" alt="Cat" />
                  </div>
                </div>
              </div>
            </Box>
          </Box>

          {/* Add-pet Section */}
          {hasAnyPet ? (
            <div className='flex justify-between items-center p-[15px] self-stretch rounded-[15px] bg-white'>
              <div className='flex flex-col gap-3'>
                <div className='flex gap-2 items-center'>
                  <img src={Paw} alt="Cat" className='w-[26px] h-[26px]' />
                  <div className='text-base font-bold capitalize '>My Pets</div>
                </div>

                <div className='text-sm font-normal capitalize'>
                  {getPetNamesPreview()}
                </div>
              </div>

              <div>
                <ChevronRight
                  size={24}
                  className="text-primary-light cursor-pointer"
                  onClick={() => navigate("/user/pet/list")}
                />
              </div>
            </div>
          ) : (
            <div className='flex justify-between items-center p-[15px] self-stretch rounded-[15px] bg-white'>
              <div className='flex gap-2 items-center'>
                <img src={Paw} alt="Cat" className='w-[26px] h-[26px]' />
                <div className='text-base font-bold capitalize '>Add Pet</div>
              </div>

              <div className='cursor-pointer' onClick={() => setPetsModal(true)}>
                <PlusIcon size={24} />
              </div>
            </div>
          )}

          {/* Add Service Address */}
          {addresses?.length > 0 ? (
            <div className='flex justify-between items-center p-[15px] self-stretch rounded-[15px] bg-white'>
              <div className='flex flex-col gap-3'>
                <div className='flex gap-2 items-center'>
                  <img src={LocationBlack} alt="LocationBlack" className='w-[26px] h-[26px]' />
                  <div className='text-base font-bold capitalize '>Service Address</div>
                </div>

                <div className='text-sm font-normal capitalize'>
                  {getSelectedAddressName()}
                </div>
              </div>

              <div>
                <ChevronRight
                  size={24}
                  className="text-primary-light cursor-pointer"
                  onClick={() => navigate("/user/address")}
                />
              </div>
            </div>
          ) : (
            <div className='flex justify-between items-center p-[15px] self-stretch rounded-[15px] bg-white cursor-pointer' onClick={() => navigate("/user/address/add")}>
              <div className='flex gap-2 items-center'>
                <img src={LocationBlack} alt="LocationBlack" className='w-[26px] h-[26px]' />
                <div className='text-base font-bold capitalize '>Add Service Address</div>
              </div>
              <div>
                <PlusIcon size={24} />
              </div>
            </div>
          )}

          {/* Add Payment Method */}
          {cards?.length > 0 ? (
            <div className='flex justify-between items-center p-[15px] self-stretch rounded-[15px] bg-white'>
              <div className='flex flex-col gap-3'>
                <div className='flex gap-2 items-center'>
                  <img src={CardBlack} alt="Card" className='w-[26px] h-[26px]' />
                  <div className='text-base font-bold capitalize '>Payment Method</div>
                </div>

                <div className='text-sm font-normal capitalize'>
                  {getSelectedCardText()}
                </div>
              </div>

              <div>
                <ChevronRight
                  size={24}
                  className="text-primary-light cursor-pointer"
                  onClick={() => navigate("/user/payment/card/list")}
                />
              </div>
            </div>
          ) : (
            <div className='flex justify-between items-center p-[15px] self-stretch rounded-[15px] bg-white cursor-pointer' onClick={() => navigate("/user/payment/card/add")}>
              <div className='flex gap-2 items-center'>
                <img src={CardBlack} alt="Card" className='w-[26px] h-[26px]' />
                <div className='text-base font-bold capitalize '>Add Payment Method</div>
              </div>

              <div>
                <PlusIcon size={24} />
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="bg-white rounded-[15px] p-[15px]">
            <div className="flex justify-between items-center pb-4 border-b border-primary-line">
              <h3 className="text-base font-bold text-primary-dark leading-[100%] tracking-[0]">
                Settings
              </h3>
            </div>

            {settingItems.map((item, index) => (
              <Link
                to={item.href}
                key={index}
                className={`flex justify-between items-center py-4
      ${index !== settingItems.length - 1 ? 'border-b border-[#F2F2F2]' : 'pb-0'}`}
              >
                <div className="flex items-center gap-2">
                  <img src={item.icon} alt={item.label} className="w-6 h-6" />
                  <span className="text-sm font-bold text-primary-dark tracking-[-0.01em] font-inter">
                    {item.label}
                  </span>
                </div>
                <ChevronRight size={24} className="text-primary-light" />
              </Link>
            ))}
          </div>

          {/* Add Service Address */}
          {/* {addresses?.length > 0 ? (
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
                  className={`flex cursor-pointer justify-between items-start pt-2 ${index !== addresses.length - 1 ? 'pb-2 border-b border-[#F2F2F2]' : 'pb-0'
                    }`}
                  onClick={() => navigate(`/user/address/edit/${item?.address_id}`)}
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
                      <ChevronRight size={24} className="text-primary-light" />
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
          )} */}


          {/* Add Card */}
          {/* {cards?.length > 0 ? (
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
                  key={index}
                  className={`flex cursor-pointer justify-between items-center pt-2 ${index !== cards.length - 1 ? 'pb-2 border-b border-[#F2F2F2]' : 'pb-0'
                    }`}
                  onClick={() => navigate(!item?.card_holder ? `/user/card/edit/${item?.billing_id}` : `/user/card/view/${item?.billing_id}`)}
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
                      {item?.status === "A" ? (
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
                      onClick={() => navigate(!item?.card_holder ? `/user/card/edit/${item?.billing_id}` : `/user/card/view/${item?.billing_id}`)}
                    >
                      <ChevronRight size={24} className="text-primary-light" />
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
            </div>)} */}

          {/* Add Groomers List */}
          {/* {groomers?.length > 0 && (
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
                    {item.profile_photo_url ? (
                      <img
                        src={item.profile_photo_url}
                        alt={item.name}
                        className="rounded-full w-[48px] h-[48px]"
                      />
                    ) : (
                      <img
                        src={FallbackGroomer}
                        alt={item.name}
                        className="rounded-full w-[48px] h-[48px]"
                      />
                    )}
                    <div className="flex flex-col gap-1 w-[219px]">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-primary-dark leading-[22px] tracking-[-0.01em] font-inter">
                          {item.name}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedGroomer(item);
                            setGroomerModal(true);
                          }}
                        >
                          <img
                            src={infoGrey}
                            alt="Info"
                            className="w-[20px] h-[20px]"
                          />
                        </button>
                      </div>
                      {((item.rating_avg > 0) || (item.rating_qty > 0)) && (
                        <div className="flex items-center gap-1 bg-primary-dark rounded-[25px] px-[6px] py-[4px] w-[85px]">
                          {item.rating_avg > 0 && (
                            <>
                              <img src={FillStar} alt="Rating" className="w-[10px] h-[11px]" />
                              <span className="text-xs font-bold text-white leading-[11px] tracking-[0]">
                                {item.rating_avg}
                              </span>
                            </>
                          )}

                          {item.rating_qty > 0 && (
                            <span className="text-xs font-bold text-white leading-[11px] tracking-[0]">
                              {item.rating_avg > 0 ? `| ${item.rating_qty}` : item.rating_qty}
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
          )} */}
        </div>

        {/* Divider Section */}
        <div className="hidden md:flex justify-center">
          <div className="h-full w-[1px] bg-[#E4E4E4]" />
        </div>

        {/* Right Section */}
        <div className="space-y-4 w-full min-w-0 block">
          {/* Support List */}
          <SupportItems />

          {/* Logout */}
          <div className="bg-white rounded-[15px] p-[15px] flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <img src={LogOut} alt="Logout" className="w-6 h-6" />
              <span className="text-base font-bold text-primary-dark tracking-[-0.01em] font-inter">
                Log Out
              </span>
            </div>
            <button onClick={handleLogout}>
              <ChevronRight size={24} className="text-primary-light" />
            </button>
          </div>
        </div>
      </div>

      <GroomerDetailsModal
        open={groomerModal}
        onClose={() => setGroomerModal(false)}
        groomer={selectedGroomer}
      />
      <AddPetsModal open={petsModal}
        onClose={() => setPetsModal(false)} />
    </>
  );
};

export default Account;
