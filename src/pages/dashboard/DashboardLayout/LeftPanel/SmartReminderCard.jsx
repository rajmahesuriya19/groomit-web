import React, { useState } from "react";
import { motion } from "framer-motion";
import Notification from "../../../../assets/icon/notification-bing.svg";
import PlansModal from "../PlansModal";
import { useDispatch, useSelector } from "react-redux";
import { closeReminderModal, getDashboardData, SaveReminder } from "@/utils/store/slices/dashboard/dashboardSlice";
import { capitalize } from "@/common/helpers";

let options = [
    { id: 1, label: "Every 4 weeks", value: 4 },
    { id: 2, label: "Every 6 weeks", value: 6 },
    { id: 3, label: "Every 8 weeks", value: 8 },
];

export const SmartReminderCard = ({ selectedPet }) => {
    const dispatch = useDispatch();

    const dashboardState = useSelector((state) => state.dashboard);
    const { isEnabled, isModalOpen } = dashboardState;

    const reminderOptions =
        dashboardState?.reminderOptions?.length
            ? dashboardState.reminderOptions
            : options;

    const selectedFrequency = dashboardState?.selectedFrequency ? dashboardState?.selectedFrequency : '6';

    /* ========================
       Toggle Handler
    ======================== */
    const handleToggle = async () => {
        if ((selectedPet?.id || selectedPet?.pet_id) && selectedFrequency) {
            try {
                await dispatch(
                    SaveReminder({
                        user_pet_id: selectedPet?.id || selectedPet?.pet_id,
                        frequency_weeks: selectedFrequency,
                        is_enabled: !isEnabled,
                    })
                ).unwrap();

                // ✅ Only runs if SaveReminder succeeded
                dispatch(getDashboardData());

            } catch (error) {
                console.log("Save failed, dashboard not refreshed");
            }
        }
    };

    /* ========================
       Select Frequency
    ======================== */
    const handleSelect = async (option) => {
        if (!isEnabled) return;

        if (option.value === selectedFrequency) return;

        if (selectedPet?.id || selectedPet?.pet_id) {
            try {
                await dispatch(
                    SaveReminder({
                        user_pet_id: selectedPet?.id || selectedPet?.pet_id,
                        frequency_weeks: option.value,
                        is_enabled: true,
                    })
                ).unwrap(); // 👈 wait for success

                // ✅ Only after success
                dispatch(getDashboardData());

            } catch (error) {
                console.log("Save reminder failed");
            }
        }
    };

    return (
        <div className="flex flex-col gap-3 items-start w-full">

            {/* Header */}
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center">
                    <div className="flex justify-center items-center bg-white rounded-[10px] me-3 w-[40px] h-[40px] border border-primary-line">
                        <img
                            src={Notification}
                            alt="Notification"
                            className="w-[22px] h-[22px]"
                        />
                    </div>
                    <div>
                        <h4 className="font-inter font-bold text-base text-primary-dark">
                            Smart Reminder
                        </h4>
                        <div className="font-inter font-normal text-sm text-primary-dark">
                            {`Set a grooming schedule that fits ${capitalize(selectedPet?.name)}.`}
                        </div>
                    </div>
                </div>
            </div>

            {/* Switch */}
            <div className="flex justify-between items-center w-full">
                <h4 className="font-inter font-bold text-base text-primary-dark">
                    Keep Me on Track
                </h4>

                <button
                    type="button"
                    onClick={handleToggle}
                    className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors ${isEnabled ? "bg-brand" : "bg-gray-300"
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEnabled ? "translate-x-5" : "translate-x-1"
                            }`}
                    />
                </button>
            </div>

            {/* Options */}
            <div className={`flex w-full gap-2`}>
                {reminderOptions?.map((option, idx) => (
                    <motion.button
                        key={idx}
                        type="button"
                        whileHover={isEnabled ? { y: -2 } : {}}
                        whileTap={isEnabled ? { scale: 0.98 } : {}}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleSelect(option)}
                        className={`w-full flex items-center justify-center md:px-4 px-1 py-3 rounded-[10px] transition-all
    ${!isEnabled
                                ? "border border-primary-light opacity-50 cursor-not-allowed"
                                : selectedFrequency == option.value
                                    ? "border-2 border-brand text-primary-dark shadow-md"
                                    : "border border-primary-light"
                            }`}
                    >
                        <div className={`text-sm ${(selectedFrequency == option.value && isEnabled) ? "font-bold" : ""}`}>
                            {option.label}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Modal */}
            <PlansModal
                open={isModalOpen}
                onClose={() => dispatch(closeReminderModal())}
            />
        </div>
    );
};
