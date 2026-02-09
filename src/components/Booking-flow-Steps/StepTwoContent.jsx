import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { ChevronRight } from 'lucide-react';

import Card from '@/common/Booking-Flow/Card';
import {
    updatePetStepData,
    updateTotalPrice,
} from '@/utils/store/slices/booking-flow/bookingFlowSlice';

import Gold from '../../assets/package/Gold-package-booking.svg';
import Eco from '../../assets/package/eco-package-booking.svg';
import Silver from '../../assets/package/silver-package-booking.svg';
import SuccessIcon from '../../assets/icon/tick-green.svg';

import FICollarModal from '../Modals/FICollarModal';
import RecurringModal from '../Modals/RecurringModal';
import { resolvePriceByServiceType } from '@/common/helpers';

/* -------------------- Helpers -------------------- */

const CustomTabPanel = ({ children, value, index }) => {
    if (value !== index) return null;
    return <Box className="pt-1">{children}</Box>;
};

const tabs = [
    { label: 'Haircut & Bath' },
    { label: 'Luxury Bath' },
];

const PACKAGE_META = {
    gold: { label: 'Premium | Gold', icon: Gold },
    eco: { label: 'Standard | Eco', icon: Eco },
    silver: { label: 'Premium | Silver - No Haircut', icon: Silver },
    pearl: { label: 'Essential | Pearl - No Haircut', icon: Eco },
};

/* -------------------- Package Card -------------------- */

const PackageCard = ({
    data,
    show,
    serviceType,
    isOneTimeSelected,
    isRecurringSelected,
    error,
    onSelectOneTime,
    onSelectRecurring,
}) => {
    const meta = PACKAGE_META[data.productType] || {};
    const Icon = meta.icon;

    return (
        <div
            className={`flex flex-col gap-3 rounded-[10px] bg-white p-[15px]
      ${error ? 'border border-brand' : 'border border-primary-line'}`}
        >
            {/* Header */}
            <div className="flex gap-2 items-center">
                <img src={Icon} alt={data.title} className="w-[40px] h-[40px]" />
                <div>
                    <div className="text-base font-bold">
                        {meta.label ?? data.title}
                    </div>
                    <div className="text-xs">{data.subtitle}</div>
                </div>
            </div>

            {/* Services */}
            <ul className="pl-6 text-sm font-medium flex flex-wrap">
                {data?.includes?.services?.map((service, i) => {
                    const isExcluded =
                        data?.includes?.excludes?.includes(service);

                    return (
                        <li
                            key={i}
                            className={`w-1/2 mt-1 list-disc text-primary-light
                ${isExcluded ? 'line-through' : ''}
              `}
                        >
                            {service}
                        </li>
                    );
                })}
            </ul>

            {/* Pricing */}
            <div className="flex gap-2 mt-2">
                {/* One Time */}
                {data.price && (
                    <div
                        onClick={onSelectOneTime}
                        className={`w-full ${show ? 'h-[45px]' : 'h-[30px]'} rounded-[10px] border
            flex flex-col items-center justify-center cursor-pointer
            ${isOneTimeSelected ? 'border-brand' : 'border-primary-line'}`}
                    >
                        <div className="text-sm">{`$${serviceType === 'mobile-van' ? data?.priceWithMobileVanFee : data?.price}`}</div>
                        {show && <div className="text-xs">One Time</div>}
                    </div>
                )}

                {/* Recurring */}
                {data.allowRecurring && (
                    <div
                        onClick={onSelectRecurring}
                        className={`w-full ${show ? 'h-[45px]' : 'h-[30px]'} rounded-[10px] border
            flex items-center justify-between px-3 cursor-pointer
            ${isRecurringSelected ? 'border-brand' : 'border-primary-line'}`}
                    >
                        <div className="text-center w-full">
                            <div className="text-sm">
                                ${serviceType === 'mobile-van' ? data.recurringPriceMinWithMobileVanFee : data.recurringPriceMin} – ${serviceType === 'mobile-van' ? data.recurringPriceMaxWithMobileVanFee : data.recurringPriceMax}
                            </div>
                            {show && <div className="text-xs">Recurring</div>}
                        </div>
                        <ChevronRight size={28} className="text-primary-light" />
                    </div>
                )}
            </div>
        </div>
    );
};

/* -------------------- Main Component -------------------- */

