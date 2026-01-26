import React, { ReactNode, useState } from 'react';
import CopyIcon from '../../assets/icon/copyy.svg';
import { ChevronRight } from 'lucide-react';
import AppointmentInfo from '../../common/AppointmentCard/AppointmentInfo';
import Calender from '../../assets/icon/calendar-black.svg';
import Home from '../../assets/icon/home-selection-a.svg';
import Paw from '../../assets/icon/pet.svg';
import Location from '../../assets/icon/location.svg';
import User from '../../assets/icon/menu/user.svg';

import { formatAppointmentDate } from '../../common/helpers';
import GroomerDetailsModal from '../../components/Modals/GroomerDetailsModal';

// components
import CopyTooltip from '../../common/CopyTooltip/CopyTooltip';
import PreferredGroomer from './PreferredGroomer';
import ShaveDownRequest from '@/common/AppointmentCards/ShaveDown/ShaveDownRequest';
import { useNavigate } from 'react-router';
import RebookConfirmation from '@/common/AppointmentCards/Rebook Confirmation/RebookConfirmation';
import { useDispatch } from 'react-redux';
import { getAppointmentDetail } from '@/utils/store/slices/appointments/appointmentsSlice';

type RecurringType = 'NONE' | 'RECURRING' | 'ONETIME' | 'CANCEL_RECURRING';

interface AppointmentCardProps {
  onPressAppointmentCard: () => void;
  item: any;
  index: number | string;
  onPressGiveTip?: (appointmentItem: any) => void;
  onPressRateService?: (appointmentItem: any) => void;
  onPressRebook?: () => void;
  displayFrom?: 'Home' | 'AppointmentsTabNavigator' | 'RECURRING_RESCHEDULE';
  isAllowedAction?: boolean;
  refreshParent?: () => void;
}

