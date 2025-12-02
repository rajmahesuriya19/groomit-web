import React, { useEffect, useState } from 'react';
import SupportItems from '@/common/SupportItems/SupportItems';
import { useDispatch, useSelector } from 'react-redux';

// components
import heartFilled from '../../assets/icon/fav-yes.png';
import heartGrey from '../../assets/icon/fav-no.png';
import Scissor from '../../assets/icon/scissor-grey.svg';
import infoGrey from '../../assets/icon/info-circle-grey.svg';
import FillStar from '../../assets/icon/fill-star.svg';
import blocked from '../../assets/icon/blocked.svg';
import FallbackGroomer from '../../assets/icon/user-photo-image.png';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { addBlockedGroomer, addGroomerFav, getGroomersList, removeBlockedGroomer, removeGroomerFav, toggleBlockLocal, toggleFavLocal } from '@/utils/store/slices/groomersList/groomersListSlice';
import GroomerDetailsModal from '@/components/Modals/GroomerDetailsModal';
import BlockModal from '@/components/Modals/BlockModal';

const EmptyState = ({ title, description, buttonText }) => (
    <div className="flex flex-col items-center justify-center h-[500px] w-full gap-2 p-0">
        <img src={Scissor} alt="Scissor" className="w-[60px] h-[60px]" />
        <div className="font-inter font-bold text-xl text-center">{title}</div>
        <div className="font-inter font-normal text-base text-center">{description}</div>
        <button
            type="button"
            className="h-[50px] px-[27px] bg-primary-dark text-white rounded-[10px] hover:opacity-90 transition"
        >
            {buttonText}
        </button>
    </div>
);

