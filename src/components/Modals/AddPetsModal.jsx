import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import { useNavigate } from 'react-router';
import { RoutePath } from '@/common/enums/enumConstant';
import CatAnimation from '../../assets/animation/Cat Animation.gif';
import DogAnimation from '../../assets/animation/Dog Animation.gif';
import Cat from '../../assets/animation/Cat.svg';
import Dog from '../../assets/animation/Dog.svg';

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

const AddPetsModal = ({ open, type, onClose }) => {
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

                <div className="flex gap-2 mt-7">
                    {/* Dog Card */}
                    <div className="flex-1 bg-[#FBFCFC] border border-primary-light rounded-[10px] transition-all cursor-pointer" onClick={() => handleNavigate('dog')}
                        style={{
                            padding: '15px 15px 0 15px'
                        }}>
                        <h4 className="font-inter font-bold text-base text-center mb-2">Add Dog</h4>
                        <img src={type ? Dog : DogAnimation} className="w-full h-[128px]" alt="Dog Animation" />
                    </div>

                    {/* Cat Card */}
                    <div className="flex-1 bg-[#FBFCFC] border border-primary-light rounded-[10px] transition-all cursor-pointer" onClick={() => handleNavigate('cat')}
                        style={{
                            padding: '15px 15px 0 15px'
                        }}
                    >
                        <h4 className="font-inter font-bold text-base text-center mb-2">Add Cat</h4>
                        <img src={type ? Cat : CatAnimation} className="w-full h-[128px]" alt="Cat Animation" />
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default AddPetsModal;
