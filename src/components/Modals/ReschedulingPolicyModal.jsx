import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "../../assets/icon/close.svg";

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
    maxWidth: 420,
    outline: "none",
};

const ReschedulingPolicyModal = ({
    open,
    onClose,
    onConfirm,
    icon,
    title = "Rescheduling Policy",
    description,
}) => {
    return (
        <>
            {/* Custom CSS for timeline (in same file) */}
            <style>
                {`
          .timeline {
            position: relative;
            list-style: none;
            padding-left: 20px;
          }
          .timeline::before {
            content: "";
            position: absolute;
            left: 9px;
            width: 1px;
            height: 91%;
            background: #BEC3C5;
          }
          .timeline-item {
            position: relative;
            padding: 0px 20px 10px 10px;
            margin-bottom: 5px;
            line-height: 16px;
          }
          .timeline-item.active {
            color: #2E2E2E;
          }
          .timeline-item::before {
            content: "";
            position: absolute;
            left: -18px;
            top: 0px;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: #fff;
            border: 1px solid #BEC3C5;
          }
          .timeline-item.active::before {
            border: 2px solid #FF314A;
          }
        `}
            </style>

            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle} className="relative text-center font-inter">
                    {/* Close Button */}
                    <IconButton
                        onClick={onClose}
                        className="!absolute !top-4 !right-4"
                        size="small"
                        aria-label="Close"
                    >
                        <img src={CloseIcon} alt="Close" className="w-5 h-5" />
                    </IconButton>

                    {/* Icon (optional) */}
                    {icon && (
                        <div className="flex justify-center mt-2 mb-4">
                            <img
                                src={icon}
                                alt="Modal Icon"
                                className="w-12 h-12 sm:w-14 sm:h-14"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h2
                        className={`border-b font-bold leading-6 mb-3 pb-3 text-center text-primary-dark text-xl ${icon ? "" : "mt-4"
                            }`}
                    >
                        {title}
                    </h2>

                    {/* Timeline Section */}
                    <ul className="timeline mt-5 text-left">
                        <li className="active font-bold font-inter text-sm timeline-item">
                            Groomer not confirmed
                            <div className="font-normal text-primary-light text-sm">
                                No Charge
                            </div>
                        </li>
                        <li className="font-bold font-inter text-sm timeline-item">
                            24+ hrs before service time
                            <div className="font-normal text-primary-light text-sm">No Charge</div>
                        </li>
                        <li className="font-bold font-inter text-sm timeline-item">
                            Within 24 hrs of service time
                            <div className="font-normal text-primary-light text-sm">Fee $15</div>
                        </li>
                        <li className="font-bold font-inter text-sm timeline-item">
                            Once the groomer is on the way
                            <div className="font-normal text-primary-light text-sm">Fee $30</div>
                        </li>
                        <li className="font-bold font-inter text-sm timeline-item">
                            Once the groomer has arrived
                            <div className="font-normal text-primary-light text-sm">Fee $50</div>
                        </li>
                    </ul>

                    {/* Description */}
                    <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.01em] text-left mb-6">
                        <span className="font-bold">Important:</span> {description}
                    </p>

                    {/* Button */}
                    <Box className="w-full">
                        <button
                            onClick={onConfirm}
                            className="font-inter font-semibold h-[46px] px-5 rounded-md text-base text-white bg-primary-dark hover:bg-primary transition-all duration-200 w-full"
                        >
                            Confirm Reschedule
                        </button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ReschedulingPolicyModal;
