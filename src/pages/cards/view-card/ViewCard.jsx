import React, { useEffect, useState } from 'react'
import backIcon from '../../../assets/icon/arrow-left.svg';
import Location from '../../../assets/icon/location-red.svg';
import Card from '../../../assets/cards/card-bg.svg';
import CardVerify from '../../../assets/icon/card-red.svg';
import Visa from '../../../assets/cards/Visa-light.svg';
import JCB from '../../../assets/cards/jcb-icon.svg';
import Fallback from '../../../assets/cards/fall-card.svg';
import MasterCard from '../../../assets/cards/mastercard-icon.svg';
import Delete from '../../../assets/icon/delete-red.svg';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';
import { useDispatch, useSelector } from 'react-redux';
import { deletePaymentCard, verifyPaymentCard } from '@/utils/store/slices/paymentCards/paymentCardSlice';
import VerifyCardModal from '@/components/Modals/VerifyCardModal';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';

const cardIcons = {
    visa: Visa,
    mastercard: MasterCard,
    jcb: JCB,
};

const ViewCard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [card, setCard] = useState(null);

    const { cards } = useSelector((state) => state.cards);

    useEffect(() => {
        if (cards?.length) {
            const selectedCard = cards.find((c) => c.billing_id === id || c.billing_id === Number(id));
            setCard(selectedCard);
        }
    }, [cards, id]);

    const handleDeleteAccount = async () => {
        showLoader();
        try {
            await dispatch(deletePaymentCard({ cardId: card.billing_id })).unwrap();
            setIsDeleteModalOpen(false);
            hideLoader();
            navigate('/user/account');
        } catch (err) {
            alert(err.message || 'Failed to delete card');
            hideLoader();
        }
    };

    const handleVerifyCard = async (amount) => {
        try {
            await dispatch(
                verifyPaymentCard({
                    user_billing_id: card.billing_id,
                    amount,
                })
            ).unwrap();
            setVerifyModalOpen(false);
            navigate("/user/account")
        } catch (err) {
            toast.error(err.message || "Failed to verify card");
        }
    };

    if (!card) {
        return (
            <div className="w-full px-4 md:px-8 py-6 text-center text-gray-500">
                Loading card details...
            </div>
        );
    }

    return (
        <div className="w-full px-4 md:px-8 py-6">
            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/user/account')}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow"
                    >
                        <img src={backIcon} alt="Back" className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold text-primary-dark">Card Details</h2>
                </div>

                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-[#EB5757] underline text-base"
                >
                    Delete Card
                </button>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden -mx-4 mb-6">
                <div className="flex items-center justify-between bg-white px-5 py-4 shadow-md">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center"
                    >
                        <ChevronLeft size={24} className="text-primary-light" />
                    </button>

                    <h2 className="text-lg font-bold text-primary-dark">Card Details</h2>

                    <div className="w-6 h-6" />
                </div>
            </div>

            {/* Card Details */}
            <div className="rounded-[15px] p-4 md:p-6 flex flex-col md:flex-row gap-6 bg-white shadow-md">
                {/* Card Image */}
                <div className="relative md:w-full h-[128px] rounded-[15px] overflow-hidden">
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
                                <span className="text-[8px] uppercase font-medium tracking-wider">Number</span>
                                <span className="text-lg font-bold tracking-widest leading-tight">**** **** **** {card.card_number}</span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-5 text-white">
                        <div className="text-[8px] font-medium uppercase tracking-wide">Name</div>
                        <div className="text-sm font-semibold tracking-wider mt-1 leading-tight">{card.card_holder}</div>
                    </div>

                    <div className="absolute bottom-4 right-4 md:right-[70px] text-white text-right">
                        <div className="text-[8px] font-medium uppercase tracking-wide">End Date</div>
                        <div className="text-base font-bold mt-1 leading-tight">{card.expire_mm}/{card.expire_yy}</div>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px bg-[#C9CFD4]" />

                {/* Address */}
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center gap-2">
                        <img src={Location} alt="Location" className="w-6 h-6" />
                        <h2 className="text-base font-bold text-primary-dark">Billing Address</h2>
                    </div>

                    <div className="flex flex-col">
                        <h2 className="text-sm font-bold text-primary-dark">
                            {card.address1}
                        </h2>
                        <h2 className="text-base font-normal text-primary-dark">
                            {card.city}, {card.state} {card.zip}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Desktop Verify Button */}
            {card?.status === "P" && <div className="hidden md:flex justify-center items-center py-8">
                <button
                    type="submit"
                    onClick={() => setVerifyModalOpen(true)}
                    className='w-[193px] h-[48px] rounded-[30px] px-[31px] py-[11px] gap-[10px] flex items-center justify-center text-base font-semibold font-inter leading-[18px] text-center transition-colors duration-200
      bg-primary-dark text-white cursor-pointer'
                >
                    Verify Card
                </button>
            </div>}

            {/* Mobile Delete Button */}
            <div className="md:hidden px-5 pt-4 text-center mb-28">
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-[#EB5757] underline text-base"
                >
                    Delete Card
                </button>
            </div>

            {/* Sticky Mobile Verify Button */}
            {card?.status === "P" && <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                <button
                    type="submit"
                    onClick={() => setVerifyModalOpen(true)}
                    className='w-full h-[48px] rounded-[30px] flex items-center justify-center text-base font-semibold font-inter leading-[18px] transition-colors duration-200
      bg-primary-dark text-white'
                >
                    Verify Card
                </button>
            </div>}

            <DeleteAccountModal
                type={'card'}
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                icon={Delete}
                title={"Delete Credit Card"}
                decription={"Are you sure you want to delete this credit card?"}
            />
            <VerifyCardModal
                type={'card'}
                open={verifyModalOpen}
                onClose={() => setVerifyModalOpen(false)}
                onConfirm={handleVerifyCard}
                icon={CardVerify}
                title={"Verify Your Card"}
                decription={"Please confirm your card by verifying the small amount charged on your card"}
                decription1={`**** **** **** ${card?.card_number}`}
            />
        </div>
    )
}

export default ViewCard
