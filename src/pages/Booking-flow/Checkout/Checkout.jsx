import Card from '@/common/Booking-Flow/Card';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import Calendar from '../../../assets/icon/calendar-black.svg';
import LocationIcon from "../../../assets/icon/location.svg";
import HomeIcon from "../../../assets/icon/home-selection-a.svg";
import MobileVanIcon from "../../../assets/icon/mobile-van.svg";
import PawIcon from "../../../assets/icon/pet.svg";
import infoGrey from "../../../assets/icon/info-circle-grey.svg";

import GooglePay from '../../../assets/cards/google-pay.svg';
import ApplePay from '../../../assets/cards/apple-pay.svg';
import Visa from '../../../assets/cards/Visa-light.svg';
import JCB from '../../../assets/cards/jcb-icon.svg';
import MasterCard from '../../../assets/cards/mastercard-icon.svg';
import Fallback from '../../../assets/cards/fall-card.svg';

import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Radio } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { fetchPaymentCards } from '@/utils/store/slices/paymentCards/paymentCardSlice';
import TaxInsuranceModal from '@/components/Modals/TaxInsuranceModal';
import { CustomInput } from '@/components/CustomInput';

/* ---------------- constants ---------------- */

const cardIcons = {
    visa: Visa,
    mastercard: MasterCard,
    jcb: JCB,
};

const ADD_ONS = [
    { title: 'Premium (Scented) - Shampoo', price: 'Free' },
    { title: 'Cold-Weather', price: '$35' },
    { title: 'Cold-Weather', price: '$35' },
];

/* ---------------- helpers ---------------- */

const normalizeApiCard = (card) => {
    const provider = card?.card_provider?.toLowerCase();
    const last4 = card?.card_number;

    return {
        id: card.billing_id,
        type: "card",
        billing_id: card.billing_id,
        label: `${provider || 'card'} •••• ${last4}`,
        sublabel: card?.payment_type_name || '',
        icon: cardIcons[provider] || Fallback,
        isDefault: card.default_card === "Y",
    };
};

/* ---------------- components ---------------- */

