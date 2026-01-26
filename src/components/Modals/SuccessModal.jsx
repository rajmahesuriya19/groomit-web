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

const SuccessModal = ({ type, open, onClose, onConfirm, icon, title, decription }) => {
    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle} className="relative text-center font-inter">
                    <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                        <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                    </IconButton>

                    <div className="flex justify-center mt-2 mb-2">
                        <img src={icon} alt="Warning" className="w-[50px] h-[50px]" />
                    </div>

                    <h2 className="text-primary-dark text-xl font-bold leading-[26px] text-center font-inter mb-2">
                        {title}
                    </h2>

                    <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.02em] text-center font-inter mb-6">
                        {decription}
                    </p>

                    <Box className="flex gap-2 w-full mt-6">
                        <button
                            onClick={onConfirm}
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

export default SuccessModal;
