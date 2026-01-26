import React, { useState } from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import Close from '../../assets/icon/close.svg';
import Star from '../../assets/icon/star-slash.svg';
import StarBlack from '../../assets/icon/star-gray.svg';
import Info from '../../assets/icon/info-circle-yellow.svg';
import Succes from '../../assets/icon/tick-green.svg';
import Card from '../../assets/cards/card-black-bg.svg';
import Visa from '../../assets/cards/Visa-light.svg';
import JCB from '../../assets/cards/jcb-icon.svg';
import Fallback from '../../assets/cards/fall-card.svg';
import MasterCard from '../../assets/cards/mastercard-icon.svg';
import { toast } from 'react-toastify';
import DeleteAccountModal from './DeleteAccountModal';
import { deletePaymentCard, fetchPaymentCards } from '@/utils/store/slices/paymentCards/paymentCardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import SuccessModal from './SuccessModal';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import VerifyCardModal from './VerifyCardModal';

const cardIcons = {
    visa: Visa,
    mastercard: MasterCard,
    jcb: JCB,
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '20px',
    boxShadow: 24,
    p: '28px 18px',
    width: '90%',
    maxWidth: 400,
    outline: 'none',
};

const ViewCardModal = ({ type, open, onClose, onConfirm, onDefault, card }) => {
    const dispatch = useDispatch();
    const { showLoader, hideLoader } = useLoader();

    const [successModal, setSuccessModal] = useState(false);
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const token = useSelector((state) => state.auth.unique_token);

    const handleDeleteAccount = async () => {
        showLoader();
        try {
            await dispatch(deletePaymentCard({ cardId: card.billing_id, booking_session_token: token })).unwrap();
            setIsDeleteModalOpen(false);
            setSuccessModal(true);
            hideLoader();
        } catch (err) {
            alert(err.message || 'Failed to delete card');
            hideLoader();
        }
    };

    const handleVerifyCard = async (amount) => {
        try {
            // await dispatch(
            //     verifyPaymentCard({
            //         user_billing_id: card.billing_id,
            //         amount,
            //     })
            // ).unwrap();
            setVerifyModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to verify card");
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle} className="relative text-center font-inter">
                    {/* Close button */}
                    <IconButton onClick={onClose} className="!absolute !top-4 !right-4" size="small">
                        <img src={Close} alt="Close" className="w-[24px] h-[24px]" />
                    </IconButton>

                    <h2 className="text-primary-dark mt-3 text-xl font-bold text-center font-inter mb-2">
                        Card Details
                    </h2>

                    {card?.status === "P" && <div className="flex items-center justify-center gap-1 mt-4">
                        <img src={Info} alt="Info" className="w-[16px] h-[16px]" />
                        <span className="text-xs font-semibold text-[#ED9F00] font-inter mt-1 text-center">
                            NOT VERIFIED
                        </span>
                    </div>}

                    <div className="relative md:w-full h-[128px] rounded-[15px] overflow-hidden mt-4 mb-4">
                        <img src={Card} alt="Card" className="w-[390px] h-[128px] object-cover hidden md:block" />
                        <img src={Card} alt="Card" className="w-full h-full object-cover md:hidden" />

                        <div className="absolute top-4 left-5 text-white">
                            <div className="flex items-start gap-3">
                                <img
                                    src={cardIcons[card.card_provider?.toLowerCase()] || Fallback}
                                    alt={card.card_provider || "Card"}
                                    className="w-12 h-7 object-contain"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[8px] uppercase font-medium tracking-wider text-start">Number</span>
                                    <span className="text-xl font-bold tracking-widest leading-tight">**** **** **** {card.card_number}</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-4 left-5 text-white">
                            <div className="text-[8px] font-medium uppercase tracking-wide text-start">Name</div>
                            <div className="text-xs font-bold tracking-wider mt-1 leading-tight text-start uppercase">{card.card_holder}</div>
                        </div>

                        <div className="absolute bottom-4 right-4 md:right-[70px] text-white text-right">
                            <div className="text-[8px] font-medium uppercase tracking-wide text-start">End Date</div>
                            <div className="text-xs font-bold mt-1 leading-tight text-start">{card.expire_mm}/{card.expire_yy}</div>
                        </div>
                    </div>

                    <p className="text-primary-dark text-sm font-bold leading-[23px] tracking-[-0.02em] text-start">
                        {card.address1}, {card.city}, {card.state} {card.zip}
                    </p>
                    <p className="text-primary-dark text-sm font-normal leading-[23px] tracking-[-0.02em] text-start">
                        Billing Address
                    </p>

                    {/* <Box className="flex gap-2 w-full mt-4">
                    <button
                        onClick={onConfirm}
                        className="bg-white text-primary-dark border border-primary-dark text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full flex items-center justify-center gap-2"
                    >
                        <img src={Star} alt="Star" className="w-[24px] h-[24px]" />
                        <div>Remove from Default</div>
                    </button>
                </Box> */}

                    {card?.status === "P" && <Box className="flex gap-2 w-full mt-4">
                        <button
                            onClick={() => { onClose(); setVerifyModalOpen(true) }}
                            className="bg-white text-primary-dark border border-primary-dark text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full flex items-center justify-center gap-2"
                        >
                            Verify Card
                        </button>
                    </Box>}

                    {(card?.status !== "P" && card?.default_card !== "Y") && <Box className="flex gap-2 w-full mt-4">
                        <button
                            onClick={onDefault}
                            className="bg-white text-primary-dark border border-primary-dark text-base font-bold rounded-[10px] px-[27px] h-[50px] w-full flex items-center justify-center gap-2"
                        >
                            <img src={StarBlack} alt="Star" className="w-[24px] h-[24px]" />
                            <div>Set as Default</div>
                        </button>
                    </Box>}

                    <button
                        onClick={() => { onClose(); setIsDeleteModalOpen(true) }}
                        className={`text-[#EB5757] underline text-base mb-4 ${card?.status === "P" ? 'mt-4' : (card?.status !== "P" && card?.default_card !== "Y") ? 'mt-4' : 'mt-8'}`}
                    >
                        Delete Card
                    </button>
                </Box>
            </Modal>

            <DeleteAccountModal
                type={'card'}
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title={"Delete Card"}
                decription={"Are you sure you want to delete this credit card?"}
            />
            <SuccessModal
                open={successModal}
                onClose={() => setSuccessModal(false)}
                onConfirm={() => {
                    showLoader();
                    dispatch(fetchPaymentCards()).finally(() => hideLoader());
                    onClose();
                    setSuccessModal(false);
                }}
                icon={Succes}
                title={"Your Payment card has been deleted successfully!"}
            />
            <VerifyCardModal
                type={'card'}
                open={verifyModalOpen}
                onClose={() => setVerifyModalOpen(false)}
                onConfirm={handleVerifyCard}
                title={"Verify Your Card"}
                decription={
                    <>
                        Please confirm your card by verifying the small <br />amount charged to your card •••• •••• •••• {card?.card_number}
                    </>
                }
            />
        </>
    );
};

export default ViewCardModal;
