import React, { useState, useEffect, useMemo } from "react";
import { Modal, Box, IconButton, Radio } from "@mui/material";
import Close from "../../assets/icon/close.svg";

import Gift from "../../assets/icon/gift-yellow.svg"
import Info from "../../assets/icon/info-circle-white.svg"
import FICollarModal from "./FICollarModal";
import { useDispatch, useSelector } from "react-redux";
import { updatePetStepData } from "@/utils/store/slices/booking-flow/bookingFlowSlice";
import { resolveRecurringPrice } from "@/common/helpers";

const InfoSection = ({ items = [] }) => (
    <div className="w-full flex mt-3">
        <ul className={`list-disc pl-6 space-y-1 text-primary-dark w-full text-xs font-medium`}>
            {items.map((item, i) => (
                <li
                    key={i}
                    className={"text-primary-light"}
                >
                    {item.label}
                </li>
            ))}
        </ul>
    </div>
)

/* -------------------- styles -------------------- */

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    borderRadius: "20px",
    boxShadow: "0 50px 100px rgba(0,0,0,0.1)",
    p: "20px 20px 30px",
    width: "90%",
    maxWidth: 500,
    maxHeight: 600,
    overflowY: "auto",
    outline: "none",
};

/* -------------------- helpers -------------------- */

const formatPrice = (price) => `$${Number(price || 0)}`;

/* -------------------- component -------------------- */

