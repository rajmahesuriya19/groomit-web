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
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    p: "24px",
    width: "90%",
    maxWidth: 500,
    outline: "none",
};

const MattingInfoModal = ({ open, onClose, onSubmit, selected }) => {
    const [value, setValue] = React.useState(selected || "");

    React.useEffect(() => {
        setValue(selected || "");
    }, [selected]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative font-inter">

                {/* Close button */}
                <IconButton
                    onClick={onClose}
                    className="!absolute !top-4 !right-4"
                    size="small"
                >
                    <img src={Close} alt="Close" className="w-5 h-5" />
                </IconButton>

                {/* Header */}
                <h2 className="text-xl font-bold text-primary-dark mt-2">
                    Matting Removal Notice
                </h2>

                {/* Body */}
                <div className="mt-3 text-sm text-primary-dark space-y-3">
                    <p>
                        Mat removal is often painful and time-consuming. A shave-down may be the safest option, potentially revealing skin issues like irritations or parasites.
                    </p>
                    <p>
                        If shaving isn't approved, mats may be left if removal causes too much distress, and the full charge will still apply.
                    </p>

                    <div className="pt-2 flex flex-col gap-2">
                        <div className="text-base font-bold">Please select one option:</div>

                        <label className="border border-primary-line rounded-[10px] p-[15px] flex gap-2 items-start cursor-pointer" onClick={() => setValue("approve")}>
                            <Radio
                                checked={value === "approve"}
                                sx={{
                                    p: 0,
                                    color: "#7C868A",
                                    "&.Mui-checked": { color: "#FF314A" },
                                }}
                            />
                            <span className="font-bold">
                                I approve{" "}
                                <span className="font-medium">
                                    the groomer to shave my pet if needed.
                                </span>
                            </span>
                        </label>

                        <label className="border border-primary-line rounded-[10px] p-[15px] flex gap-2 items-start cursor-pointer" onClick={() => setValue("decline")}>
                            <Radio
                                checked={value === "decline"}
                                sx={{
                                    p: 0,
                                    color: "#7C868A",
                                    "&.Mui-checked": { color: "#FF314A" },
                                }}
                            />
                            <span className="font-bold">
                                I do not approve{" "}
                                <span className="font-medium">
                                    a shave-down and understand that the full charge will apply even if mats remain.
                                </span>
                            </span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6">
                    <button
                        disabled={!value}
                        onClick={() => onSubmit(value)}
                        className="w-full h-[50px] rounded-[10px] bg-primary-dark text-white font-bold text-base transition hover:opacity-90"
                    >
                        Submit
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default MattingInfoModal;
