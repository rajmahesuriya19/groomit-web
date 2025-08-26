import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import { useDispatch } from 'react-redux';
import { verifyOtp, sendOtp } from '@/utils/store/slices/userInfo/userInfoSlice'; // 🔹 import sendOtp

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: 4,
    width: '90%',
    maxWidth: 400,
    outline: 'none',
};

const VerifyPhoneModal = ({ open, onClose, onConfirm, icon, title, description, phone }) => {
    const dispatch = useDispatch();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // 🔹 Auto send OTP when modal opens
    useEffect(() => {
        if (open && phone) {
            dispatch(sendOtp({ mobile: phone }));
            setResendTimer(30);
        }
    }, [open, phone, dispatch]);

    // 🔹 Countdown for resend
    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    // 🔹 Reset fields when modal closes
    useEffect(() => {
        if (!open) {
            setOtp(["", "", "", ""]);
            setError("");
            setResendTimer(0);
        }
    }, [open]);

    const handleChange = (value, index) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setError("");

            // Move to next input if not last
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-${index + 1}`).focus();
            }

            // 🔹 If all digits filled -> auto verify
            if (newOtp.every((digit) => digit !== "")) {
                handleVerify(newOtp.join(""));
            }
        }
    };

    const handleVerify = async (inputCode) => {
        const code = inputCode || otp.join("");

        if (code.length < 4) {
            setError("Please enter full code");
            return;
        }

        setLoading(true); // 🔹 show loader
        try {
            const result = await dispatch(verifyOtp({ mobile: phone, otp: code }));

            if (verifyOtp.fulfilled.match(result)) {
                setError("");
                onConfirm(code);
            } else {
                setError("Entered code does not match, please provide a valid code");
            }
        } catch (err) {
            setError("Verification failed, please try again");
        } finally {
            setLoading(false); // 🔹 hide loader
        }
    };

    // 🔹 Resend OTP
    const handleResend = async () => {
        if (resendTimer === 0) {
            try {
                await dispatch(sendOtp({ mobile: phone }));
                setResendTimer(30);
            } catch (err) {
                setError("Failed to resend code, please try again");
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative text-center font-inter">
                {/* Close */}
                <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                    <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                </IconButton>

                {/* Icon */}
                <div className="flex justify-center mt-2 mb-2">
                    <img src={icon} alt="Phone" className="w-[42px] h-[42px]" />
                </div>

                {/* Title + description */}
                <h2 className="text-primary-dark text-xl font-bold mb-2">{title}</h2>
                <p className="text-primary-dark text-base">{description}</p>

                {/* Update phone */}
                <p className="mb-6 text-[#3064A3] underline cursor-pointer">Update Phone Number</p>

                <h2 className="text-base text-black font-inter mb-2">Enter 4 Digits Code</h2>

                {/* OTP inputs */}
                <div className="flex gap-3 mb-1">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            id={`otp-${i}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e.target.value, i)}
                            className={`w-full h-12 text-center border rounded-md text-lg font-bold focus:outline-none 
                ${error ? "border-red-500" : "border-[#E2E2E2]"}`}
                        />
                    ))}
                </div>

                {/* Error msg */}
                {error && <div className="text-left text-red-500 text-xs mb-4">{error}</div>}

                {/* Resend */}
                <p className="text-sm text-[#2E2E2E] my-6">
                    Didn’t receive?{" "}
                    {resendTimer > 0 ? (
                        <span className="text-[#7C868A]">Resend in {resendTimer}s</span>
                    ) : (
                        <span className="text-[#3064A3] underline cursor-pointer" onClick={handleResend}>
                            Resend
                        </span>
                    )}
                </p>

                {/* Verify button */}
                <button
                    onClick={() => handleVerify()}
                    disabled={loading}
                    className="!bg-brand text-white text-base font-semibold rounded-full w-full py-3 flex items-center justify-center"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        "Verify"
                    )}
                </button>
            </Box>
        </Modal>
    );
};

export default VerifyPhoneModal;
