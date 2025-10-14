import { Tooltip } from '@mui/material';
import React, { useState } from 'react';

import CopyIcon from '../../../assets/icon/copyy.svg';
import Message from '../../../assets/icon/message-blue.svg';
import Call from '../../../assets/icon/call-green.svg';
import Info from '../../../assets/icon/info-circle-grey.svg';
import { ChevronRight } from 'lucide-react';
import CopyTooltip from '../../CopyTooltip/CopyTooltip';
import { useNavigate } from 'react-router';
import GroomerDetailsModal from '@/components/Modals/GroomerDetailsModal';

const ShaveDownRequest = ({ appointment }) => {
    const [groomerModal, setGroomerModal] = useState(false);
    const [selectedGroomer, setSelectedGroomer] = useState(null);

    const navigate = useNavigate();
    const pet = appointment?.pets.find(
        (p) => p?.pet_id == appointment?.pet_id_requested_for_shave_down
    );

    return (
        <>
            <div className="mb-4 p-5 bg-white rounded-2xl shadow-md border-t-4 border-[#FF8A00] hover:shadow-lg transition">

                {/* Header: ID & Status */}
                <div className="flex justify-between items-center">
                    <div className="cursor-pointer">
                        <CopyTooltip textToCopy={`#${appointment?.appointment_id}`}>
                            <div className="flex items-center gap-1 font-inter font-semibold text-xs uppercase text-primary-dark tracking-wide">
                                #{appointment?.appointment_id}
                                <img
                                    src={CopyIcon}
                                    alt="Copy"
                                    className="w-3 h-3 cursor-pointer opacity-80 hover:opacity-100 transition"
                                />
                            </div>
                        </CopyTooltip>

                        <p className="font-inter font-bold text-base text-gray-800 mt-1">
                            {appointment.appointment_status_label}
                        </p>
                        <p className="font-inter text-xs mt-1">Requested at 5:10PM</p>
                    </div>

                    <div className="cursor-pointer" onClick={() => navigate(`/user/appointment/${appointment?.appointment_id}`)}>
                        <ChevronRight size={24} className="text-primary-dark" />
                    </div>
                </div>

                {/* Preferred Groomer */}
                <PreferredGroomer
                    groomer={appointment?.groomer}
                    onInfoClick={(g) => {
                        setSelectedGroomer(g);
                        setGroomerModal(true);
                    }}
                />

                {/* Shave-Down Actions */}
                <div className="flex flex-col gap-3 mt-4 pt-3 border-t border-gray-200">
                    <p className="font-inter text-sm">{`Shave-Down for ${pet?.name ?? 'N/A'}`}</p>
                    <div className="flex gap-3">
                        <button className="w-full h-[38px] rounded-[10px] border border-gray-200 font-inter font-bold text-base">
                            Don’t Approve
                        </button>
                        <button className="w-full h-[38px] rounded-[10px] border border-gray-200 bg-primary-dark font-inter font-bold text-base text-white">
                            Approve
                        </button>
                    </div>
                </div>
            </div>

            <GroomerDetailsModal
                type={"appointments"}
                open={groomerModal}
                onClose={() => setGroomerModal(false)}
                groomer={selectedGroomer}
            />
        </>
    );
};

const PreferredGroomer = ({ groomer, onInfoClick }) => {
    if (!groomer) return null;

    return (
        <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-start gap-4">
                <img
                    src={groomer.profile_photo_url || 'https://www.groomit.me/v7/images/icons/profile-circle.svg'}
                    alt={groomer.first_name || 'Groomer'}
                    className="w-[40px] h-[40px] rounded-md object-cover"
                />
                <div className="flex-1">
                    <div className="flex gap-1 items-center">
                        <p className="font-inter font-bold text-sm text-primary-dark">
                            {groomer.first_name} {groomer.last_name?.[0]}.
                        </p>
                        <button onClick={() => onInfoClick?.(groomer)}>
                            <img src={Info} alt="Info" className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="font-inter text-xs text-gray-500 mt-1">{groomer.groomer_type || 'Preferred Groomer'}</p>
                </div>

                <div className="flex gap-2">
                    <ActionButton icon={groomer.isAllowedMessage ? Message : 'https://dev.groomit.me/v7/images/webapp/icons/message-gray.svg'} />
                    <ActionButton icon={groomer.isAllowedCall ? Call : 'https://dev.groomit.me/v7/images/webapp/icons/call-gray.svg'} />
                </div>
            </div>
            <p className="mt-2 font-inter text-xs text-gray-600">
                Calling is available only through the app
            </p>
        </div>
    );
};

const ActionButton = ({ icon }) => (
    <div className="w-[40px] h-[40px] flex items-center justify-center border border-line rounded-[10px]">
        <img src={icon} alt="action" className="w-6 h-6" />
    </div>
);

export default ShaveDownRequest;
