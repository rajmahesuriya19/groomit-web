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
    maxWidth: 450,
    outline: "none"
};

const DetailRow = ({ label, value, isLast }) => {
    if (!value) return null;

    return (
        <div
            className={`flex flex-col gap-1 pb-3 ${!isLast ? "border-b border-primary-line" : ""
                }`}
        >
            <span className="text-sm font-bold text-primary-dark leading-tight">
                {value}
            </span>
            <span className="text-sm tracking-wide">
                {label}
            </span>
        </div>
    );
};

const PetInfo = ({ open, onClose, selectedPet }) => {
    if (!selectedPet) return null;

    const {
        name,
        breed_name,
        size_name,
        gender_show,
        ageFull,
    } = selectedPet;

    const details = [
        { label: "Breed", value: breed_name },
        { label: "Size", value: size_name },
        { label: "Gender", value: gender_show },
        { label: "Age", value: ageFull },
    ].filter(item => item.value);

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

                {/* Header */}
                <div className="pb-3 mb-4 border-b border-primary-line text-center">
                    <h2 className="text-primary-dark text-xl font-bold">
                        {name}’s Details
                    </h2>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-4">
                    {details.map((item, index) => (
                        <DetailRow
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            isLast={index === details.length - 1}
                        />
                    ))}
                </div>
            </Box>
        </Modal>
    );
};

export default PetInfo;
