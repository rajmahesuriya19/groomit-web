import React, { useMemo } from "react";
import { Modal, Box, IconButton, Divider } from "@mui/material";
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
    maxWidth: 480,
    outline: "none",
};

const parsePrice = (value) =>
    Number(value?.replace(/[^0-9.]/g, "")) || 0;

const TaxInsuranceModal = ({
    open,
    onClose,
    Insurance = "$0",
    Tax = "$0",
}) => {
    const insurancePrice = parsePrice(Insurance);
    const taxPrice = parsePrice(Tax);

    const subtotal = useMemo(
        () => insurancePrice + taxPrice,
        [insurancePrice, taxPrice]
    );

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

                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-xl font-bold text-primary-dark">
                        Taxes & Safety Insurance
                    </h2>
                </div>

                <Divider />

                {/* Safety Insurance */}
                <div className="mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-primary-dark">
                            Safety Insurance
                        </span>
                        <span className="text-base font-semibold text-primary-dark">
                            {Insurance}
                        </span>
                    </div>

                    <p className="text-xs mt-2 leading-relaxed">
                        Ensure peace of mind with Groomit's Safety Insurance. This small, additional fee guarantees coverage for any issues that may arise during grooming, providing you with the ultimate safety and protection. Your pet's well-being is our top priority.
                    </p>
                </div>

                {/* Tax */}
                <div className="mt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-primary-dark">
                            Taxes
                        </span>
                        <span className="text-base font-semibold text-primary-dark">
                            {Tax}
                        </span>
                    </div>
                </div>

                <Divider className="!my-4" />

                {/* Subtotal */}
                <div className="flex justify-between items-center">
                    <span className="text-base text-primary-dark">
                        Subtotal
                    </span>
                    <span className="text-xl font-bold text-primary-dark">
                        ${subtotal.toFixed(2)}
                    </span>
                </div>

                {/* CTA */}
                <Box className="mt-5">
                    <button
                        onClick={onClose}
                        className="w-full h-[52px] rounded-[12px] bg-primary-dark text-white font-bold"
                    >
                        Okay
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default TaxInsuranceModal;
