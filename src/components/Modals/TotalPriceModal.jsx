import React, { useMemo } from "react";
import { Modal, Box, IconButton, Divider } from "@mui/material";
import Close from "../../assets/icon/close.svg";
import infoGrey from "../../assets/icon/info-circle-grey.svg";

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

const parsePrice = (value) => {
    if (!value) return 0;
    if (typeof value === "number") return value;
    if (value === "Free") return 0;
    return Number(value.replace(/[^0-9.]/g, ""));
};

const TotalPriceModal = ({
    open,
    onClose,
    onModal,
    packageName = "Gold",
    packagePrice = 105,
    add_ons = [],
    Insurance = "$0",
}) => {
    const insurancePrice = parsePrice(Insurance);

    const addonsTotal = useMemo(
        () => add_ons.reduce((sum, item) => sum + parsePrice(item.price), 0),
        [add_ons]
    );

    const totalPrice = packagePrice + addonsTotal + insurancePrice;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative font-inter">
                {/* Close */}
                <IconButton
                    onClick={onClose}
                    className="!absolute !top-4 !right-4"
                    size="small"
                >
                    <img src={Close} alt="Close" className="w-5 h-5" />
                </IconButton>

                {/* Package */}
                <div className="flex justify-between items-center mt-8 mb-3">
                    <div>
                        <p className="text-base">{packageName} Package</p>
                    </div>
                    <p>${packagePrice}</p>
                </div>

                {/* Add-ons */}
                {add_ons.length > 0 && (
                    <div className="mt-3 space-y-1">
                        <p className="text-base font-bold">Add-ons</p>

                        {add_ons.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between text-sm"
                            >
                                <span className="text-base text-primary-dark">
                                    {item.title}
                                </span>
                                <span className="text-base text-primary-dark">
                                    {item.price}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Insurance */}
                <div className="flex justify-between items-center mt-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-base text-primary-dark">Tax & Safety Insurance</span>
                        <img src={infoGrey} alt="Info" className="w-5 h-5 cursor-pointer" onClick={onModal} />
                    </div>
                    <span className="text-base text-primary-dark">{Insurance}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mt-4 bg-[#f2f2f2] p-3 rounded-[10px]">
                    <span className="text-base font-bold">Total</span>
                    <span className="text-base font-bold text-primary-dark">
                        ${totalPrice.toFixed(2)}
                    </span>
                </div>
            </Box>
        </Modal>
    );
};

export default TotalPriceModal;
