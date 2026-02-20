import React, { useMemo } from "react";
import StarIcon from "../../../../assets/icon/fill-red-star.svg";
import StarBlank from "../../../../assets/icon/shadow-blank-star.svg";
import ExpandableText from "@/common/ExpandableText/ExpandableText";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const ReviewsSection = () => {
    const {
        reviews = [],
        averageRating,
        totalReviews,
    } = useSelector((state) => state.reviews);

    // Limit to 6 latest
    const latestReviews = useMemo(() => {
        return reviews.slice(0, 6);
    }, [reviews]);

    const renderStars = (rating) => {
        const rounded = Math.round(Number(rating));

        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => {
                    const isActive = i < rounded;

                    return (
                        <motion.img
                            key={i}
                            src={isActive ? StarIcon : StarBlank}
                            alt="star"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                                opacity: isActive ? 1 : 1,
                                scale: isActive ? 1 : 0.9,
                            }}
                            transition={{
                                duration: 0.3,
                                delay: i * 0.05,
                            }}
                            className="w-4 h-4"
                        />
                    );
                })}
            </div>
        );
    };

    if (!latestReviews.length) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-sm text-gray-500"
            >
                No reviews available.
            </motion.div>
        );
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full"
            >
                {/* Header */}
                <div className="flex justify-between items-center w-full">
                    <div className="text-base font-semibold text-primary-dark">
                        Reviews
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() =>
                            window.open(
                                "https://groomit.me/reviews",
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    >
                        <img src={StarIcon} alt="StarIcon" className="w-5 h-5" />
                        <div className="text-sm font-bold font-inter underline">
                            {Number(averageRating).toFixed(1)} ({totalReviews})
                        </div>
                    </motion.div>
                </div>

                {/* Reviews List */}
                <div className="w-full overflow-x-auto scrollbar-thin mt-3">
                    <div className="flex gap-3 w-max">
                        {latestReviews.map((review) => (
                            <div
                                key={review.appointment_id}
                                className="w-[261px] lg:w-[300px] flex-shrink-0 p-3 flex flex-col gap-3 rounded-lg border border-primary-line bg-white"
                            >
                                {/* Rating */}
                                <div className="flex gap-2 items-center">
                                    <div className="text-base font-semibold text-primary-dark">
                                        {Number(review.rating).toFixed(1)}
                                    </div>

                                    <div className="flex">
                                        {renderStars(review.rating)}
                                    </div>
                                </div>

                                {/* Comment */}
                                <ExpandableText
                                    text={
                                        review.rating_comments ||
                                        review.communication ||
                                        "Great service!"
                                    }
                                />

                                {/* User + Pet Info */}
                                {/* <div className="text-xs text-gray-500 capitalize">
                                {review.name} • {review.pet_name} • {review.city}
                            </div> */}

                                {/* Groomer Response */}
                                {/* {review.response && (
                                <div className="bg-gray-50 p-2 rounded-[10px] text-xs text-gray-600">
                                    <span className="font-semibold">Response:</span>{" "}
                                    <ExpandableText text={review.response} />
                                </div>
                            )} */}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default ReviewsSection;
