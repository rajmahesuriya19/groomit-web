import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import Dollor from '../../assets/icon/dollar-circle.svg';
import { toast } from 'react-toastify';

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

const VerifyCardModal = ({ type, open, onClose, onConfirm, icon, title, decription, decription1 }) => {
    const [amount, setAmount] = React.useState("");

    const handleConfirm = () => {
        if (!amount) return toast.info('Please enter amount');
        onConfirm(amount);
    };
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative text-center font-inter">
                {/* Close button */}
                <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                    <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                </IconButton>

                {/* Icon */}
                <div className="flex justify-center mt-2 mb-2">
                    <img src={icon} alt="Warning" className="w-[42px] h-[42px]" />
                </div>

                {/* Title + description */}
                <h2 className="text-primary-dark text-xl font-bold leading-[26px] text-center font-inter mb-2">
                    {title}
                </h2>
                <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.02em] text-center font-inter">
                    {decription}
                </p>
                <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.02em] text-center font-inter">
                    {decription1}
                </p>

                {/* Input */}
                <div className="mt-6 mb-2">
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Enter charged amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full rounded-md border border-[#E2E2E2] px-4 py-2 text-base leading-[21px] tracking-[-0.02em] font-inter text-primary-dark placeholder:text-gray-300"
                            step="0.01"
                            min="0"
                        />

                        <div className="absolute inset-y-0 right-3 flex items-center">
                            <img src={Dollor} alt="user" className="w-[24px] h-[24px]" />
                        </div>
                    </div>
                </div>

                <p className="mb-6 text-[#7C868A] text-base font-normal leading-[23px] tracking-[-0.02em] text-center font-inter">
                    Your request for recharge sent successfully
                </p>

                {/* Link */}
                <p className="text-[#2E2E2E] text-center font-inter text-[16px] font-normal leading-[21px] tracking-[-0.32px] mb-6">
                    Can’t See Charge?{" "}
                    <span className="text-[#3064A3] underline font-inter text-[16px] font-normal leading-[21px] tracking-[-0.32px]">
                        Request Recharge
                    </span>
                </p>

                {/* Confirm button */}
                <Box className="flex flex-col sm:flex-row justify-between gap-4">
                    <button
                        onClick={handleConfirm}
                        className="!bg-brand text-white font-inter text-base font-semibold leading-[18px] rounded-full px-[27px] py-[11px] h-[48px] w-full"
                    >
                        Verify
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default VerifyCardModal;
