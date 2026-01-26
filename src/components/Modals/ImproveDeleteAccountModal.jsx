import React from "react";
import { Modal, Box, IconButton, Radio } from "@mui/material";
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
    maxWidth: 400,
    outline: "none",
};

const reasons = [
    "I no longer use Groomit",
    "I found another service I prefer",
    "The app is difficult to use",
    "I had issues with pricing or plans",
    "I had concerns about safety or trust",
    "I don’t want to share my personal data",
    "I had technical issues with the app",
    "I didn’t get the value I expected",
    "I’m taking a break from pet services",
    "Other",
];

const ImproveDeleteAccountModal = ({ open, onClose, onConfirm, title }) => {
    const [selectedValue, setSelectedValue] = React.useState("");
    const [reasonText, setReasonText] = React.useState("");

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle} className="relative text-center font-inter">
                    {/* Close Button */}
                    <IconButton
                        onClick={onClose}
                        className="!absolute !top-4 !right-4"
                        size="small"
                    >
                        <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                    </IconButton>

                    {/* Title */}
                    <h2 className="text-primary-dark text-xl font-bold leading-[26px] py-4 border-b">
                        {title}
                    </h2>

                    {/* Reason List */}
                    <div className="flex flex-col items-start w-full max-h-[300px] overflow-y-auto">
                        {reasons.map((label, index) => (
                            <div
                                key={index}
                                className={`flex gap-2 items-center py-3 w-full ${index !== reasons.length - 1 ? "border-b" : ""
                                    }`}
                            >
                                <Radio
                                    checked={selectedValue === label}
                                    onChange={() => setSelectedValue(label)}
                                    value={label}
                                    sx={{
                                        padding: 0,
                                        color: "#7C868A",
                                        "&.Mui-checked": {
                                            color: "#FF314A",
                                        },
                                    }}
                                />
                                <span className="font-inter text-sm font-bold">
                                    {label}
                                </span>
                            </div>
                        ))}

                        {/* Textarea */}
                        <textarea
                            placeholder="Write your reason here"
                            value={reasonText}
                            onChange={(e) => setReasonText(e.target.value)}
                            className="flex justify-between items-center
                            w-full rounded-[10px] border border-primary-line
                            bg-[#FBFBFB] text-primary-light text-sm font-inter
                            outline-none resize-none mb-3
                        "
                            style={{
                                padding: "10px 11px 10px 15px",
                                minHeight: "90px",
                                lineHeight: "20px",
                            }}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <Box className="flex gap-2 w-full mt-6">
                        <button
                            onClick={onClose}
                            className="bg-white border border-primary-dark text-primary-dark text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => onConfirm(selectedValue, reasonText)}
                            className="bg-primary-dark text-white text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full"
                        >
                            Continue
                        </button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ImproveDeleteAccountModal;
