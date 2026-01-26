import React, { useState, useEffect, useMemo } from "react";
import { Modal, Box, IconButton, Radio } from "@mui/material";
import Close from "../../assets/icon/close.svg";

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

/* -------------------- constants -------------------- */

const FREQUENCIES = [
    { label: "4 Weeks", value: 4 },
    { label: "6 Weeks", value: 6, recommended: true },
    { label: "8 Weeks", value: 8 },
    { label: "12 Weeks", value: 12 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIMES = ["Morning", "Afternoon", "Evening"];

/* -------------------- helpers -------------------- */

const formatPrice = (price) => {
    if (price == null) return "";
    const value = String(price).trim();
    return value.startsWith("$") ? value : `$${value}`;
};

const getAppointmentCount = (frequency) => Number(frequency) || 0;

const getAnnualTotal = (price, frequency) => {
    return getAppointmentCount(frequency) * Number(price || 0);
};

/* -------------------- component -------------------- */

const RecurringModal = ({ open, onClose, onConfirm, packageData }) => {
    const [frequency, setFrequency] = useState(6);
    const [billing, setBilling] = useState("annual");
    const [day, setDay] = useState("Mon");
    const [time, setTime] = useState("Morning");

    const annualPrice = 97;

    const appointmentCount = useMemo(
        () => getAppointmentCount(frequency),
        [frequency]
    );

    const annualTotal = useMemo(
        () => getAnnualTotal(annualPrice, frequency),
        [annualPrice, frequency]
    );

    const resetState = () => {
        setFrequency(6);
        setBilling("annual");
        setDay("Mon");
        setTime("Morning");
    };

    useEffect(() => {
        if (!open) resetState();
    }, [open]);

    const selectedCard = "border-brand shadow-md font-bold";
    const unselectedCard = "border-primary-light";

    const BILLING_OPTIONS = [
        {
            key: "flexible",
            title: "Flexible",
            subtitle: "Pay Per Appointment",
            oldPrice: packageData?.closedPrice ?? 120,
            price: packageData?.price ?? 114,
        },
        {
            key: "annual",
            title: "Annual",
            subtitle: "Prepay for Year",
            oldPrice: packageData?.closedPrice ?? 120,
            price: annualPrice,
            note: `Total ${appointmentCount} appts – ${formatPrice(annualTotal)}`,
            benefits: [
                "Fully refundable annual plan",
                "Hassle-free cancellations anytime",
            ],
        },
    ];

    const handleConfirm = () => {
        onConfirm?.({
            frequency,
            billing,
            preferredDay: day,
            preferredTime: time,
            annualTotal,
            perAppointment: annualPrice,
        });
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} className="relative font-inter">
                {/* Close */}
                <IconButton
                    onClick={handleClose}
                    className="!absolute !top-4 !right-4"
                    size="small"
                >
                    <img src={Close} alt="close" className="w-6 h-6" />
                </IconButton>

                {/* Header */}
                <div className="space-y-2">
                    <h2 className="text-xl font-bold">Groomit Recurring</h2>

                    {packageData && (
                        <div className="text-sm font-bold">
                            {packageData.title} · {packageData.name}
                        </div>
                    )}

                    <p className="text-sm">
                        Keeps your pet’s grooming on autopilot.
                        <br />
                        Scheduled, paid, and cared for without the hassle.
                    </p>
                </div>

                {/* Frequency */}
                <section className="mt-3 space-y-2">
                    <h3 className="font-bold">Grooming Frequency</h3>

                    <div className="grid grid-cols-2 gap-2">
                        {FREQUENCIES.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setFrequency(f.value)}
                                className={`h-[45px] rounded-[10px] border flex flex-col justify-center items-center transition
                                    ${frequency === f.value ? selectedCard : unselectedCard}`}
                            >
                                <span className="text-sm">{f.label}</span>
                                {f.recommended && (
                                    <span className="text-[10px]">
                                        Recommended
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Billing */}
                <section className="mt-5 space-y-3">
                    <h3 className="font-bold">Billing Type</h3>

                    {BILLING_OPTIONS.map((b) => (
                        <button
                            key={b.key}
                            onClick={() => setBilling(b.key)}
                            className={`w-full rounded-[10px] border p-[15px] transition
                                ${billing === b.key ? selectedCard : "border-primary-line"}`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2 text-left">
                                    <div className="font-bold">
                                        {b.title}{" "}
                                        <span className="font-normal">
                                            – {b.subtitle}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="line-through text-primary-light">
                                            {formatPrice(b.oldPrice)}
                                        </span>{" "}
                                        <span className="font-bold">
                                            {formatPrice(b.price)}
                                        </span>
                                        <span className="text-sm"> /Appt.</span>
                                    </div>

                                    {b.note && (
                                        <div className="text-xs">{b.note}</div>
                                    )}
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

                            {b.benefits && (
                                <ul className="list-disc pl-6 mt-3 text-xs space-y-1 text-start">
                                    {b.benefits.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </button>
                    ))}
                </section>

                {/* Preferred Day */}
                <section className="mt-5 space-y-1">
                    <h3 className="font-bold">Preferred Day</h3>
                    <p className="text-sm">
                        We’ll auto-schedule — you can change anytime.
                    </p>

                    <div className="flex gap-2 pt-2 flex-wrap">
                        {DAYS.map((d) => (
                            <button
                                key={d}
                                onClick={() => setDay(d)}
                                className={`px-[10px] py-3 rounded-[10px] border uppercase text-sm transition
                                    ${day === d ? selectedCard : unselectedCard}`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Preferred Time */}
                <section className="mt-5 space-y-2">
                    <h3 className="font-bold">Preferred Time</h3>

                    <div className="flex gap-2">
                        {TIMES.map((t) => (
                            <button
                                key={t}
                                onClick={() => setTime(t)}
                                className={`w-full py-3 rounded-[10px] border transition
                                    ${time === t ? selectedCard : unselectedCard}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Info Box */}
                <div className="mt-6 bg-[#F2F2F2] rounded-[10px] p-[15px]">
                    <h4 className="text-sm font-bold">Made Easy For You</h4>
                    <ul className="list-disc pl-6 mt-2 text-xs space-y-1">
                        <li>Fully refundable plans</li>
                        <li>Hassle-free cancellations</li>
                        <li>Change, skip, or pause anytime</li>
                    </ul>
                </div>

                {/* Footer */}
                <Box className="flex gap-2 w-full mt-6">
                    <button
                        onClick={handleConfirm}
                        className="bg-primary-dark text-white font-bold rounded-[10px] h-[50px] w-full"
                    >
                        Next
                    </button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RecurringModal;
