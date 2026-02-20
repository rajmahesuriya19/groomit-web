import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CommonActionButton from "@/common/ActionButton/CommonActionButton";
import Saving from "../../../../assets/dashboard/saving.png";
import FeedbackModal from "../FeedbackModal";
import PlansModal from "../PlansModal";

const StartSavingCard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(false);

    const handleBook = () => {
        setFeedbackModal(true);
        // navigate("/book/service-address");
    };

    return (
        <>
            <div className="w-full">
                {/* Left Content */}
                <div className="flex flex-col gap-4 max-w-[50%] md:max-w-[60%]">
                    <h3 className="text-[#0A7170] text-xl font-bold leading-snug">
                        Save More with a Recurring Grooming
                    </h3>

                    <p className="text-primary-dark text-sm">
                        Auto-scheduled visits, locked-in pricing, and flexible changes.
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-full"
                    >
                        <CommonActionButton
                            borderColor="border-[#0A7170]"
                            textColor="text-[#0A7170]"
                            // onClick={handleBook}
                            onClick={() => setIsModalOpen(true)}
                            className="w-full"
                        >
                            Start Saving
                        </CommonActionButton>
                    </motion.div>
                </div>

                {/* Right Image */}
                <div className="absolute bottom-0 right-3">
                    <img
                        src={Saving}
                        alt="Saving"
                        className="h-[135px] md:h-[150px] w-auto object-contain"
                    />
                </div>
            </div>

            {/* Animated Modal Mount/Unmount */}
            <AnimatePresence>
                {/* {feedbackModal && (
                    <FeedbackModal
                        open={feedbackModal}
                        onClose={() => setFeedbackModal(false)}
                    />
                )} */}

                {/* Modal */}
                {isModalOpen && <PlansModal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />}
            </AnimatePresence>
        </>
    );
};

export default StartSavingCard;
