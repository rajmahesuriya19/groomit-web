import * as React from 'react';
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
export default function RateServiceAccordion({ ratings }) {
    const [expanded, setExpanded] = React.useState(true);

    const [groomerRating, setGroomerRating] = React.useState(ratings?.groomer_rating || 0);
    const [supportRating, setSupportRating] = React.useState(ratings?.customer_support_rating || 0);
    const [bookingRating, setBookingRating] = React.useState(ratings?.booking_experience_rating || 0);
    const [groomerComment, setGroomerComment] = React.useState(ratings?.groomer_rating_comment || "");
    const [bookingComment, setBookingComment] = React.useState(ratings?.booking_experience_comment || "");
    const [hideReview, setHideReview] = React.useState(ratings?.is_public === "0");

    return (
        <div className="w-full">
            <Accordion expanded={expanded}>
                <AccordionSummary onClick={() => setExpanded(!expanded)}>
                    <div className="flex items-center gap-3">
                        <div className="flex justify-center items-center bg-[#F2F2F2] rounded-[10px] w-[40px] h-[40px]">
                            <img src={GrayStar} alt='Rating' className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-start justify-center">
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
                            {ratings?.is_public === "1" && <textarea
                                placeholder="Write a review (Optional)"
                                value={groomerComment}
                                onChange={(e) => setGroomerComment(e.target.value)}
                                className="w-full h-[52px] mt-2 p-3 border border-gray-300 rounded-[10px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
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
                                {ratings?.is_public === "1" && <textarea
                                    placeholder="Write a review (Optional)"
                                    value={bookingComment}
                                    onChange={(e) => setBookingComment(e.target.value)}
                                    className="w-full h-[52px] mt-2 p-3 border border-gray-300 rounded-[10px] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={3}
                                />}
                            </div>
                        </div>

                        {/* Review Options */}
                        {ratings?.is_public === "1" && <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={hideReview}
                                    onChange={() => setHideReview(!hideReview)}
                                    className="accent-red-500 w-[22px] h-[22px]"
                                />
                                <span className="text-base font-normal text-primary-dark">
                                    Hide my review from other users.
                                </span>
                            </label>

                            <button
                                className={`w-full h-[38px] rounded-[10px] text-white font-medium ${hideReview ? 'bg-primary-line cursor-not-allowed' : 'bg-primary-dark cursor-pointer'}`}
                            >
                                {hideReview ? 'Submit' : 'Re-Submit'}
                            </button>
                        </div>}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}

