import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";

import Banner from "../../../../assets/dashboard/lapsed-user-banner.png";
import CommonActionButton from "@/common/ActionButton/CommonActionButton";
import AddPetsModal from "@/components/Modals/AddPetsModal";

const PetDueCard = () => {
    const navigate = useNavigate();
    const [petsModal, setPetsModal] = useState(false);

    return (
        <>
            {/* Main Animated Wrapper */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full flex flex-col gap-4"
            >
                {/* Floating Van Section */}
                <div className="flex items-center justify-center w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, -4, 0]
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut"
                        }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <img
                            src={Banner}
                            alt="Banner"
                            className="w-full max-h-[160px] object-contain hidden sm:block"
                        />
                        <img
                            src={Banner}
                            alt="Banner"
                            className="w-full max-h-[185px] object-contain sm:hidden"
                        />
                    </motion.div>
                </div>

                {/* Staggered Text Animation */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                    className="text-center"
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="font-semibold text-base text-primary-dark font-inter"
                    >
                        Bruno is due for a refresh
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        className="font-normal text-sm text-primary-dark font-inter"
                    >
                        It’s been 42 days since the last groom.
                    </motion.div>
                </motion.div>

                {/* Buttons with Micro-interactions */}
                <div className="flex justify-between gap-2 items-center w-full">
                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-full"
                    >
                        <CommonActionButton
                            borderColor="border-brand"
                            textColor="text-brand"
                            onClick={() => navigate("/book/service-address")}
                        >
                            Quick Booking
                        </CommonActionButton>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-full"
                    >
                        <CommonActionButton
                            borderColor="border-primary-dark"
                            textColor="text-primary-dark"
                            onClick={() => setPetsModal(true)}
                        >
                            Add Pets
                        </CommonActionButton>
                    </motion.div>
                </div>
            </motion.div>

            {/* Animated Modal Mount/Unmount */}
            <AnimatePresence>
                {petsModal && (
                    <AddPetsModal
                        open={petsModal}
                        type="dashboard"
                        onClose={() => setPetsModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default PetDueCard;
