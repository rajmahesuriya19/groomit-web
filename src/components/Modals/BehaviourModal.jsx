import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';

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
    maxWidth: 450,
    outline: 'none',
};

const BehaviourModal = ({ open, onClose }) => {
    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle} className="relative font-inter">
                    <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                        <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                    </IconButton>

                    <h2 className="text-primary-dark text-xl font-bold leading-[26px] font-inter mb-2 mt-4">
                        Hard to Handle
                    </h2>

                    <p className="text-primary-dark text-sm font-normal leading-[23px] tracking-[-0.02em] font-inter mb-5">
                        Some pets may become too anxious or aggressive during grooming. If extra care is needed, a handling fee may apply. If a pet shows signs of aggression, it may fall under our Non-Groomable Policy (see cancellation policy).
                    </p>

                    <div className='border-b'></div>

                    <h2 className="text-primary-dark text-base font-bold leading-[26px] font-inter mb-2 mt-4">
                        Senior Pets
                    </h2>

                    <p className="text-primary-dark text-sm font-normal leading-[23px] tracking-[-0.02em] font-inter mb-6">
                        Older pets often need more time and gentle handling. A handling fee may be added to ensure their comfort and safety during the service.
                    </p>

                    <Box className="flex gap-2 w-full mt-6">
                        <button
                            onClick={onClose}
                            className="bg-primary-dark text-white text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full"
                        >
                            Okay
                        </button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default BehaviourModal;