const Groomers = () => {
    const { showLoader, hideLoader } = useLoader();
    const dispatch = useDispatch();

    const [groomerModal, setGroomerModal] = useState(false);
    const [selectedGroomer, setSelectedGroomer] = useState(null);
    const [blockModal, setBlockModal] = useState(false);

    const groomers = useSelector((state) => state.groomers.groomers);

    const handleFav = (id, isFav) => {
        dispatch(toggleFavLocal(id));

        if (isFav) {
            dispatch(removeGroomerFav(id));
        } else {
            dispatch(addGroomerFav(id));
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


    useEffect(() => {
        const fetchData = async () => {
            try {
                showLoader();

                await Promise.all([
                    dispatch(getGroomersList())
                ]);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                hideLoader();
            }
        };

        fetchData();
    }, [dispatch]);

    const likedGroomers = groomers.filter(g => g.is_fav_groomer);
    const blockedGroomers = groomers.filter(g => g.is_blocked_groomer || g.blocked_by);
    const otherGroomers = groomers.filter(
        g => !g.is_fav_groomer && !g.is_blocked_groomer
    );

    return (
        <>
            <div className="px-5 py-6 grid grid-cols-1 md:grid-cols-[minmax(0,1.25fr)_auto_minmax(0,1fr)] gap-8">
                {groomers.length === 0 ? (
                    <EmptyState
                        title="No groomers yet"
                        description={<>
                            Your groomers will appear here once you’ve <br /> booked an appointment
                        </>}
                        buttonText="Book Appointment"
                    />
                ) : <div className="space-y-6">
                    {/* ⭐ Liked Groomers */}
                    {likedGroomers.length > 0 && (
                        <div>
                            <h2 className="text-base font-inter font-bold text-primary-dark mb-4">
                                Liked Groomers
                            </h2>

                            {likedGroomers.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-start p-4 rounded-2xl bg-white mb-3 w-full"
                                >
                                    <div className="flex justify-between items-center w-full">

                                        {/* Left */}
                                        <div className="flex items-start gap-2">
                                            <img
                                                src={item.profile_photo_url || FallbackGroomer}
                                                alt={item.name}
                                                className="rounded-[10px] w-[45px] h-[45px]"
                                            />


                                            <div className="flex flex-col gap-1">
                                                <div className='flex items-start gap-2'>
                                                    <span className="font-bold mb-1 text-primary-dark text-sm">
                                                        {item.name}
                                                    </span>
                                                    <button onClick={() => { setSelectedGroomer(item); setGroomerModal(true); }}>
                                                        <img src={infoGrey} className="w-[20px] h-[20px]" />
                                                    </button>
                                                </div>

                                                {((item.rating_avg > 0) || (item.rating_qty > 0)) && (
                                                    <div
                                                        className="flex items-center justify-center rounded-[25px] border border-primary-line px-[6px] py-[4px] gap-1"
                                                    >
                                                        {
                                                            item.rating_avg > 0 && (
                                                                <>
                                                                    <img
                                                                        src={FillStar}
                                                                        alt="rating"
                                                                    />

                                                                    <span className="font-inter font-bold text-xs leading-[8px]">
                                                                        {item.rating_avg}
                                                                    </span>
                                                                </>
                                                            )
                                                        }

                                                        {item.rating_qty > 0 && (
                                                            <span className="font-inter font-bold text-xs leading-[8px]">
                                                                {item.rating_avg > 0 ? `| ${item.rating_qty}` : item.rating_qty}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Fav box */}
                                        <button
                                            className="cursor-pointer"
                                            onClick={() => handleFav(item.groomer_id, item.is_fav_groomer)}
                                        >
                                            <img
                                                src={item.is_fav_groomer ? heartFilled : heartGrey}
                                                alt={item?.is_fav_groomer ? "Favourite" : "Not Favourite"}
                                                className={`w-[35px] h-[35px] cursor-pointer 
                                            ${item?.is_fav_groomer ? "rounded-[10px] border border-primary-line shadow-[0_5px_15px_rgba(0,0,0,0.15)]" : ""}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 📌 Other Groomers */}
                    {otherGroomers.length > 0 && (
                        <div>
                            <h2 className="text-base font-inter font-bold text-primary-dark mb-4">
                                Other Groomers
                            </h2>

                            {otherGroomers.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-start p-4 rounded-2xl bg-white mb-3 w-full"
                                >
                                    <div className="flex justify-between items-center w-full">

                                        {/* Left */}
                                        <div className="flex items-start gap-2">
                                            <img
                                                src={item.profile_photo_url || FallbackGroomer}
                                                alt={item.name}
                                                className="rounded-[10px] w-[45px] h-[45px]"
                                            />


                                            <div className="flex flex-col gap-1">
                                                <div className='flex items-start gap-2'>
                                                    <span className="font-bold mb-1 text-primary-dark text-sm">
                                                        {item.name}
                                                    </span>
                                                    <button onClick={() => { setSelectedGroomer(item); setGroomerModal(true); }}>
                                                        <img src={infoGrey} className="w-[20px] h-[20px]" />
                                                    </button>
                                                </div>

                                                {((item.rating_avg > 0) || (item.rating_qty > 0)) && (
                                                    <div
                                                        className="flex items-center justify-center rounded-[25px] border border-primary-line px-[6px] py-[4px] gap-1"
                                                    >
                                                        {
                                                            item.rating_avg > 0 && (
                                                                <>
                                                                    <img
                                                                        src={FillStar}
                                                                        alt="rating"
                                                                    />

                                                                    <span className="font-inter font-bold text-xs leading-[8px]">
                                                                        {item.rating_avg}
                                                                    </span>
                                                                </>
                                                            )
                                                        }

                                                        {item.rating_qty > 0 && (
                                                            <span className="font-inter font-bold text-xs leading-[8px]">
                                                                {item.rating_avg > 0 ? `| ${item.rating_qty}` : item.rating_qty}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Fav box */}
                                        <button
                                            className="cursor-pointer"
                                            onClick={() => handleFav(item.groomer_id, item.is_fav_groomer)}
                                        >
                                            <img
                                                src={item.is_fav_groomer ? heartFilled : heartGrey}
                                                alt={item?.is_fav_groomer ? "Favourite" : "Not Favourite"}
                                                className={`w-[35px] h-[35px] cursor-pointer 
                                            ${item?.is_fav_groomer ? "rounded-[10px] border border-primary-line shadow-[0_5px_15px_rgba(0,0,0,0.15)]" : ""}`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* 🚫 Blocked Groomers */}
                    {blockedGroomers.length > 0 && (
                        <div>
                            <h2 className="text-base font-inter font-bold text-primary-dark mb-4">
                                Blocked Groomers
                            </h2>

                            {blockedGroomers.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-start p-4 rounded-2xl bg-white mb-3 w-full"
                                >
                                    <div className="flex justify-between items-center w-full">

                                        {/* Left */}
                                        <div className="flex items-start gap-2">
                                            <img
                                                src={item.profile_photo_url || FallbackGroomer}
                                                alt={item.name}
                                                className="rounded-[10px] w-[45px] h-[45px]"
                                            />


                                            <div className="flex flex-col gap-1">
                                                <div className='flex items-start gap-2'>
                                                    <span className="font-bold mb-1 text-primary-dark text-sm">
                                                        {item.name}
                                                    </span>
                                                    <button onClick={() => { setSelectedGroomer(item); setGroomerModal(true); }}>
                                                        <img src={infoGrey} className="w-[20px] h-[20px]" />
                                                    </button>
                                                </div>

                                                {((item.rating_avg > 0) || (item.rating_qty > 0)) && (
                                                    <div
                                                        className="flex items-center justify-center rounded-[25px] border border-primary-line px-[6px] py-[4px] gap-1"
                                                    >
                                                        {
                                                            item.rating_avg > 0 && (
                                                                <>
                                                                    <img
                                                                        src={FillStar}
                                                                        alt="rating"
                                                                    />

                                                                    <span className="font-inter font-bold text-xs leading-[8px]">
                                                                        {item.rating_avg}
                                                                    </span>
                                                                </>
                                                            )
                                                        }

                                                        {item.rating_qty > 0 && (
                                                            <span className="font-inter font-bold text-xs leading-[8px]">
                                                                {item.rating_avg > 0 ? `| ${item.rating_qty}` : item.rating_qty}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Block Icon */}
                                        <button
                                            className="flex p-[7px] items-center rounded-[10px] border border-primary-line shadow-[0_5px_15px_rgba(0,0,0,0.15)]"
                                            onClick={() => { setBlockModal(true); setSelectedGroomer(item) }}
                                        >
                                            <img src={blocked} className="w-[21px] h-[21px]" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>}

                {/* Divider */}
                <div className="hidden md:flex justify-center">
                    <div className="h-full w-[1px] bg-[#E4E4E4]" />
                </div>

                {/* Right Section */}
                <div className="space-y-4 w-full min-w-0 hidden md:block">
                    <SupportItems />
                </div>
            </div>

            <GroomerDetailsModal
                open={groomerModal}
                onClose={() => setGroomerModal(false)}
                groomer={selectedGroomer}
            />

            <BlockModal
                type={'Unblock'}
                open={blockModal}
                onClose={() => setBlockModal(false)}
                onConfirm={() => {
                    handleBlock(item.groomer_id, item.is_blocked_groomer);
                    setBlockModal(false);
                }}
                title={`Unblock ${selectedGroomer?.name}`}
                description={"Are you sure you want to Unblock this groomer"}
            />
        </>
    );
};

export default Groomers;
