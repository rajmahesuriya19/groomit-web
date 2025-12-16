import React, { useEffect, useState } from 'react'
import SupportItems from '@/common/SupportItems/SupportItems'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

// icons
import RecurringIcon from '../../assets/icon/white-groomit.png';
import FallbackDog from '../../assets/icon/dog-avatar.jpg';
import FallbackCat from '../../assets/icon/cat-avatar.jpg';
import Scissor from '../../assets/menu-new/scissor-a.svg';
import CatAnimation from '../../assets/animation/Cat Animation.gif';
import DogAnimation from '../../assets/animation/Dog Animation.gif';
import DashboardCarousel from '@/common/DashboardCarousel/DashboardCarousel';
import AppointmentCard from '../../pages/appointments/AppointmentCard';
import { getDashboardData } from '@/utils/store/slices/dashboard/dashboardSlice';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import RescheduleAppointemntModal from '@/components/Modals/RescheduleAppointemntModal';
import CancelAppointemntModal from '@/components/Modals/CancelAppointemntModal';
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
    petReminderList = []
  } = dashboard;

  const hasAnyPet = dogPets?.length > 0 || catPets?.length > 0 || [];

  const allPets = [...dogPets, ...catPets];

  const breedNames = [
    ...new Set(
      petReminderList
        .map(pet => pet.breed_name)
        .filter(Boolean) // remove null / ""
    ),
  ];
  const breedsText = breedNames.join(', ');

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

  const renderItem = ({ item, index }) => (
    <AppointmentCard item={item} index={index} onPressAppointmentCard={() => {}} />
  )

  return (
    <>
      <div className="w-full overflow-hidden">
        <div className="bg-white py-2 px-5 w-full hidden md:block">
          <div className="font-inter font-bold text-xl text-primary-dark">{`Hi, ${user?.first_name}`}</div>
          <div className="font-inter font-normal text-sm text-primary-dark">Ready to pamper your pets?</div>
        </div>

        <div className='bg-white py-2 px-5 w-full block md:hidden'>
          <div className='flex items-center gap-2'>
            <img src={user?.photo} alt="User" className="mr-2 object-cover w-10 h-10 rounded-lg" />
            <div>
              <div className="font-inter font-bold text-lg text-primary-dark">{`Hi, ${user?.first_name}`}</div>
              <div className="font-inter font-normal text-xs text-primary-dark">Ready to pamper your pets?</div>
            </div>
          </div>
        </div>

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
          {petReminderList?.length > 0 && (
            <div className="rounded-2xl p-1 bg-white shadow-md">
              <div className="bg-[#FFF6DB] rounded-xl py-4 px-6">
                <h3 className="text-center font-inter font-bold text-xl">
                  Time for{' '}
                  {petReminderList.map((pet, index) => (
                    <span key={index}>
                      {pet?.name}
                      {index !== petReminderList.length - 1 && ', '}
                    </span>
                  ))}{' '}
                  Next Grooming!
                </h3>
                <button className="w-full bg-primary-dark rounded-lg h-12 mt-6 mb-4 text-white font-inter font-bold text-base hover:bg-primary-light transition-all">
                  Book Now
                </button>
                <div className="px-2 py-3 bg-white rounded-lg">
                  <p className="text-center font-inter text-sm text-primary-dark leading-6">
                    "{breedsText} needs grooming{" "} <span className="font-bold">every 4–6 weeks </span>
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
              {current_appts?.map((item, idx) => (
                <div key={idx}>
                  {renderItem({ item, idx })}
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
              {upcoming_appts?.map((item, idx) => (
                <div key={idx}>
                  {renderItem({ item, idx })}
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
              {completed_appts.map((item, index) => {
                return (
                  <div key={index}>
                   {renderItem({ item, index })}
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

          {hasAnyPet.length == 0 && (
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