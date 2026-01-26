import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Info from '../../assets/icon/info-circle-yellow.svg';
import Visa from '../../assets/cards/Visa-light.svg';
import JCB from '../../assets/cards/jcb-icon.svg';
import GooglePay from '../../assets/cards/google-pay.svg';
import ApplePay from '../../assets/cards/apple-pay.svg';
import MasterCard from '../../assets/cards/mastercard-icon.svg';
import Fallback from '../../assets/cards/fall-card.svg';
import CardVerify from '../../assets/icon/card-red.svg';
import { useDispatch, useSelector } from "react-redux";
import ViewCardModal from "@/components/Modals/ViewCardModal";
import { defaultPaymentCard, verifyPaymentCard } from "@/utils/store/slices/paymentCards/paymentCardSlice";

const cardIcons = {
    visa: Visa,
    mastercard: MasterCard,
    jcb: JCB,
};

const PaymentCardList = ({ card, isLast }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const token = useSelector((state) => state.auth.unique_token);

    const handleVerifyCard = async (amount) => {
        try {
            await dispatch(
                verifyPaymentCard({
                    user_billing_id: card.billing_id,
                    amount,
                })
            ).unwrap();
            setVerifyModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to verify card");
        }
    };

    const handleDefaultCard = async () => {
        try {
            await dispatch(
                defaultPaymentCard({
                    user_billing_id: card?.billing_id,
                    booking_session_token: token
                })
            ).unwrap();
            setVerifyModalOpen(false);
        } catch (err) {
            toast.error(err.message || "Failed to verify card");
        }
    };

    const isGooglePay = card?.payment_type === "G";
    const isDefault = card?.default_card === "Y";
    const isVerified = card?.status === "A";

    const cardTitle = isGooglePay
        ? `Ending with •••• ${card?.card_number}`
        : card?.card_provider
            ? `${card.card_provider} Card •••• ${card.card_number}`
            : `Ending with •••• ${card?.card_number}`;

    const cardIcon =
        isGooglePay
            ? GooglePay
            : cardIcons[card?.card_provider?.toLowerCase()] || Fallback;

    return (
        <>
            <div className={`group w-full flex items-center justify-between gap-3 cursor-pointer
        ${!isLast ? "pb-4 border-b border-[#E4E4E4]" : ""}`}>
                {/* Left: Card Info */}
                <div className="flex items-center gap-3 w-full">
                    <img
                        src={cardIcon}
                        alt={card?.card_provider || "Card"}
                        className="w-[50px] h-[32px]"
                    />
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex items-center gap-1 w-full">
                            <p className="text-sm font-bold text-primary-dark leading-tight truncate capitalize">
                                {cardTitle}
                            </p>
                            {isDefault && (
                                <span className="inline-flex items-center px-[6px] pt-[2px] pb-[1px] rounded-full text-xs font-bold uppercase border border-primary-line w-fit">
                                    DEFAULT
                                </span>
                            )}
                        </div>
                        {isVerified ? (
                            <p className="text-sm font-normal text-primary-dark leading-tight truncate capitalize">
                                {card?.card_holder}
                            </p>
                        ) : (
                            <div className="flex items-center gap-1">
                                <img src={Info} alt="Info" className="w-[16px] h-[16px]" />
                                <span className="text-xs font-semibold text-[#ED9F00] font-inter mt-1">
                                    NOT VERIFIED
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    {card?.status !== "A" && <button
                        className="bg-primary-dark text-white text-sm font-bold rounded-[5px] py-[5px] px-[10px] h-[35px]"
                        onClick={() => setVerifyModalOpen(true)}
                    >
                        Verify
                    </button>}
                    <ChevronRight
                        size={24}
                        className="text-primary-light transition-transform group-hover:translate-x-0.5"
                        onClick={() => setVerifyModalOpen(true)}
                    />
                </div>
            </div>

            <ViewCardModal
                type={'card'}
                open={verifyModalOpen}
                onClose={() => setVerifyModalOpen(false)}
                onConfirm={handleVerifyCard}
                onDefault={handleDefaultCard}
                card={card}
            />
        </>
    );
};

export default PaymentCardList;
