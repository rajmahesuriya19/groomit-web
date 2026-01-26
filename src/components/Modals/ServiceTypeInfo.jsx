import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import Close from "../../assets/icon/close.svg";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: 24,
    p: 4,
    width: "90%",
    maxWidth: 500,
    outline: "none",
};

const InfoSection = ({ title, items }) => (
    <div className="border-b border-[#E4E4E4] pb-4 last:border-b-0 mt-4">
        <h2 className="text-primary-dark text-xl font-bold mb-2 text-left">
            {title}
        </h2>

        <ul className="list-disc pl-7 space-y-1 text-sm text-primary-dark">
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    </div>
);

const ServiceTypeInfo = ({ open, onClose }) => {
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

                {/* Content */}
                <div className="mt-2">
                    <InfoSection
                        title="Mobile Van Grooming"
                        items={[
                            "Our grooming van arrives at your selected location.",
                            "Hand off your pet to the groomer at the van.",
                            "We’ll notify you when it’s time to pick up your pet.",
                        ]}
                    />

                    <InfoSection
                        title="In-Home Grooming"
                        items={[
                            "Our groomer arrives at your home at the scheduled time.",
                            "Grooming is done in your preferred spot at home.",
                            "The groomer will clean up and confirm completion.",
                        ]}
                    />
                </div>

                <Box className="flex gap-2 w-full mt-2">
                    <button
                        onClick={onClose}
                        className="bg-primary-dark text-white text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full"
                    >
                        Okay
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ServiceTypeInfo;
