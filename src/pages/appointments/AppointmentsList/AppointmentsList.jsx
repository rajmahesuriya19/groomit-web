import { Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';

// Icons
import CopyIcon from '../../../assets/icon/copyy.svg';
import Calender from '../../../assets/icon/calendar-black.svg';
import Home from '../../../assets/icon/home-selection-a.svg';
import Paw from '../../../assets/icon/pet.svg';
import Location from '../../../assets/icon/location.svg';
import Message from '../../../assets/icon/message-blue.svg';
import Call from '../../../assets/icon/call-green.svg';
import ShaveDownRequest from '@/common/AppointmentCards/ShaveDownRequest';
import GroomerConfirmationPending from '@/common/AppointmentCards/GroomerConfirmationPending';
import GroomerMatchInProgress from '@/common/AppointmentCards/GroomerMatchInProgress';
import PaymentFailed from '@/common/AppointmentCards/PaymentFailed';
import SelectedGroomerNotAvailable from '@/common/AppointmentCards/SelectedGroomerNotAvailable';
import CanceledByGroomer from '@/common/AppointmentCards/CanceledByGroomer';
import UpdatesMadeByGroomer from '@/common/AppointmentCards/UpdatesMadeByGroomer';
import GroomerConfirmed from '@/common/AppointmentCards/GroomerConfirmed';
import GroomingInProgress from '@/common/AppointmentCards/GroomingInProgress';
import GroomerOnWay from '@/common/AppointmentCards/GroomerOnWay';
import GroomerArrived from '@/common/AppointmentCards/GroomerArrived';
import CanceledByYou from '@/common/AppointmentCards/CanceledByYou';
import AppointmentCompleted from '@/common/AppointmentCards/AppointmentCompleted';
import Canceled from '@/common/AppointmentCards/Canceled';

const AppointmentsList = ({ data = [] }) => {
    const uniqueStatusLabels = [...new Set(data.map(a => a.appointment_status_label))];
    console.log(uniqueStatusLabels);

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
