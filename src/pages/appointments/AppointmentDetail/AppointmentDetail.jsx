import SupportItems from '@/common/SupportItems/SupportItems';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { getAppointmentDetail } from '@/utils/store/slices/appointments/appointmentsSlice';
import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import ShaveDownRequestDetail from '@/common/AppointmentCards/ShaveDown/ShaveDownRequestDetail';
import GroomerConfirmationDetail from '@/common/AppointmentCards/Groomer Confirmation/GroomerConfirmationDetail';
import GroomerMatchInProgressDetail from '@/common/AppointmentCards/Groomer Match In/GroomerMatchInProgressDetail';
import PaymentFailedDetail from '@/common/AppointmentCards/Payment failed/PaymentFailedDetail';
import SelectedGroomerNotAvailableDetail from '@/common/AppointmentCards/Selected Groomer Not Available/SelectedGroomerNotAvailableDetail';
import CanceledByGroomerDetail from '@/common/AppointmentCards/Canceled By Groomer/CanceledByGroomerDetail';
import CanceledByYouDetail from '@/common/AppointmentCards/Canceled By You/CanceledByYouDetail';
import CanceledDetail from '@/common/AppointmentCards/Canceled/CanceledDetail';
import AppointmentCompletedDetail from '@/common/AppointmentCards/Appointment completed/AppointmentCompletedDetail';
import UpdatesMadeByGroomerDetail from '@/common/AppointmentCards/Updates made by groomer/UpdatesMadeByGroomerDetail';
import GroomerConfirmedDetail from '@/common/AppointmentCards/Groomer confirmed/GroomerConfirmedDetail';
import GroomingInProgressDetail from '@/common/AppointmentCards/Grooming in progress/GroomingInProgressDetail';
import GroomerOnWayDetail from '@/common/AppointmentCards/Groomer on the way/GroomerOnWayDetail';
import GroomerArrivedDetail from '@/common/AppointmentCards/Groomer arrived/GroomerArrivedDetail';

const AppointmentDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();

    const selectedAppointment = useSelector(
        state => state.appointments.selectedAppointment
    );

    useEffect(() => {
        if (!id) return;
        showLoader();
        dispatch(getAppointmentDetail(id)).finally(() => hideLoader());
    }, [dispatch, id]);

    return (
        <>
            {/* Page Header */}
            <div className="w-full overflow-hidden py-[10px] bg-white shadow-sm">
                <div className="py-2 px-5 w-full hidden md:flex gap-3 items-center">
                    <ChevronLeft size={24} className="text-primary-dark cursor-pointer" onClick={() => navigate("/user/appointments")} />
                    <div className="font-filson font-bold text-xl text-primary-dark">
                        Appointment Details
                    </div>
                </div>

                <div className="px-2 w-full block md:hidden">
                    <div className="flex items-center gap-2 w-full">
                        <ChevronLeft size={24} className="text-primary-dark cursor-pointer" onClick={() => navigate("/user/appointments")} />
                        <div className="w-full text-center font-filson font-bold text-xl text-primary-dark">
                            Appointment Details
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-5 py-6 grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
                {/* Left Section */}
                <div className="space-y-4">
                    {selectedAppointment?.appointment_status_label === "Shaved-down request" && <ShaveDownRequestDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Groomer confirmation pending" && <GroomerConfirmationDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Groomer Match In Progress" && <GroomerMatchInProgressDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Payment failed" && <PaymentFailedDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Selected groomer not available" && <SelectedGroomerNotAvailableDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Canceled by groomer" && <CanceledByGroomerDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Canceled" && <CanceledDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Canceled by you" && <CanceledByYouDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Appointment completed" && <AppointmentCompletedDetail selectedAppointment={selectedAppointment} />}

                    {/* remain */}
                    {selectedAppointment?.appointment_status_label === "Updates made by groomer" && <UpdatesMadeByGroomerDetail selectedAppointment={selectedAppointment} />}
                    {/* remain */}

                    {selectedAppointment?.appointment_status_label === "Groomer confirmed" && <GroomerConfirmedDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Grooming in progress" && <GroomingInProgressDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Groomer on the way" && <GroomerOnWayDetail selectedAppointment={selectedAppointment} />}
                    {selectedAppointment?.appointment_status_label === "Groomer arrived" && <GroomerArrivedDetail selectedAppointment={selectedAppointment} />}
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

export default AppointmentDetail;
