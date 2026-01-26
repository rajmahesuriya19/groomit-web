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

                {/* Title */}
                <h2 className="text-primary-dark text-xl font-bold leading-[26px] text-center mt-4 mb-2">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.02em] text-center mb-6">
                    {description}
                </p>

                {/* Buttons */}
                <Box className="flex flex-col justify-between gap-2 w-full">
                    <button
                        onClick={() => {
                            if (onReset) onReset();
                            onClose();
                        }}
                        className={`h-[50px] w-full rounded-[10px] text-primary-dark text-base font-bold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95 bg-white cursor-pointer border border-primary-dark`}
                    >
                        Change Zip Code
                    </button>
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                        }}
                        className={`h-[50px] w-full rounded-[10px] text-white text-base font-bold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95 bg-primary-dark cursor-pointer`}
                    >
                        Notify Me - When Available
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default VerifyServiceArea;
