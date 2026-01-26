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
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    p: "24px",
    width: "90%",
    maxWidth: 520,
    outline: "none",
};

const PremiumModal = ({ open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative font-inter">

                {/* Close button */}
                <IconButton
                    onClick={onClose}
                    className="!absolute !top-4 !right-4"
                    size="small"
                >
                    <img src={Close} alt="Close" className="w-5 h-5" />
                </IconButton>

                {/* Header */}
                <div className="mt-2 space-y-1">
                    <h2 className="text-xl font-bold text-primary-dark">
                        Premium
                    </h2>
                </div>

                {/* Body */}
                <div className="mt-4 text-base leading-relaxed text-primary-dark space-y-3">
                    <p>
                        Our groomers use a variety of premium, high-quality shampoos—handpicked based on their professional experience and your pet's unique needs. While many of them choose trusted brands like Pura Vida, the exact product may vary to ensure the best results for each dog. This scented shampoo leaves your pet clean, refreshed, and smelling great after every groom.
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="w-full h-[50px] rounded-[10px] bg-primary-dark text-white font-bold text-base transition hover:opacity-90"
                    >
                        Okay
                    </button>
                </div>

            </Box>
        </Modal>
    );
};

export default PremiumModal;
