import React from "react";
import { Modal, Box, IconButton, Fade, Backdrop } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Close from "../../../assets/icon/close.svg";

import Gold from "../../../assets/package/Gold-package-booking.svg";
import Eco from "../../../assets/package/eco-package-booking.svg";
import Silver from "../../../assets/package/silver-package-booking.svg";
import Pearl from "../../../assets/package/pearl-package-booking.svg";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#ffffff",
    borderRadius: "24px",
    boxShadow: "0 30px 80px rgba(0,0,0,0.12)",
    width: "92%",
    maxWidth: 520,
    maxHeight: "85vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    outline: "none",
};

const scrollStyle = {
    overflowY: "auto",
    padding: "24px",
};

const PACKAGE_META = {
    GOLD: { label: "Premium | Gold", icon: Gold },
    SILVER: { label: "Premium | Silver - No Haircut", icon: Silver },
    ECO: { label: "Standard | Eco", icon: Eco },
    PEARL: { label: "Essential | Pearl - No Haircut", icon: Pearl },
};

const PackagesModal = ({ open, onClose, packages = {}, petType }) => {
    const navigate = useNavigate();
    const orderedKeys = Object.keys(PACKAGE_META);

    const allPackages = orderedKeys
        .map((key) =>
            Object.values(packages || {}).find(
                (pkg) => pkg?.prod_name?.toUpperCase() === key
            )
        )
        .filter(Boolean);

    const handleClose = () => {
        onClose?.();
    };

    const handleBook = () => {
        handleClose();
        navigate("/book/service-address");
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: { timeout: 300 },
            }}
        >
            <Fade in={open}>
                <Box sx={modalStyle} className="font-inter relative">

                    {/* Close Button */}
                    <IconButton
                        onClick={handleClose}
                        className="!absolute !top-4 !right-4 z-10"
                        size="small"
                    >
                        <img src={Close} alt="Close" className="w-5 h-5" />
                    </IconButton>

                    {/* Scrollable Content */}
                    <Box sx={scrollStyle}>
                        <div className="text-xl font-bold text-primary-dark mt-4 mb-4">
                            Grooming Packages for {petType === "cat" ? "Cats" : "Dogs"}
                        </div>

                        <div className="flex flex-col gap-5">
                            {allPackages.map((pkg) => {
                                const meta =
                                    PACKAGE_META[pkg?.prod_name?.toUpperCase()] || {};
                                const Icon = meta.icon;

                                return (
                                    <div
                                        key={pkg?.prod_id}
                                        className="w-full last:border-0 border-b border-borderLight pb-4"
                                    >
                                        {/* Top Row */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-2">
                                                {Icon && (
                                                    <img
                                                        src={Icon}
                                                        alt={pkg.title}
                                                        className="w-10 h-10"
                                                    />
                                                )}

                                                <div>
                                                    <div className="text-sm font-semibold text-primary-dark">
                                                        {meta.label}
                                                    </div>
                                                    <div className="text-xs text-primary-dark capitalize mt-1">
                                                        {pkg.subtitle}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-xs text-primary-dark">
                                                    Starting at
                                                </div>
                                                <div className="text-lg font-bold text-primary-dark">
                                                    ${pkg?.price}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Services */}
                                        {pkg?.includes?.services?.length > 0 && (
                                            <ul className="mt-4 ml-4 grid grid-cols-2 gap-y-1 text-xs">
                                                {pkg.includes.services.map((service, i) => {
                                                    const isExcluded =
                                                        pkg?.includes?.excludes?.includes(service);

                                                    return (
                                                        <li
                                                            key={i}
                                                            className={`list-disc ml-4 ${isExcluded
                                                                ? "line-through text-gray-400"
                                                                : "text-primary-dark"
                                                                }`}
                                                        >
                                                            {service}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Box>

                    {/* Sticky Footer */}
                    <div className="p-4 bg-white">
                        <button
                            onClick={handleBook}
                            className="w-full h-[52px] bg-brand text-white font-semibold rounded-xl hover:opacity-90 transition duration-200"
                        >
                            Book Now
                        </button>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
};

export default PackagesModal;
