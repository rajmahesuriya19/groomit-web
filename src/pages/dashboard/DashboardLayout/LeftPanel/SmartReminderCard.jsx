import React, { useState } from "react";
import { motion } from "framer-motion";
import Notification from "../../../../assets/icon/notification-bing.svg";
import PlansModal from "../PlansModal";

const data = [
    { id: 1, label: "Every 4 weeks", value: 4 },
    { id: 2, label: "Every 6 weeks", value: 6 },
    { id: 3, label: "Every 8 weeks", value: 8 },
];

export const SmartReminderCard = ({ onChange }) => {
    const [options] = useState(data);
    const [selected, setSelected] = useState(2);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleToggle = () => {
        const newValue = !isEnabled;
        setIsEnabled(newValue);

        if (newValue) {
            setIsModalOpen(true);
        }

        if (onChange) {
            onChange({
                enabled: newValue,
                frequency: selected,
            });
        }
    };

    const handleSelect = (option) => {
        setSelected(option.id);

        if (onChange) {
            onChange({
                enabled: isEnabled,
                frequency: option.value,
            });
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
                            Set a grooming schedule that fits your pet.
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
                {options.map((option) => (
                    <motion.button
                        key={option.id}
                        type="button"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleSelect(option)}
                        className={`w-full flex items-center justify-center md:px-4 px-1 py-3 rounded-[10px] transition-all ${selected === option.id
                            ? "border-2 border-brand text-primary-dark shadow-md"
                            : "border border-primary-light"
                            }`}
                    >
                        <div className={`text-sm ${selected === option.id ? "font-bold" : ""}`}>
                            {option.label}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Modal */}
            <PlansModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};
