import React, { useState } from "react";
import { Modal, Box, IconButton, Fade, Backdrop, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Close from "../../../assets/icon/close.svg";
import StarIcon from "../../../assets/icon/fill-red-star.svg";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 30px 80px rgba(0,0,0,0.12)",
    width: "92%",
    maxWidth: 520,
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    outline: "none",
};

const scrollStyle = {
    overflowY: "auto",
    padding: "24px",
};

const tagBaseClass =
    "flex flex-col justify-center items-center gap-[10px] px-[10px] py-[5px] rounded-[15px] text-center font-inter text-sm transition-all duration-200 cursor-pointer";

const StarRating = React.memo(({ value, onChange }) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <motion.img
                    key={i}
                    src={StarIcon}
                    alt="star"
                    onClick={() => onChange(i + 1)}
                    initial={false}
                    animate={{ opacity: i < value ? 1 : 0.3 }}
                    transition={{ duration: 0.2 }}
                    className="w-[30px] h-[30px] cursor-pointer"
                />
            ))}
        </div>
    );
});

const TagList = React.memo(({ tags, selectedTags, onToggle }) => {
    return (
        <div className="flex items-center gap-3 flex-wrap">
            {tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                    <div
                        key={tag}
                        onClick={() => onToggle(tag)}
                        className={`flex flex-col justify-center items-center gap-[10px] px-[10px] py-[5px] rounded-[15px] text-center font-inter text-sm transition-all duration-200 cursor-pointer ${isSelected
                            ? "border-2 border-brand font-bold"
                            : "border border-primary-line font-normal"
                            } bg-white text-primary-dark`}
                    >
                        {tag}
                    </div>
                );
            })}
        </div>
    );
});

const RatingSection = React.memo(
    ({
        title,
        rating,
        onRatingChange,
        tags,
        selectedTags,
        onToggleTag,
        comment,
        onCommentChange,
        placeholder,
    }) => (
        <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex items-center justify-between w-full">
                <div className="text-base font-bold text-primary-dark">
                    {title}
                </div>
                <StarRating value={rating} onChange={onRatingChange} />
            </div>

            <TagList
                tags={tags}
                selectedTags={selectedTags}
                onToggle={onToggleTag}
            />

            <div className="w-full">
                <textarea
                    value={comment}
                    onChange={(e) => onCommentChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full min-h-[115px] rounded-[10px] border border-primary-line py-3 pl-3 pr-12 text-sm resize-none focus:outline-none"
                />
            </div>
        </div>
    )
);

const FeedbackModal = ({ open, onClose }) => {
    const [form, setForm] = useState({
        groomerRating: 0,
        groomerTags: [],
        groomerComment: "",
        groomitRating: 0,
        groomitTags: [],
        groomitComment: "",
    });

    const handleClose = () => onClose?.();

    const toggleTag = React.useCallback((section, tag) => {
        setForm((prev) => {
            const exists = prev[section].includes(tag);
            return {
                ...prev,
                [section]: exists
                    ? prev[section].filter((t) => t !== tag)
                    : [...prev[section], tag],
            };
        });
    }, []);

    const handleRatingChange = React.useCallback((key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleCommentChange = React.useCallback((key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleSubmit = async () => {
        const payload = {
            groomer: {
                rating: form.groomerRating,
                tags: form.groomerTags,
                comment: form.groomerComment,
            },
            groomit: {
                rating: form.groomitRating,
                tags: form.groomitTags,
                comment: form.groomitComment,
            },
        };

        console.log("Submitting:", payload);

        // 🔥 Replace with your API
        // await submitFeedback(payload)

        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{ backdrop: { timeout: 300 } }}
        >
            <Fade in={open}>
                <Box sx={modalStyle} className="font-inter relative">

                    <IconButton
                        onClick={handleClose}
                        className="!absolute !top-4 !right-4 z-10"
                        size="small"
                    >
                        <img src={Close} alt="Close" className="w-5 h-5" />
                    </IconButton>

                    <Box sx={scrollStyle}>
                        <div className="text-xl font-bold text-primary-dark mt-4 mb-1">
                            Give Feedback
                        </div>

                        <div className="text-sm text-primary-dark">
                            How was your experiences with groomer, booking and customer support.
                        </div>

                        <Divider className="!my-6 text-borderLight" />

                        <div className="flex flex-col items-start gap-5 w-full">

                            <RatingSection
                                title="Rate your Groomer"
                                rating={form.groomerRating}
                                onRatingChange={(val) => handleRatingChange("groomerRating", val)}
                                tags={[
                                    "Professional",
                                    "Skilled & Experienced",
                                    "Friendly",
                                    "On-Time",
                                    "Gentle with Pet",
                                    "Great Results",
                                ]}
                                selectedTags={form.groomerTags}
                                onToggleTag={(tag) => toggleTag("groomerTags", tag)}
                                comment={form.groomerComment}
                                onCommentChange={(val) => handleCommentChange("groomerComment", val)}
                                placeholder="Write about your experience with groomer"
                            />

                            <RatingSection
                                title="Rate Groomit"
                                rating={form.groomitRating}
                                onRatingChange={(val) => handleRatingChange("groomitRating", val)}
                                tags={[
                                    "Quick Confirmation",
                                    "Smooth Process",
                                    "Easy to Use",
                                    "Fast Booking",
                                    "Clear Time Slots",
                                    "Supportive Team",
                                ]}
                                selectedTags={form.groomitTags}
                                onToggleTag={(tag) => toggleTag("groomitTags", tag)}
                                comment={form.groomitComment}
                                onCommentChange={(val) => handleCommentChange("groomitComment", val)}
                                placeholder="Write about your experience with groomit"
                            />
                        </div>
                    </Box>

                    <div className="p-4 bg-white">
                        <button
                            onClick={handleSubmit}
                            className="w-full h-[52px] bg-primary-dark text-white font-semibold rounded-xl hover:opacity-90 transition duration-200"
                        >
                            Share Feedback
                        </button>
                    </div>

                </Box>
            </Fade>
        </Modal>
    );
};

export default FeedbackModal;
