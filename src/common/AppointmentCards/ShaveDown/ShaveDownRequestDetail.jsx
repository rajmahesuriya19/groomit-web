import React, { useState } from 'react'
import Card from '../Card'
import { ChevronRight } from 'lucide-react';

import Info from '../../../assets/icon/info-circle-grey.svg';
import Calender from '../../../assets/icon/calendar-black.svg';
import Home from '../../../assets/icon/home-selection-a.svg';
import Location from '../../../assets/icon/location.svg';
import AppointmentInfo from '@/common/AppointmentCard/AppointmentInfo';
import { formatAppointmentDate } from '@/common/helpers';
import MyPets from '../Pets Information/Pets';
import Cards from '../Cards Section/Cards';
import AppointmentHeader from '../Appointment Detail Header/AppointmentHeader';
import GroomerDetailsModal from '@/components/Modals/GroomerDetailsModal';

const ShaveDownRequestDetail = ({ selectedAppointment }) => {
    const [groomerModal, setGroomerModal] = useState(false);
    const [selectedGroomer, setSelectedGroomer] = useState(null);

    const pet = selectedAppointment?.pets.find(
        (p) => p?.pet_id == selectedAppointment?.pet_id_requested_for_shave_down
    );

    const address = selectedAppointment?.address
        ? `${selectedAppointment.address.address1}, ${selectedAppointment.address.city}, ${selectedAppointment.address.state}, ${selectedAppointment.address.zip}`
        : 'N/A';
    return (
        <>
            <Card borderColor="#FF8A00">
                <AppointmentHeader appointment={selectedAppointment} />
                <ShaveDownSection pet={pet} />
            </Card>

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
                <PreferredGroomer
                    groomer={selectedAppointment?.groomer}
                    onInfoClick={(g) => {
                        setSelectedGroomer(g);
                        setGroomerModal(true);
                    }}
                />
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

export default ShaveDownRequestDetail;

/* ✂️ Shave Down Actions */
const ShaveDownSection = ({ pet }) => (
    <>
        <div>
            <p className="font-inter font-normal text-sm mt-4 pt-3 border-t border-gray-200">
                Removing mats can be painful and stressful. A shave-down may be the safest option and could reveal skin issues like irritation or parasites.
            </p>

            <p className="font-inter font-normal text-xs mt-4 pt-3 border-t border-gray-200 text-gray-600">
                If not approved, your groomer will try to remove the mats gently. But if your pet becomes too stressed, the appointment may be canceled and the full fee will still apply.
            </p>
            <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-gray-200">
                <p className="font-inter text-sm">{`Shave-Down for ${pet?.name ?? 'N/A'}`}</p>
                <div className="flex gap-3">
                    <button className="w-full h-[38px] rounded-[10px] border border-gray-200 font-inter font-bold text-base hover:bg-gray-50 transition">
                        Don’t Approve
                    </button>
                    <button className="w-full h-[38px] rounded-[10px] border border-gray-200 bg-primary-dark font-inter font-bold text-base text-white hover:opacity-90 transition">
                        Approve
                    </button>
                </div>
            </div>
        </div>
    </>
);

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
        <div className="mt-4 pt-3 border-t border-gray-200">
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

/* 🧩 Small reusable icon button */
const ActionIcon = ({ icon }) => (
    <div className="w-[40px] h-[40px] flex items-center justify-center border border-line rounded-[10px] hover:bg-gray-50 transition">
        <img src={icon} alt="action" className="w-6 h-6" />
    </div>
);