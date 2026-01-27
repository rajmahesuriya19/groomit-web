import React, { useMemo, useState } from 'react';
import { Modal, Box, IconButton, MenuItem, Select } from '@mui/material';

import Close from '../../assets/icon/close.svg';
import FillStar from '@/assets/icon/fill-star.svg';
import EmptyStar from '@/assets/icon/star-i.svg';
import { ChevronDown } from 'lucide-react';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: '0 50px 100px rgba(0,0,0,0.1)',
    p: '20px 20px 30px',
    width: '90%',
    maxWidth: 750,
    maxHeight: 600,
    overflowY: 'auto',
    outline: 'none',
};

const STATIC_GROOMER = {
    name: 'Sandra D.',
    rating: 4.6,
    reviewsCount: 147,

    reviewsList: [
        {
            rating: 5,
            userName: 'Nitesh G.',
            appointments: 108,
            location: 'New York, NY',
            date: '23 Oct, 2025',
            petName: 'Buddy',
            petBreed: 'American Golden Retriever',
            petAvatar: 'https://raj.dev.groomit.me/v7/images/icons/dog-avatar.svg',
        },
        {
            rating: 4,
            userName: 'Amit P.',
            appointments: 45,
            location: 'New Jersey',
            date: '12 Sep, 2025',
            petName: 'Rocky',
            petBreed: 'Labrador',
            petAvatar: 'https://raj.dev.groomit.me/v7/images/icons/dog-avatar.svg',
        },
        {
            rating: 3,
            userName: 'Sara L.',
            appointments: 12,
            location: 'Brooklyn, NY',
            date: '02 Aug, 2025',
            petName: 'Coco',
            petBreed: 'Poodle',
            petAvatar: 'https://raj.dev.groomit.me/v7/images/icons/dog-avatar.svg',
        },
        {
            rating: 2,
            userName: 'Rahul K.',
            appointments: 6,
            location: 'Queens, NY',
            date: '15 Jul, 2025',
            petName: 'Max',
            petBreed: 'Beagle',
            petAvatar: 'https://raj.dev.groomit.me/v7/images/icons/dog-avatar.svg',
        },
        {
            rating: 1,
            userName: 'John D.',
            appointments: 2,
            location: 'Manhattan, NY',
            date: '01 Jun, 2025',
            petName: 'Leo',
            petBreed: 'Husky',
            petAvatar: 'https://raj.dev.groomit.me/v7/images/icons/dog-avatar.svg',
        },
    ],
};

/* ⭐ Helper: Render Stars */
const RenderStars = ({ rating }) => {
    const roundedRating = Math.round(rating || 0);

    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(star => (
                <img
                    key={star}
                    src={star <= roundedRating ? FillStar : EmptyStar}
                    alt="star"
                    className="w-[20px]"
                />
            ))}
        </div>
    );
};

const GroomerReviewsModal = ({ open, onClose }) => {
    const [selectedRating, setSelectedRating] = useState("All");

    const groomer = STATIC_GROOMER;

    /* 🔽 Filter reviews based on dropdown */
    const filteredReviews = useMemo(() => {
        if (!groomer?.reviewsList) return [];

        // 👑 Show ALL reviews
        if (selectedRating === 'All') {
            return groomer.reviewsList;
        }

        // ⭐ Filter by rounded rating
        return groomer.reviewsList.filter(
            (review) => Math.round(review.rating) === selectedRating
        );
    }, [groomer, selectedRating]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative font-inter">
                {/* Close */}
                <IconButton
                    onClick={onClose}
                    className="!absolute !top-4 !right-4"
                    size="small"
                >
                    <img src={Close} alt="Close" className="w-6 h-6" />
                </IconButton>

                <div className="pt-8">
                    {/* HEADER */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold font-filson text-primary-dark">
                                {groomer?.name || 'Sandra D.'}
                            </h2>

                            <div className="flex items-center gap-2 mt-1">
                                <RenderStars rating={groomer?.rating} />
                                <span className="text-sm">
                                    {groomer?.rating}
                                    <span className="ml-1 text-primary-light">
                                        ({groomer?.reviewsCount})
                                    </span>
                                </span>
                            </div>
                        </div>

                        <Select
                            size="small"
                            value={selectedRating}
                            onChange={(e) => setSelectedRating(e.target.value)}
                            displayEmpty
                            IconComponent={(props) => (
                                <ChevronDown
                                    {...props}
                                    size={20}
                                    className="text-primary-dark mr-2"
                                />
                            )}
                            sx={{
                                borderRadius: '999px',
                                border: '1px solid #adb5bd',
                                fontSize: '14px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                px: 2,

                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '& .MuiSelect-select': {
                                    width: 'auto',
                                    paddingRight: '0px !important',
                                    display: 'flex',
                                    alignItems: 'center',
                                },
                            }}
                        >
                            {['All', 5, 4, 3, 2, 1].map((rating) => (
                                <MenuItem key={rating} value={rating}>
                                    <span className="text-sm font-inter">
                                        {rating === 'All' ? 'All Reviews' : `${rating} Star Reviews`}
                                    </span>
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    {/* REVIEWS */}
                    <div className="flex flex-col gap-4 mt-6">
                        {filteredReviews.length === 0 ? (
                            <div className="text-sm text-primary-light">
                                No reviews found for {selectedRating} stars.
                            </div>
                        ) : (
                            filteredReviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="border border-primary-line rounded-[10px] p-[15px] flex flex-col gap-3"
                                >
                                    <div className="flex items-center gap-2">
                                        <RenderStars rating={review.rating} />
                                        <span className="text-sm font-bold">
                                            {review.rating}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="text-sm font-bold">
                                            {review.userName}
                                            <span className="'text-primary-dark' ml-1">
                                                ( <span className='text-brand'>{review.appointments}</span> Appts.)
                                            </span>
                                        </div>
                                        <div className="text-xs text-primary-light">
                                            {review.location} | {review.date}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-sm font-bold">
                                                {review.petName}
                                            </div>
                                            <div className="text-xs text-primary-light">
                                                {review.petBreed}
                                            </div>
                                        </div>

                                        <img
                                            src={review.petAvatar}
                                            alt="pet"
                                            className="w-9 h-9 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default GroomerReviewsModal;