const CheckoutRow = ({ icon, title, subtitle, onClick, showDivider }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between py-3 cursor-pointer first:pt-0 last:pb-0
        ${showDivider ? 'border-t border-[#E4E4E4]' : ''}`}
    >
        <div className="flex gap-3">
            <div className="bg-[#F2F2F2] rounded-[10px] w-9 h-9 flex items-center justify-center">
                <img src={icon} alt="" className="w-5 h-5" />
            </div>

            <div className="flex flex-col">
                <div className="flex gap-2 text-sm font-bold text-primary-dark capitalize">
                    {title}
                    {(subtitle === "Preferred Groomer" || subtitle === "Service Type") && (
                        <img src={infoGrey} alt="" className="w-5 h-5" />
                    )}
                </div>
                <span className="text-sm">{subtitle}</span>
            </div>
        </div>

        {(subtitle === "Preferred Groomer" ||
            subtitle === "Requested Time" ||
            subtitle === "Pets to be Groomed") && (
                <ChevronRight size={30} className="text-primary-light" />
            )}
    </div>
);

const PaymentMethodRow = ({
    icon,
    label,
    sublabel,
    selected,
    showDivider,
    onSelect,
    isNew,
}) => (
    <div
        onClick={onSelect}
        className={`flex items-center justify-between py-4 cursor-pointer
        ${showDivider ? 'border-b border-[#E4E4E4]' : ''}`}
    >
        <div className="flex gap-3 items-center">
            <img src={icon} alt={label} className="w-[48px] h-8" />

            <div className="flex flex-col">
                <span className="text-sm font-bold text-primary-dark capitalize">
                    {label}
                </span>
                {sublabel && <span className="text-sm">{sublabel}</span>}
            </div>
        </div>

        {!isNew ? (
            <Radio
                checked={selected}
                sx={{
                    p: 0,
                    color: "#7C868A",
                    "&.Mui-checked": { color: "#FF314A" },
                }}
            />
        ) : (
            <ChevronRight size={30} className="text-primary-light" />
        )}
    </div>
);

/* ---------------- main ---------------- */

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();

    const cards = useSelector((state) => state.cards.cards || []);
    const [openTaxModal, setOpenTaxModal] = useState(false);
    const [openSummary, setOpenSummary] = useState(false);

    const bookingFlow = useSelector((state) => state.bookingFlow);
    const {
        serviceType,
        petsDraft,
        address: bookingAddress,
        totalPrice
    } = bookingFlow;

    const pets = petsDraft || [];

    const getPetNamesLabel = (pets = [], limit = 3) => {
        const names = pets
            .map(p => p?.stepData?.details?.name)
            .filter(Boolean);

        if (names.length <= limit) {
            return names.join(", ");
        }

        const visible = names.slice(0, limit).join(", ");
        const remaining = names.length - limit;

        return `${visible} +${remaining} more`;
    };

    const petNamesText = getPetNamesLabel(pets);

    /* ---------------- Default Address ---------------- */
    const displayAddress = useMemo(() => {
        return bookingAddress || null;
    }, [bookingAddress]);

    const [selectedPayment, setSelectedPayment] = useState({
        billing_id: null,
        type: null,
    });

    useEffect(() => {
        showLoader();
        dispatch(fetchPaymentCards()).finally(hideLoader);
    }, [dispatch]);

    useEffect(() => {
        if (!cards.length) return;

        const defaultCard = cards.find(c => c.default_card === "Y") || cards[0];

        setSelectedPayment({
            billing_id: defaultCard.billing_id,
            type: "card",
        });
    }, [cards]);

    const paymentMethods = useMemo(() => {
        const apiCards = cards.map(normalizeApiCard);

        return [
            {
                id: "gpay",
                type: "gpay",
                label: "Google Pay",
                icon: GooglePay,
                billing_id: "gpay",
            },
            {
                id: "apple",
                type: "apple",
                label: "Apple Pay",
                icon: ApplePay,
                billing_id: "apple",
            },
            ...apiCards,
            {
                id: "new-card",
                type: "new",
                label: "New Credit / Debit Card",
                sublabel:
                    "We Accept Visa, Mastercard, Amex, Discover, JCB, Maestro & Diner Clubs",
                icon: Fallback,
            },
        ];
    }, [cards]);

    return (
        <>
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="flex items-center px-6 py-3">
                    <ChevronLeft size={24} className="cursor-pointer" onClick={() => navigate(-1)} />
                    <h1 className="flex-1 text-center font-filson font-bold text-xl">
                        Checkout
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4 pb-32 max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Left */}
                    <div className="flex flex-col gap-4 w-full lg:w-1/2">
                        <Card>
                            <CheckoutRow title={displayAddress
                                ? `${displayAddress.address1} ${displayAddress.address2}, ${displayAddress.city}, ${displayAddress.state} ${displayAddress.zip}`
                                : "No address selected"} subtitle={'Service Address'} icon={LocationIcon} />
                            <CheckoutRow title={serviceType.toLowerCase()} subtitle={'Service Type'} icon={serviceType.toLowerCase() === "home" ? HomeIcon : MobileVanIcon} showDivider={true} />
                            <CheckoutRow title={'Raj M'} subtitle={'Preferred Groomer'} icon={serviceType.toLowerCase() === "home" ? HomeIcon : MobileVanIcon} showDivider={true} />
                            <CheckoutRow title={'Raj M'} subtitle={'Requested Time'} icon={Calendar} showDivider={true} />
                            <CheckoutRow title={petNamesText} subtitle={'Pets to be Groomed'} icon={PawIcon} showDivider={true} />
                        </Card>

                        <Card title="Payment Method">
                            {paymentMethods.map((method, i) => (
                                <PaymentMethodRow
                                    key={method.id}
                                    {...method}
                                    isNew={method.type === "new"}
                                    selected={
                                        selectedPayment.billing_id === method.billing_id &&
                                        selectedPayment.type === method.type
                                    }
                                    showDivider={i !== paymentMethods.length - 1}
                                    onSelect={() =>
                                        method.type === "new"
                                            ? navigate("/add-card")
                                            : setSelectedPayment({
                                                billing_id: method.billing_id,
                                                type: method.type,
                                            })
                                    }
                                />
                            ))}
                        </Card>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col gap-4 w-full lg:w-1/2">
                        <CustomInput
                            label="Enter Promo/Referral Code"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <button className="px-3 h-10 rounded-[10px] bg-primary-dark text-white text-sm font-bold">
                                        Apply
                                    </button>
                                ),
                            }}
                        />
                        <div className='md:block hidden'>
                            <Card title="Recurring Services">
                                <div className="flex justify-between mt-6">
                                    <span>Gold Package</span>
                                    <span>$130</span>
                                </div>

                                {ADD_ONS.length > 0 && (
                                    <div className="mt-4 space-y-1">
                                        <p className="font-bold">Add-ons</p>
                                        {ADD_ONS.map((a, i) => (
                                            <div key={i} className="flex justify-between">
                                                <span>{a.title}</span>
                                                <span>{a.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Insurance */}
                                <div className="flex justify-between items-center mt-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base text-primary-dark">Tax & Safety Insurance</span>
                                        <img src={infoGrey} alt="Info" className="w-5 h-5 cursor-pointer" onClick={() => setOpenTaxModal(true)} />
                                    </div>
                                    <span className="text-base text-primary-dark">$36.14</span>
                                </div>

                                <div className="flex justify-between mt-4 bg-[#f2f2f2] p-3 rounded-[10px]">
                                    <span className="font-bold">Grand Total</span>
                                    <span className="font-bold text-xl">$500</span>
                                </div>
                            </Card>
                        </div>

                        <div className="block md:hidden">
                            <Accordion
                                expanded={openSummary}
                                onChange={() => setOpenSummary(prev => !prev)}
                                disableGutters
                                elevation={0}
                                sx={{
                                    background: "transparent",
                                    "&:before": { display: "none" },
                                    "& .MuiAccordionSummary-root": { padding: 0 },
                                    "& .MuiAccordionSummary-content": { margin: 0 },
                                    "& .MuiAccordionDetails-root": { padding: 0 },
                                }}
                            >
                                {/* SUMMARY */}
                                <AccordionSummary>
                                    <div className="flex p-[15px] bg-white rounded-t-[15px] w-full items-center justify-between">
                                        <div className='flex flex-col'>
                                            <h2 className="text-sm text-primary-dark">
                                                Total - <span className='font-bold '>$500</span>
                                            </h2>
                                            <span className="font-inter text-[10px] text-primary-dark">
                                                Fees & Taxes are Included
                                            </span>
                                        </div>

                                        <div className='flex items-center gap-1'>
                                            <h2 className="text-sm text-[#3064A3]">
                                                View Breakdown
                                            </h2>
                                            <ChevronDown
                                                size={22}
                                                className={`text-[#3064A3] transition-transform duration-300 ${openSummary ? "rotate-180" : ""
                                                    }`}
                                            />
                                        </div>
                                    </div>
                                </AccordionSummary>

                                {/* DETAILS */}
                                <AccordionDetails>
                                    <div className="bg-white rounded-b-[15px] overflow-hidden">
                                        <div className='px-[15px] pb-4'>
                                            {/* Package */}
                                            <div className="flex justify-between text-sm">
                                                <span>Gold Package</span>
                                                <span>$130</span>
                                            </div>

                                            {/* Add-ons */}
                                            {ADD_ONS.length > 0 && (
                                                <div className="mt-4 space-y-1 text-sm">
                                                    <p className="font-bold">Add-ons</p>
                                                    {ADD_ONS.map((a, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex justify-between"
                                                        >
                                                            <span>{a.title}</span>
                                                            <span>{a.price}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Insurance */}
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-primary-dark">
                                                        Tax & Safety Insurance
                                                    </span>
                                                    <img
                                                        src={infoGrey}
                                                        alt="Info"
                                                        className="w-5 h-5 cursor-pointer"
                                                        onClick={() => setOpenTaxModal(true)}
                                                    />
                                                </div>
                                                <span className="text-sm text-primary-dark">$36.14</span>
                                            </div>

                                            {/* Total */}
                                            <div className="flex justify-between mt-4 bg-[#f2f2f2] p-3 rounded-[10px]">
                                                <span className="font-bold">Grand Total</span>
                                                <span className="font-bold text-xl">$500</span>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        </div>

                        <div className="flex gap-2 items-start">
                            <Checkbox
                                disableRipple
                                disableFocusRipple
                                disableTouchRipple
                                sx={{
                                    padding: 0,
                                    color: '#7C868A',
                                    '&.Mui-checked': { color: '#FF314A', },
                                    '&:hover': { backgroundColor: 'transparent', },
                                    '&.Mui-focusVisible': { outline: 'none', },
                                }} />
                            <span className="font-inter font-normal text-sm leading-relaxed text-primary-dark"> By continuing, you agree to Groomit’s{" "} <a href="https://www.groomit.me/terms" target="_blank" rel="noopener noreferrer" className="text-[#3064A3] cursor-pointer underline" > Terms </a>{" "} (including binding arbitration and class-action waiver) <a href="https://groomit.me/terms-privacy" target="_blank" rel="noopener noreferrer" className="text-[#3064A3] cursor-pointer underline" > {" "} Privacy Policy{" "} </a> and{" "} <a href="https://groomit.me/terms-privacy#acceptable-use-of-policy" target="_blank" rel="noopener noreferrer" className="text-[#3064A3] cursor-pointer underline" > Acceptable Use Policy, </a>{" "} and consent to receive service, marketing, and promo texts. Reply STOP to opt out. </span> </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 w-full bg-white shadow-xl p-5">
                <div className="flex justify-center">
                    <button className="w-full max-w-[390px] h-[50px] bg-primary-dark text-white rounded-[10px] font-bold">
                        Complete Payment
                    </button>
                </div>
            </div>

            <TaxInsuranceModal
                open={openTaxModal}
                onClose={() => setOpenTaxModal(false)}
                Insurance="$36.14"
                Tax="$12.50"
            />
        </>
    );
};

export default Checkout;