const StepTwoContent = ({ showSuccess, setPackageError, packageError }) => {
    const dispatch = useDispatch();
    const { currentPetIndex, packageDetails, petsDraft, serviceType } = useSelector(
        (state) => state.bookingFlow
    );

    const savedPackage = petsDraft?.[currentPetIndex]?.stepData?.package || {};

    const isRecurringApplied =
        savedPackage?.pricingType === 'recurring' &&
        !!savedPackage?.recurringConfig;

    const isOneTimeApplied =
        savedPackage?.pricingType === 'one-time';


    const { packages } = packageDetails || {};

    const [activeTab, setActiveTab] = useState(0);
    const [recurringPackage, setRecurringPackage] = useState(null);
    const [recurringModal, setRecurringModal] = useState(false);
    const [collarModal, setCollarModal] = useState(false);

    const tabZeroPackages = ['gold', 'eco']
        .map((key) => packages?.[key])
        .filter(Boolean);

    const tabOnePackages = ['silver', 'pearl']
        .map((key) => packages?.[key])
        .filter(Boolean);

    /* -------------------- Handlers -------------------- */

    // const handleOneTimeSelect = (pkg) => {
    //     setRecurringPackage(null);
    //     setRecurringModal(false);
    //     setPackageError('');

    //     const TAX_RATE = 0.0887;

    //     const price = Number(pkg.price || 0);
    //     const insuranceFee = Number(pkg.safetyInsuranceFee || 0);

    //     const subTotal = price + insuranceFee;
    //     const taxAmount = subTotal * TAX_RATE;
    //     const totalWithTax = Number((subTotal + taxAmount).toFixed(2));

    //     dispatch(
    //         updatePetStepData({
    //             petIndex: currentPetIndex,
    //             step: 'package',
    //             data: {
    //                 id: pkg.productId,
    //                 packageTitle: pkg?.title,
    //                 service: pkg?.service,
    //                 productType: pkg.productType,
    //                 pricingType: 'one-time',
    //                 price: pkg.price,
    //                 safetyInsuranceFee: insuranceFee,
    //                 taxAmount: Number(taxAmount.toFixed(2)),
    //                 totalWithTax,
    //                 disabledCoatType: pkg?.disabledCoatType,
    //                 disabledCoatTypeMessage: pkg?.disabledCoatTypeMessage,
    //                 recurringConfig: null, // explicitly cleared
    //             },
    //         })
    //     );

    //     dispatch(updateTotalPrice({ petIndex: currentPetIndex }));
    // };

    const handleOneTimeSelect = (pkg) => {
        setRecurringPackage(null);
        setRecurringModal(false);
        setPackageError('');

        // const price = resolvePriceByServiceType(
        //     serviceType,
        //     pkg.price,
        //     pkg.priceWithMobileVanFee
        // );

        const insuranceFee = Number(pkg.safetyInsuranceFee || 0);

        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: 'package',
                data: {
                    id: pkg.productId,
                    packageTitle: pkg.title,
                    service: pkg.service,
                    productType: pkg.productType,
                    pricingType: 'one-time',
                    mobileVanFee: serviceType === "mobile-van" ? pkg?.mobileVanFee : 0,
                    price: pkg?.price,
                    priceWithMobileVanFee: pkg?.priceWithMobileVanFee,
                    safetyInsuranceFee: insuranceFee,
                    disabledCoatType: pkg?.disabledCoatType,
                    disabledCoatTypeMessage: pkg?.disabledCoatTypeMessage,
                    recurringConfig: null,
                },
            })
        );

        dispatch(updateTotalPrice({ petIndex: currentPetIndex }));
    };

    const handleRecurringSelect = (pkg) => {
        setRecurringPackage(pkg);
        setRecurringModal(true);
    };

    // const handleRecurringSubmit = (recurringData) => {
    //     if (!recurringPackage) return;

    //     const TAX_RATE = 0.0887;

    //     const baseAmount =
    //         recurringData.billing === 'annual'
    //             ? recurringData.annualTotal
    //             : recurringData.perAppointment;

    //     const insuranceFee = Number(recurringPackage.safetyInsuranceFee || 0);

    //     const subTotal = Number(baseAmount) + insuranceFee;
    //     const taxAmount = Number((subTotal * TAX_RATE).toFixed(2));
    //     const totalWithTax = Number((subTotal + taxAmount).toFixed(2));

    //     dispatch(
    //         updatePetStepData({
    //             petIndex: currentPetIndex,
    //             step: 'package',
    //             data: {
    //                 id: recurringPackage.productId,
    //                 packageTitle: recurringPackage?.title,
    //                 service: recurringPackage?.service,
    //                 productType: recurringPackage.productType,
    //                 pricingType: 'recurring',
    //                 safetyInsuranceFee: insuranceFee,
    //                 taxAmount,
    //                 totalWithTax,
    //                 disabledCoatType: recurringData?.disabledCoatType,
    //                 disabledCoatTypeMessage: recurringData?.disabledCoatTypeMessage,
    //                 recurringConfig: {
    //                     ...recurringData,
    //                     subTotal,
    //                 },
    //             },
    //         })
    //     );

    //     dispatch(updateTotalPrice({ petIndex: currentPetIndex }));
    //     setRecurringModal(false);
    // };

    const handleRecurringSubmit = (recurringData) => {
        if (!recurringPackage || !recurringData) return;

        const baseAmount =
            recurringData.billing === "annual"
                ? Number(recurringData.annualTotal || 0)
                : Number(recurringData.perAppointment || 0);

        const insuranceFee = Number(recurringData.recurringSafetyInsuranceFee || 0);

        const price = Number((baseAmount + insuranceFee).toFixed(2));

        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: "package",
                data: {
                    id: recurringPackage.productId,
                    packageTitle: recurringPackage?.title,
                    service: recurringPackage?.service,
                    productType: recurringPackage.productType,
                    pricingType: "recurring",

                    // same pattern as one-time
                    price,
                    safetyInsuranceFee: insuranceFee,

                    disabledCoatType: recurringData?.disabledCoatType,
                    disabledCoatTypeMessage:
                        recurringData?.disabledCoatTypeMessage,

                    recurringConfig: {
                        ...recurringData,
                        baseAmount,
                    },
                },
            })
        );

        dispatch(updateTotalPrice({ petIndex: currentPetIndex }));
        setRecurringModal(false);
    };

    useEffect(() => {
        if (!savedPackage?.id) return;

        const pkg =
            packages?.[savedPackage.productType] ?? null;

        if (!pkg) return;
    }, [savedPackage, packages]);

    useEffect(() => {
        if (savedPackage?.productType === "silver" || savedPackage?.productType === "pearl") {
            setActiveTab(1)
        }
    }, [savedPackage])

    /* -------------------- Render -------------------- */

    return (
        <>
            <Card
                title="Select Package"
                action={
                    showSuccess && (
                        <img src={SuccessIcon} alt="Success" className="w-6 h-6" />
                    )
                }
            >
                {/* Tabs */}
                <div className="flex w-full pt-2">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`w-1/2 h-[41px] text-sm
              ${activeTab === index
                                    ? 'bg-primary-dark text-white font-bold'
                                    : 'bg-[#F2F2F2] text-primary-dark border border-primary-line'}`}
                            style={{
                                borderRadius:
                                    index === 0 ? '10px 0 0 10px' : '0 10px 10px 0',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Panels */}
                <CustomTabPanel value={activeTab} index={0}>
                    <div className="space-y-3 px-1 mt-3">
                        {tabZeroPackages.map((pkg) => (
                            <PackageCard
                                key={pkg.productId}
                                data={pkg}
                                serviceType={serviceType}
                                show={petsDraft?.[currentPetIndex]?.stepData?.details?.type === 'dog'}
                                error={packageError}
                                isOneTimeSelected={
                                    isOneTimeApplied &&
                                    savedPackage?.productType === pkg.productType
                                }
                                isRecurringSelected={
                                    isRecurringApplied &&
                                    savedPackage?.productType === pkg.productType
                                }
                                onSelectOneTime={() => handleOneTimeSelect(pkg)}
                                onSelectRecurring={() => handleRecurringSelect(pkg)}
                            />
                        ))}
                    </div>
                </CustomTabPanel>

                <CustomTabPanel value={activeTab} index={1}>
                    <div className="space-y-3 px-1 mt-3">
                        {tabOnePackages.map((pkg) => (
                            <PackageCard
                                key={pkg.productId}
                                data={pkg}
                                serviceType={serviceType}
                                show={petsDraft?.[currentPetIndex]?.stepData?.details?.type === 'dog'}
                                error={packageError}
                                isOneTimeSelected={
                                    isOneTimeApplied &&
                                    savedPackage?.productType === pkg.productType
                                }
                                isRecurringSelected={
                                    isRecurringApplied &&
                                    savedPackage?.productType === pkg.productType
                                }
                                onSelectOneTime={() => handleOneTimeSelect(pkg)}
                                onSelectRecurring={() => handleRecurringSelect(pkg)}
                            />
                        ))}
                    </div>
                </CustomTabPanel>
            </Card>

            {/* Footer */}
            <div
                className="fixed bottom-0 left-0 w-full bg-white z-10"
                style={{
                    boxShadow: '0 0 30px rgba(0,0,0,0.10)',
                    padding: '15px 20px 25px',
                }}
            >
                <div className="flex justify-center">
                    <button className="w-[390px] h-[50px] rounded-[10px] font-bold text-white bg-primary-dark">
                        Next
                    </button>
                </div>
            </div>

            {/* Modals */}
            <FICollarModal open={collarModal} onClose={() => setCollarModal(false)} />

            <RecurringModal
                open={recurringModal}
                onClose={() => setRecurringModal(false)}
                packageData={recurringPackage}
                onConfirm={handleRecurringSubmit}
            />
        </>
    );
};

export default StepTwoContent;
