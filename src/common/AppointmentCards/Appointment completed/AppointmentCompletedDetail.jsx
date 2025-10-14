import React, { useState } from 'react'
import Card from '../Card'
import { ChevronRight } from 'lucide-react';

import Refund from "../../../assets/icon/money-recive.svg"
import Calender from '../../../assets/icon/calendar-black.svg';
import Home from '../../../assets/icon/home-selection-a.svg';
import Location from '../../../assets/icon/location.svg';
import Info from '../../../assets/icon/info-circle-grey.svg';

import AppointmentInfo from '@/common/AppointmentCard/AppointmentInfo';
import { formatAppointmentDate } from '@/common/helpers';
import MyPets from '../Pets Information/Pets';
import Cards from '../Cards Section/Cards';
import AppointmentHeader from '../Appointment Detail Header/AppointmentHeader';
import RateServiceAccordion from '@/common/AccordionExpand/AccordionExpandDefault';
import TipServiceAccordion from '@/common/AccordionExpand/TipServiceAccordion';
import GroomerDetailsModal from '@/components/Modals/GroomerDetailsModal';

const AppointmentCompletedDetail = ({ selectedAppointment }) => {
    const [groomerModal, setGroomerModal] = useState(false);
    const [selectedGroomer, setSelectedGroomer] = useState(null);

    const address = selectedAppointment?.address
        ? `${selectedAppointment.address.address1}, ${selectedAppointment.address.city}, ${selectedAppointment.address.state}, ${selectedAppointment.address.zip}`
        : 'N/A';
    return (
        <>
            {selectedAppointment?.has_refund && <Card>
                <RefundStatus cards={selectedAppointment?.card} />
            </Card>}

            <Card borderColor="#438B53">
                <AppointmentHeader appointment={selectedAppointment} />
            </Card>

            <Card>
                <PreferredGroomer
                    groomer={selectedAppointment?.groomer}
                    onInfoClick={(g) => {
                        setSelectedGroomer(g);
                        setGroomerModal(true);
                    }}
                />
                <TipServiceAccordion tipOptions={selectedAppointment} />
            </Card>

            {!selectedAppointment?.appt_detail?.isRatingEnable && <Card>
                <RateServiceAccordion ratings={selectedAppointment?.appt_detail} />
            </Card>}

            <Card>
                <AppointmentInfo
                    type="detail"
                    icon={Calender}
                    title={`${formatAppointmentDate(selectedAppointment?.appt_detail?.display_date)} | ${selectedAppointment?.appt_detail?.display_time}`}
                    subtitle="Requested Time"
                />
                <AppointmentInfo
                    icon={Home}
                    title={selectedAppointment?.appt_detail?.inhome_mv === "InHome" ? 'In Home' : 'Mobile Van'}
                    subtitle="Service Type"
                />
                <AppointmentInfo icon={Location} title={address} subtitle="Service Address" />
            </Card>

            <Card>
                <div className="flex justify-between items-center">
                    <div className="font-inter font-bold text-primary-dark text-base">Pet Information</div>
                    <div className="flex items-center">
                        <div className="font-inter font-normal text-[#3064A3] text-sm">Details</div>
                        <ChevronRight size={15} className="text-[#3064A3]" />
                    </div>
                </div>
                <MyPets pets={selectedAppointment?.pets} />
            </Card>

            <Card>
                <Cards cards={selectedAppointment?.card} charged={selectedAppointment?.total_charged} />
            </Card>

            <GroomerDetailsModal
                type={"appointments"}
                open={groomerModal}
                onClose={() => setGroomerModal(false)}
                groomer={selectedGroomer}
            />
        </>
    )
}

export default AppointmentCompletedDetail;

/* 💇 Preferred Groomer */
const PreferredGroomer = ({ groomer, onInfoClick }) => {
    if (!groomer) return null;

    const {
        first_name,
        last_name,
        profile_photo_url,
        groomer_type,
        isAllowedMessage,
        isAllowedCall,
    } = groomer;

    return (
        <div>
            <div className="flex items-start gap-4">
                <img
                    src={profile_photo_url || 'https://www.groomit.me/v7/images/icons/profile-circle.svg'}
                    alt={first_name || 'Groomer'}
                    className="w-[40px] h-[40px] rounded-md object-cover"
                />

                <div className="flex-1">
                    <div className="flex gap-1 items-center">
                        <p className="font-inter font-bold text-sm text-primary-dark">
                            {first_name} {last_name?.[0]}.
                        </p>
                        <button onClick={() => onInfoClick?.(groomer)}>
                            <img src={Info} alt="Info" className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="font-inter text-xs text-gray-500 mt-1">{groomer_type || 'Preferred Groomer'}</p>
                </div>

                <div className="flex gap-2">
                    <ActionIcon icon={isAllowedMessage
                        ? 'https://dev.groomit.me/v7/images/webapp/icons/message-color.svg'
                        : 'https://dev.groomit.me/v7/images/webapp/icons/message-gray.svg'}
                    />
                    <ActionIcon icon={isAllowedCall
                        ? 'https://dev.groomit.me/v7/images/webapp/icons/call-color.svg'
                        : 'https://dev.groomit.me/v7/images/webapp/icons/call-gray.svg'}
                    />
                </div>
            </div>

            <p className="mt-2 font-inter text-xs text-gray-600">
                Calling is available only through the app
            </p>
        </div>
    );
};

/* 💇 Refund Status */
const RefundStatus = ({ cards }) => {
    if (!cards || cards.length === 0) return null;

    const card = cards[0];

    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-3">
                <img
                    src={Refund}
                    alt="Refund"
                    className="w-9 h-9 object-cover"
                />
                <div className="flex-1">
                    <p className="font-inter font-semibold text-base text-primary-dark">
                        Refunds Issued
                    </p>
                    <p className="font-inter text-sm text-primary-light">
                        {card.card_number ? `**** **** **** ${card.card_number}` : "**** **** **** ****"}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-primary-line pt-3 flex flex-col gap-2">
                <p className="font-inter text-sm text-gray-600 mb-2">
                    There are refunds in your account.
                </p>
                <button
                    className="w-full h-[40px] rounded-[10px] text-white font-medium bg-primary-dark hover:bg-primary-light transition-colors"
                >
                    Review Refunds
                </button>
            </div>
        </div>
    );
};

/* 🧩 Small reusable icon button */
const ActionIcon = ({ icon }) => (
    <div className="w-[40px] h-[40px] flex items-center justify-center border border-line rounded-[10px] hover:bg-gray-50 transition">
        <img src={icon} alt="action" className="w-6 h-6" />
    </div>
);