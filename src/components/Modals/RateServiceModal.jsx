import React, { useEffect, useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import { useDispatch, useSelector } from 'react-redux';
import { addBlockedGroomer, addGroomerFav, removeBlockedGroomer, removeGroomerFav, toggleBlockLocal, toggleFavLocal } from '@/utils/store/slices/groomersList/groomersListSlice';
import RateServiceAccordion from '@/common/AccordionExpand/AccordionExpandDefault';

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

const RateServiceModal = ({ type, open, onClose, appointment }) => {
    const dispatch = useDispatch();
    const { groomers } = useSelector((state) => state.groomers);

    // const [localGroomer, setLocalGroomer] = useState(groomer || null);

    // useEffect(() => {
    //     if (!groomer) return;
    //     const updated = groomers.find((g) => g.groomer_id === groomer.groomer_id);
    //     setLocalGroomer(updated || groomer);
    // }, [groomers, groomer]);

    const handleFav = (id, isFav) => {
        // optimistic local toggle
        dispatch(toggleFavLocal(id));

        // use current flag to decide API call
        const nextIsFav = !isFav;

        if (nextIsFav) {
            dispatch(addGroomerFav(id));
        } else {
            dispatch(removeGroomerFav(id));
        }
    };

    const handleBlock = (id, isBlocked) => {
        dispatch(toggleBlockLocal(id));

        if (isBlocked) {
            dispatch(removeBlockedGroomer(id));
        } else {
            dispatch(addBlockedGroomer(id));
        }
    };

    // if (!localGroomer) return null;

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle} className="relative text-center font-inter">
                    {/* Close */}
                    <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                        <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                    </IconButton>
                      {/* Content */} 
                    <RateServiceAccordion ratings={appointment} fromModal={true} />
                </Box>
            </Modal>

            {/* <BlockModal
                type={localGroomer?.is_blocked_groomer ? 'Unblock' : ''}
                open={blockModal}
                onClose={() => setBlockModal(false)}
                onConfirm={() => {
                    handleBlock(localGroomer.groomer_id, localGroomer.is_blocked_groomer);
                    setBlockModal(false);
                    onClose();
                }}
                title={localGroomer?.is_blocked_groomer ? `Unblock ${localGroomer?.name}` : `Block ${localGroomer?.name}`}
                description={`Are you sure you want to ${localGroomer?.is_blocked_groomer ? 'Unblock' : 'block'} this groomer`}
            /> */}
        </>
    );
};

export default RateServiceModal;
