import React from "react";
import { Modal, Box, IconButton, Fade, Backdrop } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Close from "../../../assets/icon/close.svg";

import Recurring from "../../../assets/icon/recurring-big.svg";
import Calender from "../../../assets/icon/calendar-blank.svg";
import Card from "../../../assets/icon/card.svg";
import Refresh from "../../../assets/icon/refresh-square.svg";
import Lock from "../../../assets/icon/lock-black.svg";
import Refund from "../../../assets/icon/refund.svg";

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

const CustomTabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index} aria-labelledby={`custom-tab-${index}`}>
            {value === index && <Box className="pt-2">{children}</Box>}
        </div>
    );
};

const PlansModal = ({ open, onClose }) => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = React.useState(0);

    const tabs = [
        { label: 'Flexible Plan', type: 'upcoming' },
        { label: 'Annual Plan', type: 'history' },
    ];

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
                        <div className="flex items-start gap-4 mt-6 mb-4">
                            <img src={Recurring} alt="Recurring" className="h-full w-[70px]" />
                            <div className="flex flex-col gap-2">
                                <div className="text-[#0A7170] text-xl font-bold self-stretch">Save More with a <br />Recurring Grooming</div>
                                <div className="text-primary-dark text-sm">Book Recurring & Get up to <span className="text-brand font-bold">30% OFF</span></div>
                            </div>
                        </div>

                        {/* Tab Buttons */}
                        <div className="flex w-full">
                            {tabs.map((tab, index) => {
                                const isActive = index === activeTab;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTab(index)}
                                        className={`w-1/2 h-[41px] px-[15px] text-center font-inter text-sm transition-all font-bold duration-200 ${isActive
                                            ? ' text-white bg-primary-dark'
                                            : 'bg-white text-primary-dark border-[1.5px] border-primary-line'
                                            }`}
                                        style={{
                                            borderRadius: index === 0 ? '10px 0 0 10px' : '0 10px 10px 0',
                                        }}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Panels */}
                        <CustomTabPanel value={activeTab} index={0}>
                            <div className="mt-4 flex flex-col p-[15px] items-start gap-5 self-stretch rounded-[20px] border border-primary-line bg-white">
                                <div className="flex flex-col">
                                    <div className="text-xl font-bold text-primary-dark font-filson">Flexible Plan</div>
                                    <div className="text-base text-primary-dark">Pay Per Appointment</div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <img src={Calender} alt="Calender" className="h-6 mt-1 w-6" />
                                    <div className="flex flex-col">
                                        <div className="text-primary-dark text-base font-bold">Auto-scheduled, 1 week in advance</div>
                                        <div className="text-primary-dark text-sm">We create your next appointment automatically</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <img src={Card} alt="Card" className="h-6 mt-1 w-6" />
                                    <div className="flex flex-col">
                                        <div className="text-primary-dark text-base font-bold">Charged only when confirmed</div>
                                        <div className="text-primary-dark text-sm">No upfront payment, Billed Only when next appt is schedule & confirm</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <img src={Refresh} alt="Refresh" className="h-6 mt-1 w-6" />
                                    <div className="flex flex-col">
                                        <div className="text-primary-dark text-base font-bold">Skip or reschedule anytime</div>
                                        <div className="text-primary-dark text-sm">Plans change? You can modify or skip without hassle</div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="text-base font-inter text-primary-dark font-bold">Who Loves Flexible</div>
                                    <ul className="ml-1 flex flex-col gap-y-1 text-sm">
                                        <li className={`list-disc ml-4 text-primary-dark`}>
                                            Who want auto‑scheduling with pay per visit
                                        </li>
                                        <li className={`list-disc ml-4 text-primary-dark`}>
                                            New to Groomit or trying different cadences
                                        </li>
                                        <li className={`list-disc ml-4 text-primary-dark`}>
                                            Varied schedules / travel often
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CustomTabPanel>

                        <CustomTabPanel value={activeTab} index={1}>
                            <div className="mt-4 flex flex-col p-[15px] items-start gap-5 self-stretch rounded-[20px] border border-primary-line bg-white">
                                <div className="flex flex-col">
                                    <div className="text-xl font-bold text-primary-dark font-filson">Annual Plan</div>
                                    <div className="text-base text-primary-dark">Pay In Advance for a Year</div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <img src={Lock} alt="Lock" className="h-6 mt-1 w-6" />
                                    <div className="flex flex-col">
                                        <div className="text-primary-dark text-base font-bold">Price locked for 12 months</div>
                                        <div className="text-primary-dark text-sm">Enjoy the same rates all year, No seasonal or surge increases</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <img src={Refund} alt="Refund" className="h-6 mt-1 w-6" />
                                    <div className="flex flex-col">
                                        <div className="text-primary-dark text-base font-bold">Refundable for unused appointments</div>
                                        <div className="text-primary-dark text-sm">Any remaining appointments are fully refundable</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <img src={Calender} alt="Calender" className="h-6 mt-1 w-6" />
                                    <div className="flex flex-col">
                                        <div className="text-primary-dark text-base font-bold">Auto-scheduled for the whole year</div>
                                        <div className="text-primary-dark text-sm">Set your frequency once and we’ll handle your entire year</div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="text-base font-inter text-primary-dark font-bold">Who Loves Annual</div>
                                    <ul className="ml-1 flex flex-col gap-y-1 text-sm">
                                        <li className={`list-disc ml-4 text-primary-dark`}>
                                            Pet parents who love routine and reliability
                                        </li>
                                        <li className={`list-disc ml-4 text-primary-dark`}>
                                            Want protection from seasonal surges
                                        </li>
                                        <li className={`list-disc ml-4 text-primary-dark`}>
                                            Owners who prefer to “set it and forget it”
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </CustomTabPanel>
                    </Box>

                    {/* Sticky Footer */}
                    <div className="p-4 bg-white">
                        <button
                            onClick={handleBook}
                            className="w-full h-[52px] bg-brand text-white font-semibold rounded-xl hover:opacity-90 transition duration-200"
                        >
                            Book & Start Saving
                        </button>
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
};

export default PlansModal;
