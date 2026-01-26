import Card from '@/common/Booking-Flow/Card'
import { useLoader } from '@/contexts/loaderContext/LoaderContext'
import { Box, Radio } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Gold from "../../assets/package/Gold-package-booking.svg"
import Eco from "../../assets/package/eco-package-booking.svg"
import Silver from "../../assets/package/silver-package-booking.svg"
import Gift from "../../assets/icon/gift.svg"
import Info from "../../assets/icon/info-circle-black.svg"
import SuccessIcon from "../../assets/icon/tick-green.svg";

import FICollarModal from '../Modals/FICollarModal'
import RecurringModal from '../Modals/RecurringModal'
import { updatePetStepData, updateTotalPrice } from '@/utils/store/slices/booking-flow/bookingFlowSlice'

/* -------------------- Helpers -------------------- */

const CustomTabPanel = ({ children, value, index }) => {
    if (value !== index) return null
    return <Box className="pt-1">{children}</Box>
}

/* -------------------- Data -------------------- */

const PACKAGES = {
    oneTime: [
        {
            id: "gold-onetime",
            type: "one-time",
            title: "Haircut & Bath",
            name: "Gold",
            quality: "Premium",
            price: "$120",
            icon: Gold,
        },
        {
            id: "eco-onetime",
            type: "one-time",
            title: "Haircut & Bath",
            name: "Eco",
            quality: "Standard",
            price: "$100",
            icon: Eco,
        },
        {
            id: "silver-onetime",
            type: "one-time",
            title: "Bath Only",
            name: "Silver",
            quality: "Premium",
            price: "$55",
            icon: Silver,
        },
    ],
    recurring: [
        {
            id: "gold-recurring",
            type: "recurring",
            title: "Haircut & Bath",
            name: "Gold",
            quality: "Premium",
            price: "$97-$114",
            closedPrice: "$120",
            icon: Gold,
        },
        {
            id: "silver-recurring",
            type: "recurring",
            title: "Bath Only",
            name: "Silver",
            quality: "Premium",
            price: "$30-$45",
            closedPrice: "$55",
            icon: Silver,
        },
    ],
}

const InfoSection = ({ index, items = [], items2 = [] }) => (
    <div className="w-full flex">
        <ul className={`list-disc pl-6 space-y-1 text-primary-dark ${index ? "w-full text-xs font-medium" : "w-1/2 text-sm"}`}>
            {items.map((item, i) => (
                <li
                    key={i}
                    className={item.disabled ? "line-through text-primary-light" : ""}
                >
                    {item.label}
                </li>
            ))}
        </ul>

        {!index && (
            <ul className="list-disc pl-6 space-y-1 text-sm text-primary-dark w-1/2">
                {items2.map((item, i) => (
                    <li
                        key={i}
                        className={item.disabled ? "line-through text-primary-light" : ""}
                    >
                        {item.label}
                    </li>
                ))}
            </ul>
        )}
    </div>
)

/* -------------------- Package Card -------------------- */

const PackageCard = ({ data, selected, onSelect }) => (
    <div
        onClick={() => onSelect(data)}
        className="flex flex-col gap-4 rounded-[10px] border border-primary-line bg-white p-[15px] cursor-pointer"
    >
        <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
                <Radio
                    checked={selected}
                    sx={{
                        p: 0,
                        color: "#7C868A",
                        "&.Mui-checked": { color: "#FF314A" },
                    }}
                />

                <div className="flex gap-2 items-center">
                    <img
                        src={data.icon}
                        alt={`${data.name} Package`}
                        className="w-[40px] h-[40px] rounded-lg"
                    />
                    <div className="flex flex-col gap-1">
                        <div className="text-base font-bold">{data.title}</div>
                        <div className="text-sm font-bold">
                            {data.name} <span className="font-normal">| {data.quality}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col text-right">
                <div className={`${data.closedPrice ? 'text-sm text-primary-light line-through' : 'text-[10px]'}`}>
                    {data.closedPrice || 'Starting at'}
                </div>
                <div className="text-base font-bold">{data.price}</div>
            </div>
        </div>

        <InfoSection
            items={[
                { label: "Priority Availability", disabled: data.name === "Eco" },
                { label: "Same-Day Eligible", disabled: data.name === "Eco" },
                data.name !== "Silver" && { label: "Haircut" },
                { label: "Bath" },
                { label: "Nail Trim" },
            ].filter(Boolean)}
            items2={[
                { label: "Ear Cleaning" },
                { label: "Dry Brush Out" },
                { label: "Blow Dry" },
                data.name !== "Silver" && { label: "Sanitary trim" },
                { label: "Cologne", disabled: data.name === "Silver" },
            ].filter(Boolean)}
        />
    </div>
)

/* -------------------- Main Component -------------------- */

