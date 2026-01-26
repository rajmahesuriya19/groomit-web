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

const InfoSection = ({ title, dec }) => (
    <div className="border-b border-[#E4E4E4] pb-4 last:border-b-0 mt-4">
        <h2 className={`text-primary-dark font-bold mb-2 text-left ${title == "Hard to Handle" ? 'text-xl' : 'text-base'}`}>
            {title}
        </h2>

        <p className="text-sm font-normal text-primary-dark">{dec}</p>
    </div>
);

const HardToHandleModal = ({ open, onClose, onSubmit }) => {
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
                        title="Hard to Handle"
                        dec="Some pets may become too anxious or aggressive during grooming. If extra care is needed, a handling fee may apply. If a pet shows signs of aggression, it may fall under our Non-Groomable Policy (see cancellation policy)."

                    />

                    <InfoSection
                        title="Senior Pets"
                        dec="Older pets often need more time and gentle handling. A handling fee may be added to ensure their comfort and safety during the service."
                    />
                </div>

                <Box className="flex gap-2 w-full mt-2">
                    <button
                        onClick={onSubmit}
                        className="bg-primary-dark text-white text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full"
                    >
                        Okay
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default HardToHandleModal;
