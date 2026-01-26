import React, { useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import ImproveDeleteAccountModal from './ImproveDeleteAccountModal';

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

const DeleteAccountModal = ({ type, open, onClose, onConfirm, icon, title, decription, improveDeleteModalOpen, setImproveDeleteModalOpen }) => {
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle} className="relative text-center font-inter">
          <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
            <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
          </IconButton>

          {icon && <div className={`flex justify-center ${type === 'account' ? 'mt-5' : 'mt-2'} mb-2`}>
            <img src={icon} alt="Warning" className={`${type === 'account' ? '' : 'w-[42px] h-[42px]'}`} />
          </div>}

          <h2 className={`text-primary-dark text-xl font-bold leading-[26px] text-center font-inter ${!icon && 'mt-4'} mb-2`}>
            {title}
          </h2>

          <p className="text-primary-dark text-base font-normal leading-[23px] tracking-[-0.02em] text-center font-inter mb-6">
            {decription}
          </p>

          {type === 'account' ? <Box className="flex flex-col gap-4">
            <button
              onClick={onConfirm}
              className="!bg-primary-dark text-white font-inter text-base font-bold leading-[18px] rounded-[10px] px-[27px] py-[15px] h-[50px] w-full"
            >
              Yes, Delete My Account
            </button>
            <button
              onClick={onClose}
              className="!bg-white border border-primary-dark text-primary-dark font-inter text-base font-bold leading-[18px] rounded-[10px] px-[27px] py-[15px] h-[50px] w-full"
            >
              No, Keep My Account
            </button>
          </Box> :
            <Box className="flex gap-2 w-full mt-6">
              <button
                onClick={onClose}
                className="bg-white border border-primary-dark text-primary-dark text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="bg-primary-dark text-white text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full"
              >
                Yes, Delete
              </button>
            </Box>
          }
        </Box>
      </Modal>

      <ImproveDeleteAccountModal
        open={improveDeleteModalOpen}
        onClose={() => setImproveDeleteModalOpen(false)}
        onConfirm={() => setImproveDeleteModalOpen(false)}
        title={"Help us improve before you go"}
      />
    </>
  );
};

export default DeleteAccountModal;
