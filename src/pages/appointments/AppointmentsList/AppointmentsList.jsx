// Icons
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

const AppointmentsList = ({ data = [] }) => {
    return (
        <div className="space-y-4">
            {data?.map((appt) => (
                <>
                    {appt?.appointment_status_label === "Shaved-down request" && <ShaveDownRequest appointment={appt} />}
                    {appt?.appointment_status_label === "Groomer confirmation pending" && <GroomerConfirmationPending appointment={appt} />}
                    {appt?.appointment_status_label === "Groomer Match In Progress" && <GroomerMatchInProgress appointment={appt} />}
                    {appt?.appointment_status_label === "Payment failed" && <PaymentFailed appointment={appt} />}
                    {appt?.appointment_status_label === "Selected groomer not available" && <SelectedGroomerNotAvailable appointment={appt} />}
                    {appt?.appointment_status_label === "Canceled by groomer" && <CanceledByGroomer appointment={appt} />}
                    {appt?.appointment_status_label === "Canceled by you" && <CanceledByYou appointment={appt} />}
                    {appt?.appointment_status_label === "Canceled" && <Canceled appointment={appt} />}
                    {appt?.appointment_status_label === "Appointment completed" && <AppointmentCompleted appointment={appt} />}
                    {appt?.appointment_status_label === "Updates made by groomer" && <UpdatesMadeByGroomer appointment={appt} />}
                    {appt?.appointment_status_label === "Groomer confirmed" && <GroomerConfirmed appointment={appt} />}
                    {appt?.appointment_status_label === "Grooming in progress" && <GroomingInProgress appointment={appt} />}
                    {appt?.appointment_status_label === "Groomer on the way" && <GroomerOnWay appointment={appt} />}
                    {appt?.appointment_status_label === "Groomer arrived" && <GroomerArrived appointment={appt} />}
                </>
            ))}
        </div>
    );
};

export default AppointmentsList;
