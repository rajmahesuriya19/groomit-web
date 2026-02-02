import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

import infoGrey from "@/assets/icon/info-circle-grey.svg";
import FillStar from "@/assets/icon/fill-red-star.svg";
import FallbackGroomer from '../../../assets/icon/user-photo-empty.jpg';
import { useNavigate } from "react-router";
import BookingGroomerDetailsModal from "@/components/Modals/BookingGroomerDetailsModal";
import GroomerReviewsModal from "@/components/Modals/GroomerReviewsModal";
import { setSelectedGroomerr } from "@/utils/store/slices/booking-flow/bookingFlowSlice";
import { useDispatch } from "react-redux";

const GroomerCard = ({ groomer }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedGroomer, setSelectedGroomer] = useState(null);
    const [groomerModalOpen, setGroomerModalOpen] = useState(false);
    const [groomerReviewModalOpen, setGroomerReviewModalOpen] = useState(false);
    const {
        name,
        rating,
        reviews,
        price,
        lastBooked,
        id
    } = groomer;

    return (
        <>
            <div className="flex flex-col p-[15px] gap-[10px] rounded-[15px] bg-white shadow-sm">
                {/* Last booked */}
                {lastBooked && <div className="pb-2">
                    <span className="inline-flex items-center px-[6px] py-[4px] rounded-full text-xs font-bold uppercase border border-primary-line">
                        Last booked on {lastBooked}
                    </span>
                </div>}

                <div className="flex justify-between items-center w-full">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        {/* Avatar placeholder */}
                        <img
                            src={groomer?.profile_photo_url || FallbackGroomer}
                            alt={groomer?.name || 'Groomer'}
                            className="w-[45px] h-[45px] rounded-[10px] object-cover shadow-sm"
                        />

                        <div className="flex flex-col gap-1">
                            <div className="flex gap-2 items-center">
                                <div className="text-base font-bold capitalize">
                                    {name}
                                </div>
                                <button type="button" onClick={() => {
                                    setSelectedGroomer(groomer);
                                    setGroomerModalOpen(true);
                                }}>
                                    <img
                                        src={infoGrey}
                                        alt="info"
                                        className="w-[20px] h-[20px]"
                                    />
                                </button>
                            </div>

                            <div className="flex gap-1 items-center">
                                <img src={FillStar} alt="rating" className="w-[20px] h-[20px]" />
                                {rating ? <div className="text-sm font-bold">
                                    {rating}
                                    <span className="text-sm font-normal underline ml-1 cursor-pointer" onClick={() => {
                                        setSelectedGroomer(groomer);
                                        setGroomerReviewModalOpen(true)
                                    }}
                                    >
                                        ({reviews} Reviews)
                                    </span>
                                </div> : (
                                    <div className="text-sm font-bold">New</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex gap-1 items-center">
                        <div className="text-xl font-bold">${price}</div>
                        <ChevronRight
                            size={30}
                            className="cursor-pointer text-primary-light"
                            onClick={() => {
                                dispatch(setSelectedGroomerr(groomer));
                                navigate(`/book/slot/groomer/${id}`);
                            }}
                        />
                    </div>
                </div>
            </div >

            <BookingGroomerDetailsModal
                open={groomerModalOpen}
                onClose={() => setGroomerModalOpen(false)}
                onSelect={() => navigate(`/book/slot/groomer/${id}`)}
                groomer={selectedGroomer}
            />
            <GroomerReviewsModal
                open={groomerReviewModalOpen}
                onClose={() => setGroomerReviewModalOpen(false)}
                onSelect={() => navigate(`/book/slot/groomer/${id}`)}
                groomer={selectedGroomer}
            />
        </>
    );
};

export default GroomerCard;
