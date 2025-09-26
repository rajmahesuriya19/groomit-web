import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import { useNavigate } from 'react-router';
import { RoutePath } from '@/common/enums/enumConstant';

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
    maxWidth: 420,
    outline: 'none',
};

const AddPetsModal = ({ open, onClose, iconDog, iconCat }) => {
    const navigate = useNavigate();

    const handleNavigate = (pet) => {
        if (pet === "dog") {
            navigate(RoutePath.ADD_DOG.replace(':title', pet));
        } else {
            navigate(RoutePath.ADD_CAT.replace(':title', pet));
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle} className="relative text-center font-inter">
                <IconButton
                    onClick={onClose}
                    className="!absolute !top-4 !right-4 bg-gray-100 hover:bg-gray-200 rounded-full"
                    size="small"
                >
                    <img src={Close} alt="Close" className="w-5 h-5" />
                </IconButton>

                <h2 className="text-lg font-bold text-primary-dark mb-4">
                    Add a New Pet
                </h2>
                <p className="text-sm text-primary-light mb-6">
                    Choose whether you’d like to add a dog or a cat
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        className="flex flex-col items-center hover:scale-105 transition-transform"
                        onClick={() => handleNavigate('dog')}
                    >
                        <img
                            src={iconDog}
                            alt="Add Dog"
                            className="w-[160px] h-[140px] object-contain"
                        />
                    </button>

                    <button
                        className="flex flex-col items-center hover:scale-105 transition-transform"
                        onClick={() => handleNavigate('cat')}
                    >
                        <img
                            src={iconCat}
                            alt="Add Cat"
                            className="w-[160px] h-[140px] object-contain"
                        />
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default AddPetsModal;
