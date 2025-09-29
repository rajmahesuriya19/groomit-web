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
    maxWidth: 400,
    outline: 'none',
};

const BreedModal = ({ open, onClose, onConfirm, icon, title, decription }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative text-center font-inter">
                <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                    <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                </IconButton>

                <h2 className="mt-5 text-primary-dark text-xl font-bold leading-[26px] text-center font-inter mb-2">
                    {title}
                </h2>

                <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.02em] text-center font-inter mb-6">
                    {decription}
                </p>

                <Box className="flex flex-col sm:flex-row justify-between gap-4">
                    <button
                        onClick={onConfirm}
                        className="!bg-brand text-white font-inter text-base font-semibold leading-[18px] rounded-full px-[27px] py-[11px] h-[48px] w-full"
                    >
                        Okay
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default BreedModal;
