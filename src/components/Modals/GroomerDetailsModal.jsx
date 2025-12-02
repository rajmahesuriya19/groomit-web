import React, { useEffect, useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import { useDispatch, useSelector } from 'react-redux';
import heartFilled from '../../assets/icon/fav-yes.png';
import heartGrey from '../../assets/icon/fav-no.png';
import blocked from '../../assets/icon/blocked.svg';
import blockedGrey from '../../assets/icon/blocked-grey.svg';
import FallbackGroomer from '../../assets/icon/user-photo-empty.jpg';
import StarGray from '../../assets/icon/star-gray.svg';
import Location from '../../assets/icon/location.svg';
import Scissor from '../../assets/icon/scissor-black.svg';
import Clock from '../../assets/icon/clock-gray.svg';
import FillStar from '../../assets/icon/fill-star.svg';
import { addBlockedGroomer, addGroomerFav, removeBlockedGroomer, removeGroomerFav, toggleBlockLocal, toggleFavLocal } from '@/utils/store/slices/groomersList/groomersListSlice';
import BlockModal from './BlockModal';

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

const GroomerDetailsModal = ({ type, open, onClose, groomer }) => {
    const dispatch = useDispatch();
    const { groomers } = useSelector((state) => state.groomers);

    const [localGroomer, setLocalGroomer] = useState(groomer || null);
    const [blockModal, setBlockModal] = useState(false);

    useEffect(() => {
        if (!groomer) return;
        const updated = groomers.find((g) => g.groomer_id === groomer.groomer_id);
        setLocalGroomer(updated || groomer);
    }, [groomers, groomer]);

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

    const handleBlock = (id, isBlocked) => {
        dispatch(toggleBlockLocal(id));

        if (isBlocked) {
            dispatch(removeBlockedGroomer(id));
        } else {
            dispatch(addBlockedGroomer(id));
        }
    };

    if (!localGroomer) return null;

    console.log(localGroomer);


    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle} className="relative text-center font-inter">
                    {/* Close */}
                    <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                        <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                    </IconButton>

                    <div className="flex justify-between items-center py-6">
                        <div className="flex gap-2">
                            {localGroomer?.profile_photo_url ? (
                                <img
                                    src={localGroomer?.profile_photo_url}
                                    alt={localGroomer?.name}
                                    className="rounded-[10px] w-[45px] h-[45px]"
                                />
                            ) : (
                                <img
                                    src={FallbackGroomer}
                                    alt={localGroomer?.name}
                                    className="rounded-[10px] w-[45px] h-[45px]"
                                />
                            )}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-base font-bold text-primary-dark leading-[22px] tracking-[-0.01em] font-inter">
                                        {localGroomer?.name}
                                    </h4>
                                    {((localGroomer?.rating_avg > 0) || (localGroomer?.rating_qty > 0)) && (
                                        <div
                                            className="flex items-center justify-center rounded-[25px] border border-primary-line px-[6px] py-[4px] gap-1"
                                        >
                                            {
                                                localGroomer?.rating_avg > 0 && (
                                                    <>
                                                        <img
                                                            src={FillStar}
                                                            alt="rating"
                                                        />

                                                        <span className="font-inter font-bold text-xs leading-[8px]">
                                                            {localGroomer?.rating_avg}
                                                        </span>
                                                    </>
                                                )
                                            }
                                        </div>
                                    )}
                                </div>
                                <div className='font-normal text-sm capitalize'>Last booked on 03/20/25</div>
                            </div>
                        </div>
                        <div className='flex gap-2 align-middle'>
                            <button
                                className="cursor-pointer"
                                onClick={() => handleFav(localGroomer.groomer_id, localGroomer.is_fav_groomer)}
                            >
                                <img
                                    src={localGroomer.is_fav_groomer ? heartFilled : heartGrey}
                                    alt={localGroomer?.is_fav_groomer ? "Favourite" : "Not Favourite"}
                                    className={`w-[35px] h-[35px] cursor-pointer 
                                                                    ${localGroomer?.is_fav_groomer ? "rounded-[10px] border border-primary-line shadow-[0_5px_15px_rgba(0,0,0,0.15)]" : ""}`}
                                />
                            </button>
                            <button
                                className={`${localGroomer.blocked_by ? 'flex p-[7px] items-center rounded-[10px] border border-primary-line shadow-[0_5px_15px_rgba(0,0,0,0.15)]' : ''}`}
                                onClick={() => setBlockModal(true)}
                            >
                                <img src={localGroomer.blocked_by ? blocked : blockedGrey}
                                    className={`${localGroomer.blocked_by ? 'w-[21px] h-[21px]' : 'w-[35px] h-[40px]'}`} />
                            </button>
                        </div>
                    </div>

                    <div className='pb-6'>
                        <h4 className="text-left text-base font-bold text-primary-dark leading-[22px] tracking-[-0.01em] font-inter">
                            About Me
                        </h4>
                        <p className="text-primary-dark text-sm text-left">{localGroomer?.bio}</p>
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* Row 1 */}
                        <div className="flex gap-6">
                            {/* Gold Package */}
                            <div className="flex gap-4 items-start w-1/2 min-w-0">
                                <div className="w-[35px] h-[35px] p-[7px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-center shrink-0" onClick={() => handleFav(localGroomer?.groomer_id, localGroomer.is_fav_groomer)}>
                                    <img src={StarGray} alt="Star" className="w-[21px] h-[21px]" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-inter text-left font-bold text-[14px] leading-[18px] truncate">
                                        {localGroomer?.rating_avg}
                                    </div>
                                    <a href={`https://groomit.me/reviews/${localGroomer?.groomer_id}`} target='_blank' className="font-inter text-left text-[#3064A3] underline cursor-pointer font-normal text-[14px] leading-[18px] truncate">
                                        {localGroomer?.rating_qty} Ratings
                                    </a>
                                </div>
                            </div>

                            {/* Years of Experience */}
                            <div className="flex gap-4 items-start w-1/2 min-w-0">
                                <div className="w-[35px] h-[35px] p-[7px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-center shrink-0">
                                    <img src={Clock} alt="Clock" className="w-[21px] h-[21px]" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-inter text-left font-bold text-[14px] leading-[18px] truncate">
                                        {localGroomer?.groomer_exp_years} Years
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
                                        {localGroomer?.groomer_pet_serviced_count} Pets Serviced
                                    </div>
                                    <div className="font-inter text-left font-normal text-[14px] leading-[18px] truncate">
                                        Years on Groomit App
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            {localGroomer?.groomer_service_area.length > 0 && <div className="flex gap-4 items-start w-1/2 min-w-0">
                                <div className="w-[35px] h-[35px] p-[7px] rounded-[10px] bg-[#F2F2F2] flex items-center justify-center shrink-0">
                                    <img src={Location} alt="Location" className="w-[21px] h-[21px]" />
                                </div>

                                <div className="min-w-0">
                                    {localGroomer?.groomer_service_area?.map((area, idx) => (
                                        <div
                                            key={idx}
                                            className={`font-inter text-left text-[14px] leading-[18px] truncate ${idx === 0 ? "font-bold" : "font-normal"
                                                }`}
                                        >
                                            {area}
                                        </div>
                                    ))}
                                </div>
                            </div>}
                        </div>
                    </div>
                </Box>
            </Modal>

            <BlockModal
                type={localGroomer?.is_blocked_groomer ? 'Unblock' : ''}
                open={blockModal}
                onClose={() => setBlockModal(false)}
                onConfirm={() => {
                    handleBlock(localGroomer.groomer_id, localGroomer.is_blocked_groomer);
                    setBlockModal(false);
                    onClose();
                }}
                title={localGroomer?.is_blocked_groomer ? `Unblock ${localGroomer?.name}` : `Block ${localGroomer?.name}`}
                description={`Are you sure you want to ${localGroomer?.is_blocked_groomer ? 'Unblock' : 'block'} this groomer`}
            />
        </>
    );
};

export default GroomerDetailsModal;
