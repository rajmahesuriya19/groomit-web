import React, { useEffect, useState } from "react";
import { Modal, Box, IconButton, styled, TextField } from "@mui/material";
import Close from "../../assets/icon/close.svg";
import { addPetDraft, addUpdatePet, getPetList, savePetBooking } from "@/utils/store/slices/petList/petListSlice";
import { useDispatch } from "react-redux";
import { useLoader } from "@/contexts/loaderContext/LoaderContext";
import { CustomInput } from "../CustomInput";

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

const EnterPetModal = ({ open, onClose, petType = "Pet" }) => {
    const dispatch = useDispatch();
    const { showLoader, hideLoader } = useLoader();

    const [name, setName] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            setName("");
            setError("");
        }
    }, [open]);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Please enter a name");
            return;
        }

        showLoader();

        try {
            await dispatch(
                savePetBooking({
                    type: petType.toLowerCase(),
                    name: name.trim(),
                })
            ).unwrap();

            dispatch(getPetList());

            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            hideLoader();
        }
    };

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
                <div className="pb-3 mb-4 text-center">
                    <h2 className="text-primary-dark text-xl font-bold">
                        Enter Pet Name
                    </h2>
                </div>

                {/* Input */}
                <div className="w-full flex flex-col gap-2">
                    <CustomInput
                        autoFocus
                        label={`${petType} Name`}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError("");
                        }}
                        error={!!error}
                        helperText={error || " "}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                    />
                </div>

                {/* Action */}
                <button
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    className={`w-full h-[50px] rounded-[10px] text-base font-bold transition
                        ${name.trim()
                            ? "bg-primary-dark text-white"
                            : "bg-gray-300 text-white cursor-not-allowed"
                        }
                    `}
                >
                    Add
                </button>
            </Box>
        </Modal>
    );
};

export default EnterPetModal;
