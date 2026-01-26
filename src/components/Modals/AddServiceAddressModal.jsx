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
    p: 3,
    width: "90%",
    maxWidth: 420,
    outline: "none",
};

const AddServiceAddressModal = ({ open, onClose, title, children }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative font-inter">
                {/* Close */}
                <IconButton
                    onClick={onClose}
                    className="!absolute !top-3 !right-3"
                    size="small"
                >
                    <img src={Close} alt="Close" className="w-5 h-5" />
                </IconButton>

                {/* Title */}
                <h2 className="text-primary-dark text-xl font-bold text-center mb-4">
                    {title}
                </h2>

                {/* CONTENT FROM PARENT */}
                {children}
            </Box>
        </Modal>
    );
};

export default AddServiceAddressModal;