const AppointmentCard = ({ item, index, displayFrom, isAllowedAction = true, refreshParent }: AppointmentCardProps) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const hasRefund = item?.has_refund;
  const petsItem = item?.pets || [];
  const status = item?.appointment_status;
  const statusLabel = item?.appointment_status_label;
  const [modalInfoGroomer, setModalInfoGroomer] = useState(false);
  const [isOpenReschedulingPolicyModal, setIsOpenReschedulingPolicyModal] = useState(false);

  const [groomerData, setGroomerData] = useState(null);
  const [openRescheduleAppointmentModal, setOpenRescheduleAppointmentModal] = useState(false);
  const [openGroomerRebookingModal, setOpenGroomerRebookingModal] = useState(false);
  const [openGroomerRequestRebookModal, setOpenGroomerRequestRebookModal] = useState(false);
  const [groomerRebookingModalType, setGroomerRebookingModalType] = useState('');
  const [loader, setLoader] = useState(false);
  //   const formatted_Date = moment(item?.ap_date).format('ddd, MMM DD')
  const [reschedulingStage, setReschedulingStage] = useState(null);

  const updatedByGroomer = item?.is_updated;

  const address =
    [item?.addressInfo?.address1 || '', item?.addressInfo?.address2 || '']
      .filter(Boolean) // remove empty values
      .join(', ') + (item?.addressInfo?.city ? `, ${item.addressInfo.city}` : '');

  const rebookAddress = item?.address?.street + (item?.address?.city ? `, ${item.address.city}` : '');

  const [groomerModal, setGroomerModal] = useState(false);
  const [selectedGroomer, setSelectedGroomer] = useState(null);

  const pets = item?.pets?.map((pet) => pet.name).join(', ') || 'N/A';
  const FN_FIND_ME_BEST_GROOMER = false

  const getStatusLabelColor = () => {
    if (item?.type === 'recurring') {
      return {
        borderClass: 'border-green-dark',
        showRebookButton: true,
        //for rate adn tips - is_hide_rating_and_tip_after_30_days key, If true then hide the component otherwise show that component
        isLatestRate: !item?.is_hide_rating_and_tip_after_30_days,
        showRateButton: !item?.tips && item?.is_hide_rating_and_tip_after_30_days ? false : true,
      };
    }
    if (item?.type === 'rebook') {
      return {
        borderClass: 'border-color48',
        showDateTimeInfo: true,
        showExtraServiceInfo: true,
        showGroomerInfo: false,
        showGroomerRebookingCard: true,
      };
    }
    if (displayFrom === 'RECURRING_RESCHEDULE' && status === 'UPCOMING') {
      return {
        borderClass: 'border-color17',
      };
    }
    if (displayFrom === 'RECURRING_RESCHEDULE' && status === 'CANCELED') {
      return {
        borderClass: 'border-color12',
      };
    }
    if (status === 'REBOOKING REQUEST' && item?.user_confirmation_required) {
      return {
        borderClass: 'border-color29',
        showChangeDateTimeButton: true,
        showConfirmButton: true,
        showCancelAppointmentButton: true,
      };
    }
    switch (statusLabel) {
      case 'Groomer Match In Progress':
        return {
          borderClass: 'border-color48',
          showDateTimeInfo: true,
          showExtraServiceInfo: true,
          showGroomerInfo: false,
        };
      case 'Groomer confirmation pending':
        return {
          borderClass: 'border-color48',
          showDateTimeInfo: true,
          showExtraServiceInfo: true,
          showGroomerInfo: true,
        };
      case 'Groomer confirmed':
        return {
          borderClass: 'border-color11',
          showDateTimeInfo: true,
          showExtraServiceInfo: true,
          showGroomerInfo: true,
        };
      case 'Selected groomer not available':
        return {
          borderClass: 'border-color12',
          showDateTimeInfo: true,
          showReschduleButton: true,
          showGroomerInfo: true,
          showExtraServiceInfo: false,
        };
      case 'Payment failed':
        return {
          borderClass: 'border-color12',
          showDateTimeInfo: true,
          showExtraServiceInfo: false,
          showGroomerInfo: false,
          showPaymentIssueCard: true,
        };
      case 'Groomer on the way':
        return {
          borderClass: 'border-color29',
          showDateTimeInfo: true,
          showExtraServiceInfo: true,
          showGroomerInfo: true,
        };
      case 'Groomer arrived':
        return {
          borderClass: 'border-color29',
          showDateTimeInfo: true,
          showExtraServiceInfo: true,
          showGroomerInfo: true,
        };
      case 'Grooming in progress':
        return {
          borderClass: 'border-color49',
          showDateTimeInfo: true,
          showExtraServiceInfo: true,
          showGroomerInfo: true,
        };
      case 'Shaved-down request':
        return {
          borderClass: 'border-color49',
          showDateTimeInfo: false,
          showExtraServiceInfo: false,
          showGroomerInfo: true,
          shavedDownRequestButtons: true,
        };
      case 'Updates made by groomer':
        return {
          borderClass: 'border-color49',
          showDateTimeInfo: false,
          showExtraServiceInfo: false,
          showGroomerInfo: true,
          showCheckMyAppointmentButton: updatedByGroomer ? true : false,
        };
      case 'Appointment completed':
        return {
          borderClass: 'border-color47',
          showDateTimeInfo: true,
          showExtraServiceInfo: false,
          showGroomerInfo: true,
          showRebookButton: true,
          isLatestRate: !item?.is_hide_rating_and_tip_after_30_days,
          showRateButton: item?.tips && item?.is_hide_rating_and_tip_after_30_days ? false : true,
        };
      case 'Canceled by you':
        return {
          borderClass: 'border-color12',
          showDateTimeInfo: true,
          showExtraServiceInfo: false,
          showGroomerInfo: true,
          showRebookButton: true,
          showCancelledByCard: true,
          isLatestApppoitment: item.isRatingEnable && !item?.is_hide_rating_and_tip_after_30_days,
        };
      case 'Canceled by groomer':
        return {
          borderClass: 'border-color12',
          showDateTimeInfo: true,
          showGroomerInfo: true,
          showExtraServiceInfo: false,
          showRebookButton: true,
          showCancelledByCard: true,
          isLatestApppoitment: item.isRatingEnable && !item?.is_hide_rating_and_tip_after_30_days,
        };
      default:
        break;
    }
  };

  const handleRefundButton = async () => {
    let id = item?.appointment_id

    try {
      const response = await dispatch(getAppointmentDetail(id))
      let appointmentData = response.payload
      if (response.payload) {
        navigate(`/user/appointments/TransactionReceipt`, { state: { appointmentData, autoScroll: true } })
      }
    } catch (error) { }
  }

  let tempButtons: ReactNode[] = [];
  let isReRating = item?.is_enabled_rating == 1;

  if ((!item?.is_hide_rating_and_tip_after_30_days && item?.isRatingEnable) || isReRating) {
    tempButtons.push(
      <button className="w-full h-[40px] rounded-lg font-inter font-bold text-base border border-gray-200 transition">
        {isReRating ? 'Re-Rate Service' : 'Rate Service'}
      </button>
    );
  }

  if (
    item &&
    Object.prototype.hasOwnProperty.call(item, 'tip') &&
    item?.appointment_status !== 'PAYMENT ISSUE' &&
    item?.appointment_status !== 'CANCELED' &&
    item.tip === null
  ) {
    tempButtons.push(
      <button className="w-full h-[40px] rounded-lg font-inter font-bold text-base border border-gray-200 transition">Give Tip</button>,
    );
  }

  if (item?.has_refund) {
    tempButtons.push(
      <button className="w-full h-[40px] rounded-lg font-inter font-bold text-base border border-gray-200 transition" onClick={handleRefundButton}>Refund Status</button>,
    );
  }

  if (getStatusLabelColor()?.showRebookButton) {
    tempButtons.push(<button className="w-full h-[40px] rounded-lg font-inter font-bold text-base text-color12 border border-color12 transition">Rebook</button>);
  }

  // Break buttons into chunks of 2
  const chunkedButtons: ReactNode[][] = [];
  for (let i = 0; i < tempButtons.length; i += 2) {
    chunkedButtons.push(tempButtons.slice(i, i + 2));
  }

  const regularUIStatuses = () => {
    return (
      <div
        key={index}
        className={`mb-4 p-5 bg-white rounded-2xl shadow-md border-t-4 hover:shadow-lg transition
        ${getStatusLabelColor()?.borderClass ?? 'border-gray-200'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="cursor-pointer">
            <CopyTooltip textToCopy={`#${item?.appointment_id}`}>
              <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide">
                #{item?.appointment_id}
                <img src={CopyIcon} alt="Copy" className="w-3 h-3 cursor-pointer opacity-80 hover:opacity-100 transition" />
              </div>
            </CopyTooltip>
            {item?.type === 'rebook' ? (
              <p className="font-inter font-bold text-base text-gray-800 mt-1"> Rebooking Suggested by {item?.rebook_groomer?.first_name}</p>
            ) : (
              <p className="font-inter font-bold text-base text-gray-800 mt-1">{item.appointment_status_label}</p>
            )}
            {item?.appointment_status_label === 'Groomer arrived' && item?.arrived_at && (
              <p className="font-inter font-normal text-xs text-gray-800">{item.arrived_at}</p>
            )}
            {item?.appointment_status_label === 'Groomer on the way' && item?.display_eta && (
              <p className="font-inter font-normal text-xs text-gray-800 ">{item.display_eta}</p>
            )}
            {item?.appointment_status_label === 'Grooming in progress' && item?.grooming_started_at && (
              <p className="font-inter font-normal text-xs text-gray-800">{item.grooming_started_at}</p>
            )}
          </div>

          <div className="cursor-pointer" onClick={() => navigate(`/user/appointment/${item?.appointment_id}`)}>
            <ChevronRight size={24} className="text-primary-dark mt-1" />
          </div>
        </div>

        {/* Appointment Details */}
        {getStatusLabelColor()?.showDateTimeInfo && (
          <AppointmentInfo
            icon={Calender}
            title={`${formatAppointmentDate(item?.ap_date)} | ${item?.display_time}`}
            subtitle="Requested Time"
            type={undefined}
          />
        )}
        {getStatusLabelColor()?.showExtraServiceInfo && (
          <>
            <AppointmentInfo icon={Home} title={item?.inhome_mv === 'InHome' ? 'In Home' : 'Mobile Van'} subtitle="Service Type" type={undefined} />
            <AppointmentInfo icon={Paw} title={pets} subtitle="Pets to be Groomed" type={undefined} />
            <AppointmentInfo icon={Location} title={address} subtitle="Service Address" type={undefined} />
          </>
        )}

        {/* Preferred Groomer */}
        {getStatusLabelColor()?.showGroomerInfo && (
          <PreferredGroomer
            item={item}
            onInfoClick={(g) => {
              setSelectedGroomer(g);
              setGroomerModal(true);
            }}
          />
        )}

        {(statusLabel === 'Appointment completed' || statusLabel === 'Canceled by you' || statusLabel === 'Canceled by groomer') &&
          isAllowedAction && <div className="border-t border-gray-200 mt-4" />}

        {isAllowedAction &&
          chunkedButtons &&
          chunkedButtons?.map((btnGroup, rowIndex) => (
            <div key={rowIndex} className="flex flex-row mt-4 items-center justify-between">
              {btnGroup.map((btn, i) => {
                const isLast = rowIndex === chunkedButtons.length - 1 && i === btnGroup.length - 1;
                const isOddLast = tempButtons.length % 2 === 1 && isLast;

                return (
                  <div key={i} className={isOddLast ? 'w-full' : 'w-[49%]'}>
                    {btn}
                  </div>
                );
              })}
            </div>
          ))}

        {/* Action Button */}
        {getStatusLabelColor()?.showReschduleButton && isAllowedAction && (
          <div className="flex flex-row mt-3">
            {FN_FIND_ME_BEST_GROOMER && (
              <button className="w-full h-[40px] rounded-lg font-inter font-bold text-base border border-gray-200 transition mr-2">
                Find Me Groomer
              </button>
            )}
            <button className="w-full h-[40px] rounded-lg font-inter font-bold text-base border border-gray-200 transition">Reschedule</button>
          </div>
        )}

        {getStatusLabelColor(item)?.showCheckMyAppointmentButton && (
          <div className="flex mt-3">
            <button className="w-full h-[40px] rounded-lg font-inter font-bold text-base border border-gray-200 transition">
              View Updates
            </button>
          </div>
        )}



        {getStatusLabelColor()?.showPaymentIssueCard && (
          <div className="flex mt-3">
            <button className="w-full h-[40px] rounded-lg font-inter font-bold text-base border border-gray-200 transition">
              Update Payment Details
            </button>
          </div>
        )}

        {getStatusLabelColor(item)?.shavedDownRequestButtons && isAllowedAction && (
          <ShaveDownRequest appointment={item} isAllowedAction={isAllowedAction} refreshParent={refreshParent} />
        )}

        {getStatusLabelColor(item)?.showGroomerRebookingCard && (
          <>
            <div className="w-full h-px bg-gray-200 my-3" />

            <div className="flex items-center py-3">
              {item?.rebook_groomer?.profile_photo_url ? (
                <img
                  src={item.rebook_groomer.profile_photo_url}
                  alt="Groomer"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <img src={User} alt="user" className="w-5 h-5" />
                </div>
              )}

              <div className="ml-3 flex-1 min-w-0">
                <div className="flex">
                  <p className="text-sm font-semibold truncate">
                    {`${(item?.rebook_groomer?.first_name || '').trim()} ${(item?.rebook_groomer?.last_name || '').trim()}`.trim() || ''}
                  </p>
                </div>
                <p className="text-xs text-gray-500">Preferred Groomer</p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200 my-3" />

            <RebookConfirmation
              appointment={item}
              onPressCancelAppoitment={() => { }}
              onPressChangeDateTime={() => { }}
              onPressConfirm={() => { }}
              loading={loader}
            />
          </>
        )}

        <GroomerDetailsModal type={'appointments'} open={groomerModal} onClose={() => setGroomerModal(false)} groomer={selectedGroomer} />
      </div>
    );
  };

  const nextRecurringPlan = () => {
    return <></>
  }

  let recurringType: RecurringType = 'RECURRING';

  if (displayFrom === 'RECURRING_RESCHEDULE') {
    recurringType = 'NONE';
  } else if (item?.type === 'recurring_cancelled') {
    recurringType = 'CANCEL_RECURRING';
  }
  return (
    <div>
      {['recurring', 'annual', 'flexible'].includes(item?.type) ? (
        nextRecurringPlan()
      ) : item?.type === 'recurring_cancelled' ? (
        <></> // will add cancelled recurring UI here later
      ) : (
        regularUIStatuses()
      )}
    </div>
  );
};

export default AppointmentCard;
