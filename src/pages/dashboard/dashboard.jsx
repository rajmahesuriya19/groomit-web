import React, { useEffect, useState } from 'react'
import SupportItems from '@/common/SupportItems/SupportItems'
import { ChevronRight } from 'lucide-react'

// icons
import RecurringIcon from '../../assets/icon/white-groomit.png';
import CopyIcon from '../../assets/icon/copyy.svg';
import Home from '../../assets/icon/home-selection-a.svg';
import Paw from '../../assets/icon/pet.svg';
import Location from '../../assets/icon/location.svg';
import FallbackDog from '../../assets/icon/dog-avatar.jpg';
import FallbackCat from '../../assets/icon/cat-avatar.jpg';
import Message from '../../assets/icon/message-blue.svg';
import Call from '../../assets/icon/call-green.svg';
import Star from '../../assets/icon/star.svg';
import Tip from '../../assets/icon/tip.svg';
import Calender from '../../assets/icon/calendar-black.svg';
import Scissor from '../../assets/menu-new/scissor-a.svg';
import CatAnimation from '../../assets/animation/Cat Animation.gif';
import DogAnimation from '../../assets/animation/Dog Animation.gif';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCarousel from '@/common/DashboardCarousel/DashboardCarousel';
import { Tooltip } from '@mui/material';
import { useNavigate } from 'react-router';
import { getDashboardData } from '@/utils/store/slices/dashboard/dashboardSlice';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import RescheduleAppointemntModal from '@/components/Modals/RescheduleAppointemntModal';
import CancelAppointemntModal from '@/components/Modals/CancelAppointemntModal';

import ShaveDownRequest from '@/common/AppointmentCards/ShaveDown/ShaveDownRequest';
import GroomerConfirmationPending from '@/common/AppointmentCards/Groomer Confirmation/GroomerConfirmationPending';
import GroomerMatchInProgress from '@/common/AppointmentCards/Groomer Match In/GroomerMatchInProgress';
import PaymentFailed from '@/common/AppointmentCards/Payment failed/PaymentFailed';
import SelectedGroomerNotAvailable from '@/common/AppointmentCards/Selected Groomer Not Available/SelectedGroomerNotAvailable';
import CanceledByGroomer from '@/common/AppointmentCards/Canceled By Groomer/CanceledByGroomer';
import UpdatesMadeByGroomer from '@/common/AppointmentCards/Updates made by groomer/UpdatesMadeByGroomer';
import GroomerConfirmed from '@/common/AppointmentCards/Groomer confirmed/GroomerConfirmed';
import GroomingInProgress from '@/common/AppointmentCards/Grooming in progress/GroomingInProgress';
import GroomerOnWay from '@/common/AppointmentCards/Groomer on the way/GroomerOnWay';
import GroomerArrived from '@/common/AppointmentCards/Groomer arrived/GroomerArrived';
import CanceledByYou from '@/common/AppointmentCards/Canceled By You/CanceledByYou';
import AppointmentCompleted from '@/common/AppointmentCards/Appointment completed/AppointmentCompleted';
import Canceled from '@/common/AppointmentCards/Canceled/Canceled';
import RebookConfirmation from '@/common/AppointmentCards/Rebook Confirmation/RebookConfirmation';

import RecurringPlanList from "@/common/AppointmentCards/Recurring Plan/RecurringPlanList";

const dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [changeTimeModal, setChangeTimeModal] = useState(false);
  const [cancelAppModal, setCancelAppModal] = useState(false);

  const { dashboard } = useSelector((state) => state.dashboard);
  const {
    user,
    catPets = [],
    dogPets = [],
    upcoming_appts = [],
    recurring_appts = [],
    rebook_requests = [],
    completed_appts = [],
    recurring_cancelled = [],
    current_appts = [],
  } = dashboard;
  console.log('dashboard-data', dashboard);

  const hasAnyPet = dogPets?.length > 0 || catPets?.length > 0 || [];

  const allPets = [...dogPets, ...catPets];

  useEffect(() => {
    showLoader();
    dispatch(getDashboardData()).finally(() => hideLoader());
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader();

        await Promise.all([
          dispatch(getDashboardData()),
          dispatch(getUserInfo())
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        hideLoader();
      }
    };

    fetchData();
  }, [dispatch]);

  const isAnyAppoitment =
    completed_appts?.length > 0 ||
    rebook_requests?.length > 0 ||
    recurring_cancelled?.length > 0 ||
    upcoming_appts?.length > 0 ||
    current_appts?.length > 0

  const onPressRecurringDetails = (item) => { 
    // navigate('/user/Recurring Plan/RecurringScheduleDetails', { state: { recurringPlan: item } });
    navigate(`/user/appointments/RecurringPlan/RecurringScheduleDetails`)

  }
  return (
    <>
      <div className="w-full overflow-hidden">
        <div className="bg-white py-2 px-5 w-full hidden md:block">
          <div className="font-inter font-bold text-xl text-primary-dark">{`Hi, ${user?.first_name}`}</div>
          <div className="font-inter font-normal text-sm text-primary-dark">Ready to pamper your pets?</div>
        </div>

        {/* <div className='bg-white py-2 px-5 w-full block md:hidden'>
          <div className='flex items-center gap-2'>
            <img src={user?.photo} alt="User" className="mr-2 object-cover w-10 h-10 rounded-lg" />
            <div>
              <div className="font-inter font-bold text-lg text-primary-dark">{`Hi, ${user?.first_name}`}</div>
              <div className="font-inter font-normal text-xs text-primary-dark">Ready to pamper your pets?</div>
            </div>
          </div>
        </div> */}

      {hasAnyPet && recurring_appts.length > 0 && (
          <RecurringPlanList
            data={recurring_appts}
            icon={RecurringIcon}
            type="active"
            onPressRecurringDetails={onPressRecurringDetails}
          />
        )}

        {hasAnyPet && recurring_cancelled.length > 0 && (
          <RecurringPlanList
            data={recurring_cancelled}
            icon={RecurringIcon}
            type="cancelled"
            onPressRecurringDetails={onPressRecurringDetails}
          />
        )}
      </div>

      <div className="px-5 py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
        <div className="space-y-4">
          {/* Reminder Card */}
          {hasAnyPet && (
            <div className="rounded-2xl p-1 bg-white shadow-md">
              <div className="bg-[#FFF6DB] rounded-xl py-4 px-6">
                <h3 className="text-center font-inter font-bold text-xl">
                  Time for{' '}
                  {allPets.map((pet, index) => (
                    <span key={index}>
                      {pet?.name}
                      {index !== allPets.length - 1 && ', '}
                    </span>
                  ))}{' '}
                  Next Grooming!
                </h3>
                {/* <p className="text-center font-inter text-sm mt-2 leading-6 text-gray-700">
                It’s been <span className="text-[#EB5757] font-semibold">4 weeks</span> since Bruno’s last grooming.
                Let’s keep Bruno looking & feeling his best! 🐶
              </p> */}
                <button className="w-full bg-primary-dark rounded-lg h-12 mt-6 mb-4 text-white font-inter font-bold text-base hover:bg-primary-light transition-all">
                  Book Now
                </button>
                <div className="px-2 py-3 bg-white rounded-lg">
                  <p className="text-center font-inter text-sm text-primary-dark leading-6">
                    "Alapahapa Blue Blood Bulldog, Affenpinscher, Affenpinscher, Alapahapa Blue Blood Bulldog, Alapahapa Blue Blood Bulldog,
                    Affenshire, Affenshire, Affenpinscher, Beagle, Affenpoo, Afghan Hound, Affenpoo, Affenpoo, Alano Espanol, Affenpinscher,
                    Affenpinscher, Affenpinscher needs grooming <span className="font-bold">every 4–6 weeks </span>
                    to prevent matting & skin issues.”
                  </p>
                  <p className="mt-3 text-center font-inter font-bold text-xs uppercase text-[#3064A3]">— Experts</p>
                </div>
              </div>
            </div>
          )}

          {/* If Rebook Appointments are available */}
          {rebook_requests?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-inter font-bold text-xl text-primary-dark">Rebooking Request</h3>
                <div className="flex items-center cursor-pointer" onClick={() => navigate(`/user/appointments`)}>
                  <h3 className="font-inter font-normal text-sm text-primary-light">All Appointments</h3>
                  <ChevronRight size={20} className="text-primary-light" />
                </div>
              </div>
              {rebook_requests?.map((appt, idx) => (
                <div key={idx}>
                  <>{appt?.type === 'rebook' && <RebookConfirmation appointment={appt} />}</>
                </div>
              ))}
            </div>
          )}

          {/* If CURRENT exists → show only CURRENT */}
          {current_appts?.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-inter font-bold text-xl text-primary-dark">Current Appointment</h3>
                <div className="flex items-center cursor-pointer" onClick={() => navigate(`/user/appointments`)}>
                  <h3 className="font-inter font-normal text-sm text-primary-light">All Appointments</h3>
                  <ChevronRight size={12} className="text-primary-light" />
                </div>
              </div>
              {current_appts?.map((appt, idx) => (
                <div key={idx}>
                  <>
                    {appt?.appointment_status_label === 'Shaved-down request' && <ShaveDownRequest appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer confirmation pending' && <GroomerConfirmationPending appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer Match In Progress' && <GroomerMatchInProgress appointment={appt} />}
                    {appt?.appointment_status_label === 'Payment failed' && <PaymentFailed appointment={appt} />}
                    {appt?.appointment_status_label === 'Selected groomer not available' && <SelectedGroomerNotAvailable appointment={appt} />}
                    {appt?.appointment_status_label === 'Canceled by groomer' && <CanceledByGroomer appointment={appt} />}
                    {appt?.appointment_status_label === 'Canceled by you' && <CanceledByYou appointment={appt} />}
                    {appt?.appointment_status_label === 'Canceled' && <Canceled appointment={appt} />}
                    {appt?.appointment_status_label === 'Appointment completed' && <AppointmentCompleted appointment={appt} />}
                    {appt?.appointment_status_label === 'Updates made by groomer' && <UpdatesMadeByGroomer appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer confirmed' && <GroomerConfirmed appointment={appt} />}
                    {appt?.appointment_status_label === 'Grooming in progress' && <GroomingInProgress appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer on the way' && <GroomerOnWay appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer arrived' && <GroomerArrived appointment={appt} />}
                  </>
                </div>
              ))}
            </div>
          ) : upcoming_appts?.length > 0 ? ( // No CURRENT → Show UPCOMING if exists
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-inter font-bold text-xl text-primary-dark">Upcoming Appointment</h3>
                <div className="flex items-center cursor-pointer" onClick={() => navigate(`/user/appointments`)}>
                  <h3 className="font-inter font-normal text-sm text-primary-light">All Appointments</h3>
                  <ChevronRight size={12} className="text-primary-light" />
                </div>
              </div>
              {upcoming_appts?.map((appt, idx) => (
                <div key={idx}>
                  <>
                    {appt?.appointment_status_label === 'Shaved-down request' && <ShaveDownRequest appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer confirmation pending' && <GroomerConfirmationPending appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer Match In Progress' && <GroomerMatchInProgress appointment={appt} />}
                    {appt?.appointment_status_label === 'Payment failed' && <PaymentFailed appointment={appt} />}
                    {appt?.appointment_status_label === 'Selected groomer not available' && <SelectedGroomerNotAvailable appointment={appt} />}
                    {appt?.appointment_status_label === 'Canceled by groomer' && <CanceledByGroomer appointment={appt} />}
                    {appt?.appointment_status_label === 'Canceled by you' && <CanceledByYou appointment={appt} />}
                    {appt?.appointment_status_label === 'Canceled' && <Canceled appointment={appt} />}
                    {appt?.appointment_status_label === 'Appointment completed' && <AppointmentCompleted appointment={appt} />}
                    {appt?.appointment_status_label === 'Updates made by groomer' && <UpdatesMadeByGroomer appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer confirmed' && <GroomerConfirmed appointment={appt} />}
                    {appt?.appointment_status_label === 'Grooming in progress' && <GroomingInProgress appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer on the way' && <GroomerOnWay appointment={appt} />}
                    {appt?.appointment_status_label === 'Groomer arrived' && <GroomerArrived appointment={appt} />}
                  </>
                </div>
              ))}
            </div>
          ) : completed_appts?.length > 0 ? ( //  No CURRENT + No UPCOMING → Show COMPLETED
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-inter font-bold text-xl text-primary-dark">Last Appointment</h3>
                <div className="flex items-center cursor-pointer" onClick={() => navigate(`/user/appointments`)}>
                  <h3 className="font-inter font-normal text-sm text-primary-light">All Appointments</h3>
                  <ChevronRight size={12} className="text-primary-light" />
                </div>
              </div>
              {completed_appts.map((appt, index) => {
                return (
                  <div key={index}>
                    <>
                      {appt?.appointment_status_label === 'Shaved-down request' && <ShaveDownRequest appointment={appt} />}
                      {appt?.appointment_status_label === 'Groomer confirmation pending' && <GroomerConfirmationPending appointment={appt} />}
                      {appt?.appointment_status_label === 'Groomer Match In Progress' && <GroomerMatchInProgress appointment={appt} />}
                      {appt?.appointment_status_label === 'Payment failed' && <PaymentFailed appointment={appt} />}
                      {appt?.appointment_status_label === 'Selected groomer not available' && <SelectedGroomerNotAvailable appointment={appt} />}
                      {appt?.appointment_status_label === 'Canceled by groomer' && <CanceledByGroomer appointment={appt} />}
                      {appt?.appointment_status_label === 'Canceled by you' && <CanceledByYou appointment={appt} />}
                      {appt?.appointment_status_label === 'Canceled' && <Canceled appointment={appt} />}
                      {appt?.appointment_status_label === 'Appointment completed' && <AppointmentCompleted appointment={appt} />}
                      {appt?.appointment_status_label === 'Updates made by groomer' && <UpdatesMadeByGroomer appointment={appt} />}
                      {appt?.appointment_status_label === 'Groomer confirmed' && <GroomerConfirmed appointment={appt} />}
                      {appt?.appointment_status_label === 'Grooming in progress' && <GroomingInProgress appointment={appt} />}
                      {appt?.appointment_status_label === 'Groomer on the way' && <GroomerOnWay appointment={appt} />}
                      {appt?.appointment_status_label === 'Groomer arrived' && <GroomerArrived appointment={appt} />}
                    </>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* First Appointment Card */}
          {!isAnyAppoitment && (
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
                <p className="font-inter text-[11px] text-gray-500 text-center">It only takes a few seconds to book ✨</p>
              </div>
            </div>
          )}

          {!hasAnyPet && (
            <div className="rounded-2xl p-1 bg-white shadow-md">
              <div className="py-3 px-3">
                <h3 className="font-inter font-bold text-base">Add Your Pets</h3>
                <p className="font-inter text-sm text-gray-600 mt-1">Tell us about your furry friends 🐾</p>

                <div className="flex gap-4 mt-5">
                  {/* Dog Card */}
                  <div className="flex-1 bg-[#FBFCFC] border border-primary-light rounded-xl p-4 hover:shadow-lg hover:border-primary-dark transition-all cursor-pointer">
                    <h4 className="font-inter font-semibold text-base text-center">Add Dog</h4>
                    <img src={DogAnimation} className="w-full h-[120px] mx-auto object-contain" alt="Dog Animation" />
                  </div>

                  {/* Cat Card */}
                  <div className="flex-1 bg-[#FBFCFC] border border-primary-light rounded-xl p-4 hover:shadow-lg hover:border-primary-dark transition-all cursor-pointer">
                    <h4 className="font-inter font-semibold text-base text-center">Add Cat</h4>
                    <img src={CatAnimation} className="w-full h-[120px] mx-auto object-contain" alt="Cat Animation" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!upcoming_appts && allPets.length > 0 && (
            <div>
              <div className="mb-1 py-3 px-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-inter font-bold text-xl">My Pets</h3>
                  <p
                    className="cursor-pointer flex items-center justify-center font-inter font-normal text-sm text-[#3064A3]"
                    onClick={() => navigate('/user/pet/list')}
                  >
                    View <ChevronRight size={16} className="text-[#3064A3]" />
                  </p>
                </div>
              </div>

              {allPets.slice(0, 2).map((pet, index) => (
                <div key={index} className="mb-3 p-4 bg-white rounded-2xl shadow-md">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <img
                        src={pet?.profilePicture?.path || pet?.photo_url || (pet?.type === 'dog' ? FallbackDog : FallbackCat)}
                        className="w-9 h-9 object-cover rounded-[10px] cursor-pointer"
                        alt="Pet Profile"
                      />
                      <div>
                        <h4 className="font-inter font-bold text-base cursor-pointer">{pet.name}</h4>
                        {pet?.type === 'dog' ? (
                          <div className="font-inter font-normal text-sm">{[pet?.breed_name, pet?.size?.size_name].filter(Boolean).join(', ')}</div>
                        ) : (
                          <div className="font-inter font-normal text-sm">{pet?.age}</div>
                        )}
                      </div>
                    </div>

                    <button className="px-4 py-2 border border-primary-dark rounded-[10px] text-primary-dark font-inter font-bold text-base">
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DashboardCarousel />
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

      <RescheduleAppointemntModal
        type={''}
        open={changeTimeModal}
        onClose={() => setChangeTimeModal(false)}
        onConfirm={() => setChangeTimeModal(false)}
        title={'Reschedule Appointemnt'}
        description={'Are you sure you want to reschedule this appointment?'}
      />
      <CancelAppointemntModal
        type={''}
        open={cancelAppModal}
        onClose={() => setCancelAppModal(false)}
        onConfirm={() => setCancelAppModal(false)}
        title={'Cancel Appointment'}
        description={'You are about to cancel this upcoming appointment, You were not charged for this appointment.'}
        lastConfirm={'Are you sure you want to cancel?'}
      />
    </>
  )
}

export default dashboard