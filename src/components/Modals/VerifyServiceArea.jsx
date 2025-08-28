import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import Close from "../../assets/icon/close.svg";
import Bell from "../../assets/icon/bell-white.png";

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

const VerifyServiceArea = ({ open, onClose, onConfirm, onReset, icon, title, description }) => {
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
                <div className="flex justify-center mt-2 mb-4">
                    <img src={icon} alt="Modal Icon" className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>

                {/* Title */}
                <h2 className="text-primary-dark text-xl font-bold leading-[26px] text-center mb-2">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.02em] text-center mb-6">
                    {description}
                </p>

                {/* Buttons */}
                <div className="flex flex-col gap-3 w-full">
                    {/* Change Service Area → reset + close */}
                    <button
                        onClick={() => {
                            if (onReset) onReset(); // reset all fields in parent
                            onClose(); // close modal
                        }}
                        className="bg-brand hover:bg-brand/90 transition text-white text-base font-semibold rounded-full py-3 w-full"
                    >
                        Change Service Area
                    </button>

                    {/* Notify → just close modal */}
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                        }}
                        className="flex items-center justify-center gap-2 bg-black hover:bg-gray-900 transition text-white text-base font-semibold rounded-full py-3 w-full"
                    >
                        <img src={Bell} alt="Notify" className="w-5 h-5" />
                        Notify Me - When Available
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default VerifyServiceArea;
