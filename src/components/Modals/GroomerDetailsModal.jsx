import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import { useDispatch } from 'react-redux';
import heartFilled from '../../assets/icon/fav-yes.png';
import heartGrey from '../../assets/icon/fav-no.png';
import blocked from '../../assets/icon/blocked.svg';

import StarGray from '../../assets/icon/star-gray.svg';
import Location from '../../assets/icon/location.svg';
import Scissor from '../../assets/icon/scissor-black.svg';
import Clock from '../../assets/icon/clock-gray.svg';
import { addGroomerFav, removeGroomerFav, toggleFavLocal } from '@/utils/store/slices/groomersList/groomersListSlice';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
    width: '90%',
    maxWidth: 400,
    outline: 'none',
};

const GroomerDetailsModal = ({ open, onClose, groomer }) => {
    const dispatch = useDispatch();

    const handleFav = (id, isFav) => {
        // optimistic local toggle
        dispatch(toggleFavLocal(id));

        // use current flag to decide API call
        const nextIsFav = !isFav;

        if (nextIsFav) {
            dispatch(addGroomerFav(id));
        } else {
            dispatch(removeGroomerFav(id));
        }
    };


    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative text-center font-inter">
                {/* Close */}
                <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                    <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                </IconButton>

                <div className="flex justify-between items-center py-6">
                    <div className="flex items-center gap-4 w-full">
                        {groomer?.profile_photo_url && (
                            <img
                                src={groomer?.profile_photo_url}
                                alt={groomer?.name}
                                className="rounded-md w-[50px] h-[50px]"
                            />
                        )}
                        <div className="flex flex-col gap-1 w-[219px]">
                            <div className="flex items-center gap-1">
                                <h4 className="text-base font-bold text-primary-dark leading-[22px] tracking-[-0.01em] font-inter">
                                    {groomer?.name}
                                </h4>
                            </div>
                        </div>
                    </div>
                    {groomer?.blocked_by ? (
                        <button className="cursor-pointer">
                            <img
                                src={blocked}
                                alt="Blocked"
                                className="w-[40px] h-[36px]"
                            />
                        </button>
                    ) : (
                        <>
                            <button
                                key={groomer?.groomer_id}
                                className="cursor-pointer"
                                onClick={() => handleFav(groomer?.groomer_id, groomer?.is_fav_groomer)}
                            >
                                <img
                                    src={groomer?.is_fav_groomer ? heartFilled : heartGrey}
                                    alt={groomer?.is_fav_groomer ? "Favourite" : "Not Favourite"}
                                    className={`w-[40px] h-[36px] cursor-pointer 
    ${groomer?.is_fav_groomer ? "rounded-[10px] shadow-md" : ""}`}
                                />
                            </button>
                        </>
                    )}
                </div>

                <div className='pb-6'>
                    <h4 className="text-left text-base font-bold text-primary-dark leading-[22px] tracking-[-0.01em] font-inter">
                        About Me
                    </h4>
                    <p className="text-primary-dark text-sm text-left">{groomer?.bio}</p>
                </div>

                <div className="flex flex-col gap-6">
                    {/* Row 1 */}
                    <div className="flex gap-6">
                        {/* Gold Package */}
                        <div className="flex gap-4 items-start w-1/2 min-w-0">
                            <div className="w-[35px] h-[35px] p-[7px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-center shrink-0" onClick={() => handleFav(groomer?.groomer_id, groomer.is_fav_groomer)}>
                                <img src={StarGray} alt="Star" className="w-[21px] h-[21px]" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-inter text-left font-bold text-[14px] leading-[18px] truncate">
                                    {groomer?.rating_avg}
                                </div>
                                <div className="font-inter text-left text-[#3064A3] underline cursor-pointer font-normal text-[14px] leading-[18px] truncate">
                                    {groomer?.rating_qty} Ratings
                                </div>
                            </div>
                        </div>

                        {/* Years of Experience */}
                        <div className="flex gap-4 items-start w-1/2 min-w-0">
                            <div className="w-[35px] h-[35px] p-[7px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-center shrink-0">
                                <img src={Clock} alt="Clock" className="w-[21px] h-[21px]" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-inter text-left font-bold text-[14px] leading-[18px] truncate">
                                    {groomer?.groomer_exp_years} Years
                                </div>
                                <div className="font-inter text-left font-normal text-[14px] leading-[18px] truncate">
                                    of Experience
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="flex gap-6">
                        {/* On Groomit App */}
                        <div className="flex gap-4 items-start w-1/2 min-w-0">
                            <div className="w-[35px] h-[35px] p-[7px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-center shrink-0">
                                <img src={Scissor} alt="Scissor" className="w-[21px] h-[21px]" />
                            </div>
                            <div className="min-w-0">
                                <div className="font-inter text-left font-bold text-[14px] leading-[18px] truncate">
                                    {groomer?.groomer_pet_serviced_count} Pets Serviced
                                </div>
                                <div className="font-inter text-left font-normal text-[14px] leading-[18px] truncate">
                                    Years on Groomit App
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex gap-4 items-start w-1/2 min-w-0">
                            <div className="w-[35px] h-[35px] p-[7px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-center shrink-0">
                                <img src={Location} alt="Location" className="w-[21px] h-[21px]" />
                            </div>

                            <div className="min-w-0">
                                {groomer?.groomer_service_area?.map((area, idx) => (
                                    <div
                                        key={idx}
                                        className={`font-inter text-left text-[14px] leading-[18px] truncate ${idx === 0 ? "font-bold" : "font-normal"
                                            }`}
                                    >
                                        {area}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </Box>
        </Modal>
    );
};

export default GroomerDetailsModal;