const RecurringModal = ({ open, onClose, onConfirm, packageData }) => {
    const dispatch = useDispatch();
    const [collarModal, setCollarModal] = useState(false)

    const { currentPetIndex, petsDraft, serviceType } = useSelector(
        (state) => state.bookingFlow
    );

    const pkgDraft =
        petsDraft?.[currentPetIndex]?.stepData?.package || {};

    const recurringConfig = pkgDraft.recurringConfig || {};

    const intervals = packageData?.recurringIntervalsWithPrices || [];

    const flexibleIntervals = intervals.filter(i => i.type === "flexible");
    const annualIntervals = intervals.filter(i => i.type === "annual");

    const getDefaultInterval = (intervals) =>
        intervals.find(i => String(i.weeks) === "4") ||
        intervals.find(i => i.recommended === "1") ||
        intervals[0];

    const selectedInterval = useMemo(() => {
        if (!intervals.length) return null;

        return (
            intervals.find(i => i.id === recurringConfig.intervalId) ||
            getDefaultInterval(intervals)
        );
    }, [intervals, recurringConfig.intervalId]);

    const billing = recurringConfig.billing || selectedInterval?.type || "flexible";
    const day = recurringConfig.preferredDay;
    const time = recurringConfig.preferredTime;

    const availableIntervals =
        billing === "annual" ? annualIntervals : flexibleIntervals;

    // const annualTotal =
    //     selectedInterval?.packageTotalAppointmentsPriceWithMobileVanFee;

    const annualTotal = resolveRecurringPrice(
        serviceType,
        selectedInterval,
        "packageTotalAppointmentsPrice"
    );

    const selectedCard = "border-brand shadow-md font-bold";
    const unselectedCard = "border-primary-light";

    const BILLING_OPTIONS = [
        {
            key: "flexible",
            title: "Flexible",
            subtitle: "Pay Per Appointment",
            // priceRange: formatPrice(packageData?.recurringPriceMaxWithMobileVanFee),
            // priceDiscount: formatPrice(packageData?.priceWithMobileVanFee),

            priceRange: formatPrice(
                serviceType === "mobile-van"
                    ? packageData?.recurringPriceMaxWithMobileVanFee
                    : packageData?.recurringPriceMax
            ),
            priceDiscount: formatPrice(
                serviceType === "mobile-van"
                    ? packageData?.priceWithMobileVanFee
                    : packageData?.price
            ),
        },
        {
            key: "annual",
            title: "Annual",
            subtitle: "Prepay for Year",
            // priceRange: formatPrice(packageData?.recurringPriceMinWithMobileVanFee),
            // priceDiscount: formatPrice(packageData?.priceWithMobileVanFee),

            priceRange: formatPrice(
                serviceType === "mobile-van"
                    ? packageData?.recurringPriceMinWithMobileVanFee
                    : packageData?.recurringPriceMin
            ),
            priceDiscount: formatPrice(
                serviceType === "mobile-van"
                    ? packageData?.priceWithMobileVanFee
                    : packageData?.price
            ),
        },
    ];

    /* ---------------- Redux updater ---------------- */

    const updateRecurringConfig = (updates) => {
        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: "package",
                data: {
                    ...pkgDraft,
                    pricingType: "recurring",
                    recurringConfig: {
                        ...recurringConfig,
                        ...updates,
                    },
                },
            })
        );
    };

    /* ---------------- confirm ---------------- */

    // const handleConfirm = () => {
    //     if (selectedInterval.weeks) {

    //     }
    //     onConfirm?.({
    //         intervalId: selectedInterval.id,
    //         billing,
    //         weeks: selectedInterval.weeks,
    //         days: selectedInterval.days,
    //         totalAppointments: selectedInterval.total_appointments,
    //         perAppointment: selectedInterval.packagePriceWithMobileVanFee,
    //         annualTotal,
    //         safetyInsuranceFee: selectedInterval.safetyInsuranceFee,
    //         preferredDay: day,
    //         preferredTime: time,
    //     });
    // };

    const handleConfirm = () => {
        if (!selectedInterval) return;

        onConfirm?.({
            intervalId: selectedInterval.id,
            billing,
            weeks: selectedInterval.weeks,
            days: selectedInterval.days,
            totalAppointments: selectedInterval.total_appointments,
            perAppointment: resolveRecurringPrice(
                serviceType,
                selectedInterval,
                "packagePrice"
            ),
            annualTotal,
            safetyInsuranceFee: selectedInterval.safetyInsuranceFee,
            preferredDay: day,
            preferredTime: time,
        });
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle} className="relative font-inter">
                    {/* Close */}
                    <IconButton
                        onClick={() => {
                            // If user already applied recurring earlier → just close
                            if (pkgDraft?.recurringConfig) {
                                onClose();
                                return;
                            }

                            // First-time open, user cancels → nothing committed
                            onClose();
                        }}
                        className="!absolute !top-4 !right-4"
                        size="small"
                    >
                        <img src={Close} alt="close" className="w-6 h-6" />
                    </IconButton>

                    {/* Header */}
                    <div className="mt-4">
                        <h2 className="text-xl font-bold">Save More with Recurring</h2>
                        <p className="text-sm">How most pet parents book.</p>
                    </div>

                    <div className="my-4 flex justify-between py-2 px-[15px] items-center rounded-[10px] bg-black">
                        <div className="flex gap-4 items-center">
                            <img src={Gift} alt="Gift" className="w-6 h-6" />
                            <div className="flex flex-col">
                                <div className="text-sm font-bold text-white">FREE Fi GPS Collar +</div>
                                <div className="text-sm font-bold text-white">6 Months of Membership</div>
                            </div>
                        </div>
                        <img
                            src={Info}
                            alt="Info"
                            className="w-5 h-5 cursor-pointer"
                            onClick={() => { onClose(); setCollarModal(true) }}
                        />
                    </div>

                    <InfoSection
                        items={[
                            { label: "Priority scheduling during peak seasons" },
                            { label: "Adjust skip, or remove your Recurring bookings anytime" },
                            { label: "Automatic reminders help you never miss an appointment" },
                        ]}
                    />

                    {/* Frequency */}
                    <section className="mt-4 space-y-2">
                        <h3 className="font-bold">Select Grooming Frequency</h3>

                        <div className="grid grid-cols-2 gap-2">
                            {availableIntervals.map((interval) => (
                                <button
                                    key={interval.id}
                                    onClick={() =>
                                        updateRecurringConfig({
                                            intervalId: interval.id,
                                            billing,
                                            weeks: interval.weeks,
                                            days: interval.days,
                                            totalAppointments: interval.total_appointments,
                                            // perAppointment: interval.packagePriceWithMobileVanFee,
                                            // annualTotal:
                                            //     interval.packageTotalAppointmentsPriceWithMobileVanFee,

                                            perAppointment: resolveRecurringPrice(
                                                serviceType,
                                                interval,
                                                "packagePrice"
                                            ),
                                            annualTotal: resolveRecurringPrice(
                                                serviceType,
                                                interval,
                                                "packageTotalAppointmentsPrice"
                                            ),
                                            safetyInsuranceFee: interval.safetyInsuranceFee,
                                        })
                                    }
                                    className={`h-[50px] rounded-[10px] border flex flex-col justify-center items-center
                                    ${selectedInterval?.id === interval.id
                                            ? selectedCard
                                            : unselectedCard}`}
                                >
                                    <span className="text-sm">{interval.label}</span>
                                    {interval.recommended === "1" && (
                                        <span className="text-[10px]">Recommended</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Billing */}
                    <section className="mt-5 space-y-3">
                        <h3 className="font-bold">Select Billing Type</h3>

                        <div className="flex w-full  gap-2">
                            {BILLING_OPTIONS.map((b) => (
                                <button
                                    key={b.key}
                                    onClick={() => {
                                        const targetIntervals =
                                            b.key === "annual" ? annualIntervals : flexibleIntervals;

                                        const validInterval =
                                            targetIntervals.find(i => i.id === recurringConfig.intervalId) ||
                                            getDefaultInterval(targetIntervals);

                                        updateRecurringConfig({
                                            billing: b.key,
                                            intervalId: validInterval.id,
                                            weeks: validInterval.weeks,
                                            days: validInterval.days,
                                            totalAppointments: validInterval.total_appointments,
                                            // perAppointment: validInterval.packagePriceWithMobileVanFee,
                                            // annualTotal:
                                            //     validInterval.packageTotalAppointmentsPriceWithMobileVanFee,

                                            perAppointment: resolveRecurringPrice(
                                                serviceType,
                                                validInterval,
                                                "packagePrice"
                                            ),
                                            annualTotal: resolveRecurringPrice(
                                                serviceType,
                                                validInterval,
                                                "packageTotalAppointmentsPrice"
                                            ),
                                            safetyInsuranceFee: validInterval.safetyInsuranceFee,
                                        });
                                    }}
                                    className={`w-full flex flex-col justify-between gap-8 items-start rounded-[10px] border p-[15px]
                                ${billing === b.key ? selectedCard : "border-[#BDC3C4]"}`}
                                >
                                    <div className="flex justify-between items-start w-full">
                                        <div className="text-left">
                                            <div className="font-bold text-base">
                                                {b.title}
                                            </div>
                                            <span className="font-normal text-sm">
                                                {b.subtitle}
                                            </span>
                                        </div>

                                        <Radio
                                            checked={billing === b.key}
                                            sx={{
                                                p: 0,
                                                color: "#7C868A",
                                                "&.Mui-checked": {
                                                    color: "#FF314A",
                                                },
                                            }}
                                        />
                                    </div>

                                    <div className="flex flex-col items-start gap-1">
                                        <div className="font-normal text-base">
                                            <span className="text-primary-light line-through pe-1 original_package_price_flexible">{b.priceDiscount} {""}</span>
                                            <b className="font-bold flexible_package_price">{b.priceRange} {""}</b>
                                            <span className="text-xs">/App</span>
                                        </div>

                                        {b.title === "Annual" && <h6 class="font-normal text-xs">Total {""}
                                            <span>{selectedInterval?.weeks}</span> appts | <span>${annualTotal}</span></h6>}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Preferred Day */}
                    <section className="mt-5 pb-5">
                        <h3 className="font-bold text-base">Select preferred Day & Time for future bookings</h3>
                        <div className="font-normal text-xs mt-1">We'll auto-schedule your visits - you can change or skip anytime.</div>
                        <div className="flex gap-2 flex-wrap mt-3">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                                <button
                                    key={d}
                                    onClick={() =>
                                        updateRecurringConfig({ preferredDay: d })
                                    }
                                    className={`px-3 py-2 rounded-[10px] border
                                    ${day === d ? selectedCard : unselectedCard}`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Preferred Time */}
                    <section className="py-5 border-t border-primary-line">
                        <div className="flex gap-2">
                            {["Morning", "Afternoon", "Evening"].map(t => (
                                <button
                                    key={t}
                                    onClick={() =>
                                        updateRecurringConfig({ preferredTime: t })
                                    }
                                    className={`w-full py-3 rounded-[10px] border
                                    ${time === t ? selectedCard : unselectedCard}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Footer */}
                    <Box className="mt-1">
                        <button
                            onClick={handleConfirm}
                            className="bg-primary-dark text-white font-bold rounded-[10px] h-[50px] w-full"
                        >
                            Next
                        </button>
                    </Box>
                </Box>
            </Modal>

            <FICollarModal
                open={collarModal}
                onClose={() => { setCollarModal(false) }}
            />
        </>
    );
};

export default RecurringModal;
