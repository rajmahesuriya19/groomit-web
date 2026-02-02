import React, { useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import Close from "../../assets/icon/close.svg";

// you can replace these with real icons later
import DogIcon from "../../assets/icon/icon-dog.svg";
import CatIcon from "../../assets/icon/icon-cat.svg";
import { ChevronRight } from "lucide-react";
import EnterPetModal from "./EnterPetModal";
import { useSelector } from "react-redux";

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
    outline: "none",
};

const AddPetModal = ({ open, onClose, description }) => {
    const [enterPetModal, setEnterPetModal] = useState(false);
    const [petType, setPetType] = useState(null);

    const { getPetServiceTypeApi } = useSelector((state) => state.bookingFlow || {});

    const PET_TYPES = [
        { key: "dog", label: "Dog", icon: DogIcon },
        { key: "cat", label: "Cat", icon: CatIcon },
    ];

    return (
        <>
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
                    <div className="pb-3 mb-3 text-center">
                        <h2 className="text-primary-dark text-xl font-bold">
                            Add Pet
                        </h2>
                    </div>

                    {/* Pet Type Selection */}
                    <div className="flex flex-col gap-3">
                        {PET_TYPES.map((pet, idx) => {
                            const isDisabled =
                                (pet.key === "dog" && !getPetServiceTypeApi?.canAddDog) ||
                                (pet.key === "cat" && !getPetServiceTypeApi?.canAddCat);

                            return (
                                <div
                                    className={`flex items-center justify-between pl-[10px] py-[10px] rounded-[10px] border transition
                ${isDisabled
                                            ? "border-gray-200 bg-gray-100 cursor-not-allowed"
                                            : "border-primary-line cursor-pointer hover:bg-gray-50"
                                        }
            `}
                                    key={idx}
                                    onClick={() => {
                                        if (isDisabled) return;

                                        onClose();
                                        setEnterPetModal(true);
                                        setPetType(pet.label);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={pet.icon}
                                            alt={pet.label}
                                            className="w-6 h-6"
                                        />
                                        <span className="text-sm font-bold text-primary-dark">
                                            {pet.label}
                                        </span>
                                    </div>

                                    <ChevronRight
                                        size={30}
                                        className={isDisabled ? "text-gray-300" : "text-primary-light"}
                                    />
                                </div>
                            );
                        })}

                        {description && <div className="text-[10px] text-primary-light">{description}</div>}
                    </div>
                </Box>
            </Modal>

            <EnterPetModal
                open={enterPetModal}
                onClose={() => setEnterPetModal(false)}
                petType={petType}
            />
        </>
    );
};

export default AddPetModal;
