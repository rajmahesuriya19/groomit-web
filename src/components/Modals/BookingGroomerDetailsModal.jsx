import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';

import Close from '../../assets/icon/close.svg';
import FallbackGroomer from '../../assets/icon/user-photo-empty.jpg';

import FillStar from '@/assets/icon/fill-red-star.svg';
import PetPaw from '@/assets/icon/pet.svg';
import Location from '@/assets/icon/location.svg';
import Clock from '@/assets/icon/clock-black.svg';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
    width: '90%',
    maxWidth: 480,
    outline: 'none',
};

const BookingGroomerDetailsModal = ({ open, onClose, onSelect, groomer }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative font-inter">
                {/* Close */}
                <IconButton
                    onClick={onClose}
                    size="small"
                    className="!absolute !top-4 !right-4"
                >
                    <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                </IconButton>

                <div className="flex flex-col gap-4 px-6 py-8">
                    {/* Avatar */}
                    <div className="flex justify-center">
                        <img
                            src={groomer?.profile_photo_url || FallbackGroomer}
                            alt={groomer?.name || 'Groomer'}
                            className="w-[130px] h-[130px] rounded-[14px] object-cover shadow-sm"
                        />
                    </div>

                    {/* Name + Price */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold text-primary-dark">
                                {groomer?.name || 'Sandra D.'}
                            </h2>

                            <div className="flex items-center gap-1">
                                <img src={FillStar} alt="rating" className="w-[18px]" />
                                {groomer?.rating ? (
                                    <span className="text-sm font-semibold">
                                        {groomer.rating}
                                        <span className="ml-1 font-normal underline cursor-pointer">
                                            ({groomer.reviews} Reviews)
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-sm font-semibold">New</span>
                                )}
                            </div>
                        </div>

                        <div className="text-xl font-bold text-primary-dark">
                            ${groomer?.price}
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-primary-dark leading-relaxed text-left">
                        My name is Sandra. I am an advocate and animal lover, dogs hold a
                        special place in my heart as I don’t see my life without them since
                        I was a little girl.
                    </p>

                    {/* Info */}
                    <div className="flex flex-col gap-3 text-sm text-primary-dark">
                        <InfoRow icon={PetPaw} text="4 Pets Serviced On Groomit App" />
                        <InfoRow icon={Location} text="New York, New Jersey" />
                        <InfoRow icon={Clock} text="10 Years Of Experience" />
                    </div>

                    <Box className="flex gap-2 w-full mt-4">
                        <button
                            onClick={onSelect}
                            className="bg-primary-dark text-white text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full"
                        >
                            Continue
                        </button>
                    </Box>
                </div>
            </Box>
        </Modal>
    );
};

const InfoRow = ({ icon, text }) => (
    <div className="flex items-center gap-2">
        <img src={icon} alt="" className="w-[20px] h-[20px]" />
        <span>{text}</span>
    </div>
);

export default BookingGroomerDetailsModal;
