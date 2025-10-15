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
import PackageSection from '../PackageSection';

const UpdatesMadeByGroomerDetail = ({ selectedAppointment }) => {
    const [groomerModal, setGroomerModal] = useState(false);
    const [selectedGroomer, setSelectedGroomer] = useState(null);

    const address = selectedAppointment?.address
        ? `${selectedAppointment.address.address1}, ${selectedAppointment.address.city}, ${selectedAppointment.address.state}, ${selectedAppointment.address.zip}`
        : 'N/A';
    return (
        <>
            <Card borderColor="#FF8A00">
                <AppointmentHeader appointment={selectedAppointment} />
                {selectedAppointment?.update_addons_arr &&
                    Object.keys(selectedAppointment.update_addons_arr).length > 0 && (
                        <PackageSection addons={selectedAppointment} />
                    )}
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
                    {selectedAppointment?.pets?.length > 1 && <div className="flex items-center">
                        <div className="font-inter font-normal text-[#3064A3] text-sm">Details</div>
                        <ChevronRight size={15} className="text-[#3064A3]" />
                    </div>}
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

export default UpdatesMadeByGroomerDetail;

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