const StepTwoContent = ({ showSuccess }) => {
    const dispatch = useDispatch();
    const { showLoader, hideLoader } = useLoader();

    const { petsDraft, currentPetIndex } = useSelector(
        (state) => state.bookingFlow
    );

    const savedPackage = petsDraft?.[currentPetIndex]?.stepData?.package || {};

    const [activeTab, setActiveTab] = useState(0);
    const [recurringPackage, setRecurringPackage] = useState(null)
    const [collarModal, setCollarModal] = useState(false)
    const [recurringModal, setRecurringModal] = useState(false)

    const tabs = [
        { label: 'One-Time' },
        { label: 'Recurring | Save $$' },
    ]

    /* ---------------- Restore Tab ---------------- */
    useEffect(() => {
        if (savedPackage?.type === "recurring") {
            setActiveTab(1)
        }
    }, [savedPackage])

    /* ---------------- Select Package ---------------- */
    const handlePackageSelect = (pkg) => {
        console.log(pkg);

        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: "package",
                data: pkg,
            })
        );

        if (pkg.type === "recurring") {
            setRecurringPackage(pkg);
            setRecurringModal(true);
        } else {
            dispatch(updateTotalPrice({ petIndex: currentPetIndex }));
        }
    };

    const handleModalSubmit = (recurringData) => {
        if (!recurringPackage) return;

        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: "package",
                data: {
                    ...recurringPackage,
                    recurringConfig: {
                        frequency: recurringData.frequency,
                        billing: recurringData.billing,
                        preferredDay: recurringData.preferredDay,
                        preferredTime: recurringData.preferredTime,
                        annualTotal: recurringData.annualTotal,
                        perAppointment: recurringData.perAppointment,
                    },
                },
            })
        );

        dispatch(updateTotalPrice({ petIndex: currentPetIndex }));

        setRecurringModal(false);
    };

    return (
        <>
            <Card title="Select Package"
                action={showSuccess &&
                    <div
                        className="flex items-center gap-1 text-[#3064A3] cursor-pointer"
                    >
                        <img src={SuccessIcon} alt="Success" className="w-6 h-6 cursor-pointer" />
                    </div>
                }>
                <div className="w-full pt-2 space-y-3">

                    {/* Tabs */}
                    <div className="flex w-full">
                        {tabs.map((tab, index) => {
                            const isActive = activeTab === index
                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className={`w-1/2 h-[41px] text-sm transition-all
                    ${isActive
                                            ? 'bg-primary-dark text-white font-bold'
                                            : 'bg-white text-primary-dark border border-primary-line'}
                  `}
                                    style={{
                                        borderRadius: index === 0
                                            ? '10px 0 0 10px'
                                            : '0 10px 10px 0',
                                    }}
                                >
                                    {(tab.label === "Recurring | Save $$" && !isActive)
                                        ? <>Recurring | <span className="text-[#0A7170]">Save $$</span></>
                                        : tab.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* One-Time */}
                    <CustomTabPanel value={activeTab} index={0}>
                        <div className="px-1 text-xs mb-3">
                            Prices are based on the best-matched groomer in your area and may vary.
                        </div>

                        <div className="space-y-3 px-1">
                            {PACKAGES.oneTime.map(pkg => (
                                <PackageCard
                                    key={pkg.id}
                                    data={pkg}
                                    selected={savedPackage?.id === pkg.id}
                                    onSelect={handlePackageSelect}
                                />
                            ))}
                        </div>
                    </CustomTabPanel>

                    {/* Recurring */}
                    <CustomTabPanel value={activeTab} index={1}>
                        <div className="px-1 text-xs mb-3">
                            Prices are based on the best-matched groomer in your area and may vary by availability and travel distance.
                        </div>

                        <InfoSection
                            index={1}
                            items={[
                                { label: "Priority scheduling during peak seasons" },
                                { label: "Adjust skip, or remove your Recurring bookings anytime" },
                                { label: "Automatic reminders help you never miss an appointment" },
                            ]}
                        />

                        <div className="my-4 flex justify-between py-2 px-[15px] items-center rounded-[10px] border border-[#FFBF00] bg-[#FFFEDF]">
                            <div className="flex gap-2 items-center">
                                <img src={Gift} alt="Gift" className="w-6 h-6" />
                                <div className="flex flex-col">
                                    <div className="text-sm font-bold">FREE Fi GPS Collar +</div>
                                    <div className="text-sm font-bold">6 Months of Membership</div>
                                </div>
                            </div>
                            <img
                                src={Info}
                                alt="Info"
                                className="w-5 h-5 cursor-pointer"
                                onClick={() => setCollarModal(true)}
                            />
                        </div>

                        <div className="space-y-3 px-1">
                            {PACKAGES.recurring.map(pkg => (
                                <PackageCard
                                    key={pkg.id}
                                    data={pkg}
                                    selected={savedPackage?.id === pkg.id}
                                    onSelect={handlePackageSelect}
                                />
                            ))}
                        </div>
                    </CustomTabPanel>
                </div>
            </Card>

            {/* Footer */}
            <div
                className="fixed bottom-0 left-0 w-full bg-white z-10"
                style={{ boxShadow: "0 0 30px rgba(0,0,0,0.10)", padding: "15px 20px 25px" }}
            >
                <div className="flex justify-center">
                    <button
                        className="w-[390px] h-[50px] rounded-[10px] font-bold text-white bg-primary-dark"
                    >
                        Next
                    </button>
                </div>
            </div>

            <FICollarModal
                open={collarModal}
                onClose={() => setCollarModal(false)}
            />

            <RecurringModal
                open={recurringModal}
                onClose={() => setRecurringModal(false)}
                packageData={recurringPackage}
                onConfirm={handleModalSubmit}
            />
        </>
    )
}

export default StepTwoContent
