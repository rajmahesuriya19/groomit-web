import React, { useState, useEffect } from 'react';
import { Modal, Box, IconButton, styled, TextField } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import { useDispatch } from 'react-redux';
import { verifyOtp, sendOtp, sendOtpByEmail, verifyOtpByEmail } from '@/utils/store/slices/userInfo/userInfoSlice';
import { CustomInput } from '../CustomInput';

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

const NewVerifyPhoneModal = ({
    open,
    onClose,
    onConfirm,
    phone,
    email,
}) => {
    const dispatch = useDispatch();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [verifyVia, setVerifyVia] = useState("mobile"); // mobile | email

    // 🔹 Reset when modal closes
    useEffect(() => {
        if (!open) {
            setOtp("");
            setError("");
            setResendTimer(0);
            setVerifyVia("mobile");
        }
    }, [open]);

    // 🔹 Auto send OTP when modal opens
    useEffect(() => {
        if (open && phone) {
            dispatch(sendOtp({ mobile: phone }));
            setResendTimer(30);
        }
    }, [open, phone, dispatch]);

    // 🔹 Countdown timer
    useEffect(() => {
        if (resendTimer === 0) return;
        const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendTimer]);

    const handleVerify = async (code = otp) => {
        const finalCode = typeof code === "string" ? code : code.join("");

        if (finalCode.length < 4) {
            setError("Please enter full code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const payload =
                verifyVia === "mobile"
                    ? { mobile: phone, otp: finalCode }
                    : { email, key: finalCode };

            const result = await dispatch(
                verifyVia === "mobile"
                    ? verifyOtp(payload)
                    : verifyOtpByEmail(payload)
            );

            const isSuccess =
                verifyVia === "mobile"
                    ? verifyOtp.fulfilled.match(result)
                    : verifyOtpByEmail.fulfilled.match(result);

            if (isSuccess) {
                onConfirm?.(finalCode);
            } else {
                setError("Entered code does not match, please provide a valid code");
            }
        } catch (err) {
            setError("Verification failed, please try again");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer !== 0) return;

        try {
            await dispatch(
                verifyVia === "mobile"
                    ? sendOtp({ mobile: phone })
                    : sendOtp({ email })
            );
            setResendTimer(30);
        } catch {
            setError("Failed to resend code, please try again");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative text-center font-inter">

                {/* Close */}
                <IconButton
                    onClick={onClose}
                    className="!absolute !top-4 !right-4"
                    size="small"
                >
                    <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                </IconButton>

                {/* Title */}
                <h2 className="text-primary-dark text-xl font-bold mt-4">
                    {
                        (verifyVia === "mobile"
                            ? "Verify Phone Number"
                            : "Email Verification")}
                </h2>

                {/* Description */}
                <p className="text-primary-dark text-base mt-2">
                    {verifyVia === "mobile"
                        ? `Verification code sent to ${phone}`
                        : `Please check and enter the code we’ve sent to ${email}`}
                </p>

                {/* Toggle */}
                <p
                    className="text-base mb-6 text-[#3064A3] underline cursor-pointer mt-2"
                    onClick={() => {
                        dispatch(sendOtpByEmail({ email: email }));
                        setVerifyVia(prev => prev === "mobile" ? "email" : "mobile");
                        setOtp("");
                        setError("");
                        setResendTimer(0);
                    }}
                >
                    {verifyVia === "mobile"
                        ? "Get Code Via Email Instead"
                        : "Get Code Via Mobile Instead"}
                </p>

                {/* OTP Input */}
                <CustomInput
                    label="Enter 4 Digits Code"
                    fullWidth
                    value={otp}
                    error={!!error}
                    inputProps={{
                        maxLength: 4,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                    }}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setOtp(value);
                        setError("");

                        if (value.length === 4) {
                            handleVerify(value);
                        }
                    }}
                />

                {/* Error */}
                {error && (
                    <div className="text-left text-brand text-xs mt-2">
                        {error}
                    </div>
                )}

                {/* Resend */}
                <p className="text-base text-[#2E2E2E] my-6 w-full">
                    {verifyVia === "email"
                        ? "Didn't received? Check your spam or "
                        : "Didn’t receive?"}
                    {resendTimer > 0 ? (
                        <span className="text-[#7C868A]">
                            Resend in {resendTimer}s
                        </span>
                    ) : (
                        <span
                            className="text-[#3064A3] underline cursor-pointer"
                            onClick={handleResend}
                        >
                            {verifyVia === "email"
                                ? "Resend Email"
                                : "Resend"}
                        </span>
                    )}
                </p>

                {/* Verify Button */}
                <button
                    onClick={() => handleVerify()}
                    disabled={loading}
                    className="bg-primary-dark text-white text-base font-bold rounded-[10px] h-[50px] w-full flex items-center justify-center"
                >
                    {loading ? "Verifying..." : "Verify"}
                </button>
            </Box>
        </Modal>
    );
};

export default NewVerifyPhoneModal;
