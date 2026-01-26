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

const CreatePetModal = ({ type, open, onClose, onBook, onNavigate, icon, title, decription }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative text-center font-inter">
                <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                    <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                </IconButton>

                <div className="flex justify-center mt-2 mb-2">
                    <img src={icon} alt="Animation" className="w-[158px] h-[150px] rounded-[20px]" />
                </div>

                <h2 className="text-primary-dark text-xl font-bold leading-[26px] text-center font-inter mb-2">
                    {title}
                </h2>

                <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.02em] text-center font-inter mb-6">
                    {decription}
                </p>

                <Box className="flex flex-col justify-between gap-2 w-full">
                    <button
                        onClick={onNavigate}
                        className={`h-[50px] w-full rounded-[10px] text-primary-dark text-base font-bold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95 bg-white cursor-pointer border border-primary-dark`}
                    >
                        Back to My Pets
                    </button>
                    <button
                        onClick={onBook}
                        className={`h-[50px] w-full rounded-[10px] text-white text-base font-bold tracking-wide transition-all duration-200 hover:opacity-90 active:scale-95 bg-primary-dark cursor-pointer`}
                    >
                        Book Appointment
                    </button>
                </Box>

                <div className='mt-2 text-xs text-normal'>It’s takes you only 3-5 minuttes to book appointment!</div>
            </Box>
        </Modal>
    );
};

export default CreatePetModal;
