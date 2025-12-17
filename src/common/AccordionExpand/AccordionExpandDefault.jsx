import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, {
    accordionSummaryClasses,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ChevronDown } from 'lucide-react';

import GrayStar from "../../assets/icon/star-gray.svg"
import RatingStar from "../../assets/icon/rating-star.svg"
import FillStar from "../../assets/icon/rating-fill-star.svg"

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
    margin: 0,
    padding: 0,
    '&::before': { display: 'none' },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ChevronDown size={24} className="text-primary-light" />}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: 'rotate(180deg)',
    },

    [`& .${accordionSummaryClasses.content}`]: {
        margin: 0,
    },

    [`&.${accordionSummaryClasses.root}`]: {
        margin: 0,
        padding: 0,
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(() => ({
    padding: 0,
}));

const StarRating = ({ rating, onRate }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
            <button
                key={num}
                type="button"
                className="cursor-pointer relative w-[26px] h-[26px]"
                onClick={() => onRate(num)}
            >
                <img
                    src={RatingStar}
                    alt="Inactive Star"
                    className="absolute top-0 left-0 w-[26px] h-[26px]"
                />

                {num <= rating && (
                    <img
                        src={FillStar}
                        alt="Active Star"
                        className="absolute top-0 left-0 w-[26px] h-[26px]"
                    />
                )}
            </button>
        ))}
    </div>
);

// === Accordion Component ===
export default function RateServiceAccordion({ ratings, fromModal=false }) {
    const [expanded, setExpanded] = useState(true);

    const [groomerRating, setGroomerRating] = useState(parseInt(ratings?.groomer_rating));
    const [supportRating, setSupportRating] = useState(parseInt(ratings?.customer_support_rating));
    const [bookingRating, setBookingRating] = useState(parseInt(ratings?.booking_experience_rating));
    const [groomerComment, setGroomerComment] = useState(ratings?.groomer_rating_comment || "");
    const [bookingComment, setBookingComment] = useState(ratings?.booking_experience_comment || "");
    const [rateServiceCheckbox, setRateServiceCheckbox] = useState(false)
    const [isDisable, setIsDisable] = useState(true)
    
    let isReRating = ratings?.is_enabled_rating == 1;

    useEffect(() => {
        if (
          groomerRating !== 0 &&
          supportRating !== 0 &&
          bookingRating !== 0
        ) {
          setIsDisable(false)
        } else {
          setIsDisable(true)
        }
      }, [groomerRating, supportRating, bookingRating])

    return (
        <div className="w-full">
            <Accordion expanded={expanded}>
                <AccordionSummary onClick={() => setExpanded(!expanded)}>
                    <div className={fromModal ? "" :"flex items-center gap-3"}>
                        <div className="flex justify-center items-center bg-[#F2F2F2] rounded-[10px] w-[40px] h-[40px]">
                        <img src={RatingStar} alt="Rating" className="w-6 h-6" />
                        </div>
                        {/* <div className={"flex flex-col items-start justify-center"}> */}
                        <div
                            className={`flex flex-col justify-center ${
                            fromModal ? 'items-center text-center' : 'items-start text-left'
                            }`}
                        >
                            <span className="font-bold text-base">Rate Service</span>
                            <p className="text-sm">We appreciate your feedback</p>
                        </div>
                    </div>
                </AccordionSummary>

                <AccordionDetails>
                    <div className="py-3 flex flex-col gap-4">
                        {/* Groomer Rating */}
                        <div className="bg-[#F1F1F1] p-4 rounded-[10px] flex flex-col gap-3">
                            <h3 className="font-normal mb-2 text-base">Groomer Rating</h3>
                            <StarRating rating={groomerRating} onRate={setGroomerRating} />
                            {parseInt(ratings?.groomer_rating) && !isReRating 
                            ?  <>
                                {ratings?.groomer_rating_comment && (
                                <span  className='text-sm font-normal text-primary-dark'>
                                    {ratings?.groomer_rating_comment}
                                </span>
                                )}
                              </>
                             : <textarea
                                placeholder="Write a review (Optional)"
                                value={groomerComment}
                                onChange={(e) => setGroomerComment(e.target.value)}
                                className="w-full h-[52px] mt-2 p-3 border border-gray-300 rounded-[10px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary overflow-y-auto scrollbar-none"
                                rows={3}
                            />}
                        </div>

                        {/* Customer Support & Booking Experience */}
                        <div className="bg-[#F1F1F1] p-4 rounded-[10px] flex flex-col gap-4">
                            <div className="pb-4 border-b border-gray-300">
                                <h3 className="font-normal text-base mb-2">Customer Support</h3>
                                <StarRating rating={supportRating} onRate={setSupportRating} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="font-normal text-base">Booking Experience</h3>
                                <StarRating rating={bookingRating} onRate={setBookingRating} />
                                {parseInt(ratings?.booking_experience_rating) && !isReRating 
                                ?  <>
                                    {ratings?.booking_experience_comment && (
                                    <span  className='text-sm font-normal text-primary-dark'>
                                        {ratings?.booking_experience_comment}
                                    </span>
                                    )}
                                    </>
                                : <textarea
                                    placeholder="Write a review (Optional)"
                                    value={bookingComment}
                                    onChange={(e) => setBookingComment(e.target.value)}
                                    className="w-full h-[52px] mt-2 p-3 border border-gray-300 rounded-[10px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary overflow-y-auto scrollbar-none"
                                    rows={3}
                                />}
                            </div>
                        </div>

                        {/* Review Options */}
                        {(ratings?.isRatingEnable || isReRating) && <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rateServiceCheckbox}
                                    onChange={() => setRateServiceCheckbox(!rateServiceCheckbox)}
                                    className={`w-[22px] h-[22px] ${
                                        rateServiceCheckbox ? 'accent-primary-dark' : 'accent-gray-300'
                                      }`}
                                />
                                <span className="text-base font-normal text-primary-dark">
                                    Hide my review from other users.
                                </span>
                            </label>

                            <button
                                className={`w-full h-[38px] rounded-[10px] text-white font-medium ${isDisable ? 'bg-primary-line cursor-not-allowed' : 'bg-primary-dark cursor-pointer'}`}
                                disabled={isDisable}
                            >
                                {!isReRating ? 'Submit' : 'Re-Submit'}
                            </button>
                        </div>}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

