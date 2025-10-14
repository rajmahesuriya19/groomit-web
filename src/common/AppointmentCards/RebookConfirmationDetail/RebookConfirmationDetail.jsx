import React from 'react'
import Card from '../Card'
import { ChevronRight } from 'lucide-react';

import Calender from '../../../assets/icon/calendar-black.svg';
import Home from '../../../assets/icon/home-selection-a.svg';
import Location from '../../../assets/icon/location.svg';
import CopyIcon from '../../../assets/icon/copyy.svg';
import AppointmentInfo from '@/common/AppointmentCard/AppointmentInfo';
import { formatAppointmentDate } from '@/common/helpers';
import MyPets from '../Pets Information/Pets';
import CopyTooltip from '@/common/CopyTooltip/CopyTooltip';

const RebookConfirmationDetail = ({ selectedAppointment }) => {
    const address = selectedAppointment?.address
        ? `${selectedAppointment.address.street}, ${selectedAppointment.address.city}, ${selectedAppointment.address.state}, ${selectedAppointment.address.zip}`
        : 'N/A';
    return (
        <>
            <Card borderColor="#FFBF00">
                <div>
                    <div className="flex justify-between items-center">
                        <CopyTooltip textToCopy={`#${selectedAppointment?.booking_session?.id}`}>
                            <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide cursor-pointer">
                                #{selectedAppointment?.booking_session?.id}
                                <img src={CopyIcon} alt="Copy" className="w-3 h-3 opacity-80 hover:opacity-100" />
                            </div>
                        </CopyTooltip>
                    </div>

                    <p className="font-inter font-bold text-base text-gray-800 mt-1">
                        Rebooking suggested by {selectedAppointment?.booking_session?.rebook_groomer?.first_name}
                    </p>
                </div>
                <RebookConfirmationSection appointment={selectedAppointment} />
            </Card>

            <Card>
                <AppointmentInfo
                    type="detail"
                    icon={Calender}
                    title={`${formatAppointmentDate(selectedAppointment?.booking_session?.display_date)} | ${selectedAppointment?.booking_session?.display_time}`}
                    subtitle="Requested Time"
                />
                <AppointmentInfo
                    icon={Home}
                    title={selectedAppointment?.booking_session?.serviceType === "Inhome" ? 'In Home' : 'Mobile Van'}
                    subtitle="Service Type"
                />
                <AppointmentInfo icon={Location} title={address} subtitle="Service Address" />
                <PreferredGroomer groomer={selectedAppointment?.booking_session?.rebook_groomer} />
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
        </>
    )
}

export default RebookConfirmationDetail;

/* 💇 Preferred Groomer */
const PreferredGroomer = ({ groomer }) => {
    if (!groomer) return null;

    const {
        first_name,
        last_name,
        profile_photo_url,
        groomer_type,
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
                    <p className="font-inter font-bold text-sm text-primary-dark">
                        {first_name} {last_name?.[0] || ''}.
                    </p>
                    <p className="font-inter text-xs text-gray-500 mt-1">{groomer_type || 'Preferred Groomer'}</p>
                </div>
            </div>
        </div>
    );
};

/* ✂️ Rebook Confirmation Actions */
const RebookConfirmationSection = ({ appointment }) => (
    <div>
        <ul className="font-inter font-normal text-xs mt-4 pt-3 border-t border-gray-200 list-disc list-inside space-y-2 text-primary-dark">
            <li>
                Your reserved slot will be canceled on{" "}
                <span className="font-semibold text-primary-dark">
                    {appointment?.booking_session?.apptCancelDateStarted}
                </span>{" "}
                at no charge if action is not taken.
            </li>
            <li>
                Once confirmed, you will be charged on{" "}
                <span className="font-semibold text-primary-dark">
                    {appointment?.booking_session?.apptChargeDateStarted}
                </span>.
            </li>
        </ul>

        <div>
            <div className="flex items-start mt-4 gap-3">
                <button className='font-inter font-bold text-base w-full h-[38px] rounded-[10px] border border-gray-200'>Change Date/Time</button>
                <button className='font-inter bg-primary-dark font-bold text-base text-white w-full h-[38px] rounded-[10px] border border-gray-200'>Confirm</button>
            </div>

            <div className='cursor-pointer mt-4 text-center font-inter font-normal text-sm underline text-[#3064A3]'>Reject Request</div>
        </div>
    </div>
);
