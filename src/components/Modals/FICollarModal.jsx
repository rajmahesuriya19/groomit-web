import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import Close from "../../assets/icon/close.svg";
import Gift from "../../assets/icon/gift.svg"
import Monitoring from "../../assets/fi-collar/Monitoring.svg"
import Companion from "../../assets/fi-collar/Companion.svg"
import Tracking from "../../assets/fi-collar/Tracking.svg"
import AppleWatch from "../../assets/fi-collar/Apple-Watch.svg"
import Records from "../../assets/fi-collar/Records.svg"

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: '0 50px 100px 0 rgba(0, 0, 0, 0.10)',
    p: '20px 20px 30px 20px',
    width: "90%",
    maxWidth: 450,
    maxHeight: 600,
    overflowY: 'auto',
    outline: "none",
};

const FICollarModal = ({ open, onClose }) => {
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
                <div className="pt-4 mt-2">
                    <div className='my-4 py-2 px-[10px] rounded-[10px] border border-[#FFBF00] bg-[#FFFEDF] w-fit'>
                        <div className="flex gap-2 items-center w-full">
                            <img
                                src={Gift}
                                alt={`FREE Fi GPS Collar`}
                                className="w-6 h-6"
                            />
                            <div className="text-sm font-bold">$120+ Value Included Free</div>

                        </div>
                    </div>

                    <div className="text-3xl font-bold font-filson pb-2">FREE Fi GPS Collar + <br />
                        6 months of live tracking</div>

                    <div className="text-sm">Both recurring plans includes a complimentary TryFi GPS collar and 6 months of live tracking</div>

                    <div className="flex flex-col items-start gap-4 mt-3">
                        <div className="flex items-center gap-3">
                            <img src={Monitoring} alt="Monitoring" className="w-[100px] h-[74px]" />
                            <div className="flex flex-col gap-1">
                                <div className="text-base font-bold">AI-Powered Behavior Monitoring</div>
                                <div className="text-sm">Track their steps, sleep, barking, eating, drinking, licking, and scratching habits.</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <img src={Companion} alt="Companion" className="w-[100px] h-[74px]" />
                            <div className="flex flex-col gap-1">
                                <div className="text-base font-bold">AI Companion</div>
                                <div className="text-sm">Tailored tips, personalized reminders, meet your go-to dog parenting resource.</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <img src={Tracking} alt="Tracking" className="w-[100px] h-[74px]" />
                            <div className="flex flex-col gap-1">
                                <div className="text-base font-bold">2x Improved GPS Tracking</div>
                                <div className="text-sm">Series 3+ outperforms previous generations to locate dogs faster than ever.</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <img src={AppleWatch} alt="Apple Watch" className="w-[100px] h-[74px]" />
                            <div className="flex flex-col gap-1">
                                <div className="text-base font-bold">Apple Watch Integration</div>
                                <div className="text-sm">No need to take your phone jogging anymore. Just wear your watch.</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <img src={Records} alt="Records" className="w-[100px] h-[74px]" />
                            <div className="flex flex-col gap-1">
                                <div className="text-base font-bold">Smart Vet Records</div>
                                <div className="text-sm">Automatically store, organize, and summarize key files in one place.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default FICollarModal;
