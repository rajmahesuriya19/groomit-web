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
    maxWidth: 400,
    outline: "none",
};

const RescheduleAppointemntModal = ({ open, onClose, onConfirm, icon, title, description }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative text-center font-inter">
                {/* Close Button */}
                <IconButton
                    onClick={onClose}
                    className="!absolute !top-4 !right-4"
                    size="small"
                >
                    <img src={Close} alt="Close" className="w-6 h-6" />
                </IconButton>

                {/* Icon */}
                {icon && <div className="flex justify-center mt-2 mb-4">
                    <img src={icon} alt="Modal Icon" className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>}

                {/* Title */}
                <h2 className={`text-primary-dark text-xl font-bold leading-[26px] text-center mb-2 ${icon ? '' : 'mt-4'} `}>
                    {title}
                </h2>

                {/* Description */}
                <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.02em] text-center mb-6">
                    {description}
                </p>

                {/* Buttons */}
                <Box className="flex flex-col sm:flex-row justify-between gap-2">
                    <button
                        onClick={onClose}
                        className="border border-primary-dark font-inter font-semibold h-[48px] leading-[18px] rounded-md text-base text-primary-dark w-full"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="font-inter font-semibold h-[48px] leading-[18px] rounded-md text-base text-white w-full bg-primary-dark"
                    >
                        Yes, Continue
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RescheduleAppointemntModal;
