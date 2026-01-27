import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import TotalPriceModal from "@/components/Modals/TotalPriceModal";
import TaxInsuranceModal from "@/components/Modals/TaxInsuranceModal";
import SlotCard from "./SlotCard";
import { getGroomersList } from "@/utils/store/slices/groomersList/groomersListSlice";
import { useLoader } from "@/contexts/loaderContext/LoaderContext";
import { useDispatch, useSelector } from "react-redux";
import GroomerCard from "./GroomerCard";
import GroomerDropdownCard from "./GroomerDropdownCard";

const DAYS_TO_SHOW = 7;
const PAGE_SIZE = 2;

// Example holidays (day of month)
const HOLIDAYS = [27, 28];

const slideVariants = {
    enter: (direction) => ({
        x: direction === "next" ? 120 : -120,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction === "next" ? -120 : 120,
        opacity: 0,
    }),
};

const slotsData = [
    {
        date: "2026-03-06",
        slots: [
            "8:00am-9:00am",
            "9:00am-10:00am",
            "10:00am-11:00am",
            "11:00am-12:00pm",
            "12:00pm-1:00pm",
        ],
    },
    {
        date: "2026-03-07",
        slots: [
            "8:00am-9:00am",
            "9:00am-10:00am",
            "10:00am-11:00am",
            "11:00am-12:00pm",
        ],
    },
    {
        date: "2026-03-08",
        slots: [
            "8:00am-9:00am",
            "9:00am-10:00am",
        ],
    },
    {
        date: "2026-03-09",
        slots: [
            "10:00am-11:00am",
            "11:00am-12:00pm",
        ],
    },
];

const Slots = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { showLoader, hideLoader } = useLoader();
    const observerRef = React.useRef(null);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    // const groomers = useSelector((state) => state.groomers.groomers);

    // PAgination
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const [startDate, setStartDate] = useState(today);
    const [selectedDate, setSelectedDate] = useState(today);
    const [direction, setDirection] = useState("next");

    const [openPriceTotalModal, setOpenPriceTotalModal] = useState(false);
    const [openTaxModal, setOpenTaxModal] = useState(false);
    const [activeTab, setActiveTab] = useState(1);

    const tabs = [{ title: "Best Match", label: 'Most Booked' }, { title: "Choose Groomer" }];

    /* ---------------- Generate Calendar Dates ---------------- */
    const calendarDates = useMemo(() => {
        return Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            return d;
        });
    }, [startDate]);

    /* ---------------- Helpers ---------------- */
    const isPastDate = (date) => date < today;

    const isHoliday = (date) => HOLIDAYS.includes(date.getDate());

    const isDisabled = (date) => isPastDate(date) || isHoliday(date);

    const isPrevDisabled = useMemo(() => {
        const prevDate = new Date(startDate);
        prevDate.setDate(prevDate.getDate() - DAYS_TO_SHOW);
        return prevDate < today;
    }, [startDate, today]);

    const scrollToSlot = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    };

    const jumpCalendarToDate = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);

        // set selected date
        setSelectedDate(normalized);

        // check if date is outside current 7-day window
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + DAYS_TO_SHOW - 1);

        if (normalized < startDate || normalized > endDate) {
            const newStart = new Date(normalized);
            newStart.setDate(normalized.getDate() - (normalized.getDay() % DAYS_TO_SHOW));
            setDirection(normalized > startDate ? "next" : "prev");
            setStartDate(newStart);
        }
    };

    const visibleSlotsData = useMemo(() => {
        return slotsData.slice(0, page * PAGE_SIZE);
    }, [page]);

    const hasMore = visibleSlotsData.length < slotsData.length;

    const loadMoreData = () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);

        // simulate API delay
        setTimeout(() => {
            setPage((prev) => prev + 1);
            setLoadingMore(false);
        }, 1200);
    };

    const lastItemRef = React.useCallback(
        (node) => {
            if (loadingMore) return;

            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMoreData();
                }
            });

            if (node) observerRef.current.observe(node);
        },
        [loadingMore, hasMore]
    );

    /* ---------------- Handlers ---------------- */
    const handlePrevWeek = () => {
        if (isPrevDisabled) return;
        setDirection("prev");
        const d = new Date(startDate);
        d.setDate(d.getDate() - DAYS_TO_SHOW);
        setStartDate(d);
    };

    const handleNextWeek = () => {
        setDirection("next");
        const d = new Date(startDate);
        d.setDate(d.getDate() + DAYS_TO_SHOW);
        setStartDate(d);
    };

    const handleFooterAction = () => {
        if (!selectedSlot) return;
        console.log("Selected Slot:", selectedSlot);
        // navigate("/book/checkout", { state: selectedSlot });
    };

    const swipeConfidenceThreshold = 80;

    const handleDragEnd = (_, info) => {
        if (info.offset.x < -swipeConfidenceThreshold) {
            handleNextWeek();
        } else if (info.offset.x > swipeConfidenceThreshold) {
            handlePrevWeek();
        }
    };

    const handleSlotSelect = ({ date, slot, id }) => {
        setSelectedSlot({ date, slot, id });
        jumpCalendarToDate(date);
    };

    const handleChange = () => {
        setSelectedSlot(null);
        setSelectedDate(today);
        setActiveTab(1);
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             showLoader();

    //             await Promise.all([
    //                 dispatch(getGroomersList())
    //             ]);
    //         } catch (error) {
    //             console.error("Error fetching dashboard data:", error);
    //         } finally {
    //             hideLoader();
    //         }
    //     };

    //     fetchData();
    // }, [dispatch]);

    useEffect(() => {
        if (id) {
            setActiveTab(0);
        }
    }, [id])

    const groomers = [
        {
            id: 1,
            name: "Sandra D.",
            rating: 4.9,
            reviews: 147,
            price: 130,
            lastBooked: "03/20/25",
        },
        {
            id: 2,
            name: "Sandra D.",
            price: 130,
        },
    ];

    console.log(selectedDate, selectedSlot);


    return (
        <>
            {/* HEADER */}
            <div className="bg-white sticky top-0 z-20">
                <div className="border-b flex items-center px-6 py-3">
                    <ChevronLeft
                        size={24}
                        className="cursor-pointer text-primary-dark"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="flex-1 text-center font-bold text-xl">
                        Mobile Groomers & Schedule
                    </h1>
                </div>

                {/* TABS */}
                <div className="pt-4">
                    {/* TABS HEADER */}
                    <div className="border-b pb-4 px-6">
                        <div className="flex w-full max-w-md mx-auto">
                            {id ? (
                                <GroomerDropdownCard onChange={handleChange} />
                            ) : (
                                tabs.map((label, index) => {
                                    const isActive = index === activeTab;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setActiveTab(index);
                                                if (index === 1) {
                                                    setSelectedSlot(null);
                                                    jumpCalendarToDate(today);
                                                    setSelectedDate(today);
                                                }
                                            }}
                                            className={`w-1/2 py-2 flex flex-col justify-center items-center text-sm transition-all
            ${isActive
                                                    ? "bg-primary-dark text-white font-bold"
                                                    : "bg-[#F2F2F2] text-primary-dark border-[1.5px] border-primary-line"
                                                }`}
                                            style={{
                                                borderRadius:
                                                    index === 0
                                                        ? "10px 0 0 10px"
                                                        : "0 10px 10px 0",
                                            }}
                                        >
                                            <div>{label?.title}</div>
                                            {label?.label && (
                                                <div className="font-normal text-xs">{label.label}</div>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {!id && <p className="text-xs font-bold text-center mt-3">
                            {activeTab === 0 ? 'Sit back — Groomit finds your perfect match!' : 'Each groomer has unique pricing based on service & skill.'}
                        </p>}
                    </div>

                    {/* TABS BODY */}
                    <div>
                        {activeTab === 0 && (
                            <>
                                <div className="border-b px-6">
                                    <div className="py-4 max-w-md mx-auto">
                                        {/* Month Header */}
                                        <div className="flex items-center justify-between mb-2">
                                            <button
                                                className={`p-2 rounded-[10px] bg-primary-dark transition
                                    ${isPrevDisabled ? "opacity-40 cursor-not-allowed" : ""}
                                `}
                                                onClick={handlePrevWeek}
                                                disabled={isPrevDisabled}
                                            >
                                                <ChevronLeft size={21} className="text-white" />
                                            </button>

                                            <h2 className="text-lg font-bold">
                                                {startDate.toLocaleString("default", {
                                                    month: "long"
                                                })}
                                            </h2>

                                            <button
                                                className="p-2 rounded-[10px] bg-primary-dark"
                                                onClick={handleNextWeek}
                                            >
                                                <ChevronRight size={21} className="text-white" />
                                            </button>
                                        </div>

                                        {/* Horizontal Calendar */}
                                        <div className="overflow-hidden w-full pt-2">
                                            <AnimatePresence mode="wait" custom={direction}>
                                                <motion.div
                                                    key={startDate.toDateString()}
                                                    custom={direction}
                                                    variants={slideVariants}
                                                    initial="enter"
                                                    animate="center"
                                                    exit="exit"
                                                    transition={{
                                                        duration: 0.2,
                                                        ease: [0.25, 0.8, 0.25, 1],
                                                    }}
                                                    drag="x"
                                                    dragConstraints={{ left: 0, right: 0 }}
                                                    dragElastic={0.15}
                                                    onDragEnd={handleDragEnd}
                                                    className="flex justify-between cursor-grab active:cursor-grabbing"
                                                >
                                                    {calendarDates.map((date) => {
                                                        const disabled = isDisabled(date);

                                                        const isSelected =
                                                            !disabled &&
                                                            selectedDate.toDateString() === date.toDateString();

                                                        return (
                                                            <div
                                                                key={date.toISOString()}
                                                                className="flex flex-col items-center w-full"
                                                            >
                                                                {/* DATE BOX */}

                                                                <motion.button
                                                                    disabled={disabled}
                                                                    onClick={() => {
                                                                        if (!disabled) setSelectedDate(date);
                                                                    }}
                                                                    transition={{
                                                                        type: "spring",
                                                                        stiffness: 300,
                                                                        damping: 18,
                                                                    }}
                                                                    className={`w-[44px] h-[44px] rounded-[10px] border flex items-center justify-center bg-white
        ${isSelected
                                                                            ? "border-brand"
                                                                            : disabled
                                                                                ? "border-primary-line opacity-50 cursor-not-allowed"
                                                                                : "border-primary-light"
                                                                        }
    `}
                                                                >
                                                                    <span
                                                                        className={`text-xl transition-all
                                    ${isSelected
                                                                                ? "font-bold text-primary-dark"
                                                                                : disabled
                                                                                    ? "text-primary-line"
                                                                                    : "font-normal text-primary-dark"
                                                                            }
                                `}
                                                                    >
                                                                        {date.getDate()}
                                                                    </span>
                                                                </motion.button>

                                                                {/* DAY TEXT */}
                                                                <span
                                                                    className={`mt-2 text-sm transition-all
                                ${isSelected
                                                                            ? "font-bold text-primary-dark"
                                                                            : disabled
                                                                                ? "text-primary-line"
                                                                                : "font-medium text-primary-dark"
                                                                        }
                            `}
                                                                >
                                                                    {date.toLocaleDateString("en-US", {
                                                                        weekday: "short",
                                                                    })}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-b px-6">
                                    <div className="py-2 max-w-md mx-auto">
                                        <div className="flex justify-between items-center">
                                            <div className="text-base font-bold">Select Arrival Time</div>
                                            {selectedSlot && (
                                                <div
                                                    className="text-sm text-[#3064A3] underline cursor-pointer"
                                                    onClick={() => scrollToSlot(selectedSlot.id)}
                                                >
                                                    {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                                                        weekday: "long",
                                                    })}{" "}
                                                    {selectedSlot.slot}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            {activeTab === 0 && (
                <div className="py-4 pb-32 px-6">
                    <div className="max-w-md mx-auto flex flex-col gap-4">
                        {visibleSlotsData.map((day, index) => {
                            const isLast = index === visibleSlotsData.length - 1;

                            return (
                                <div
                                    key={day.date}
                                    ref={isLast ? lastItemRef : null}
                                >
                                    <SlotCard
                                        date={day.date}
                                        slots={day.slots}
                                        selectedSlot={selectedSlot}
                                        onSelect={handleSlotSelect}
                                    />
                                </div>
                            );
                        })}

                        {loadingMore && (
                            <div className="flex justify-center py-4">
                                <motion.div
                                    className="h-6 w-6 rounded-full border-2 border-primary-light border-t-primary-dark"
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 1 && (
                <div className="py-4 pb-32 px-6">
                    <div className="max-w-md mx-auto flex flex-col gap-4">
                        {!!groomers ?
                            (groomers.map((groomer, index) => {
                                return (
                                    <GroomerCard
                                        key={groomer.id}
                                        groomer={groomer}
                                    />
                                )
                            })) : (
                                <div className="flex items-center justify-center min-h-[50vh]">
                                    <div className="text-lg font-medium text-primary-dark">
                                        No Groomers Found!
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            )}

            {/* FOOTER */}
            < div
                className="fixed bottom-0 left-0 w-full bg-white z-20"
                style={{ boxShadow: "0 -8px 30px rgba(0,0,0,0.12)" }
                }
            >
                <div className="max-w-md mx-auto flex items-center justify-between px-5 py-4">
                    <div className="flex flex-col gap-1">
                        <span
                            className="text-2xl font-bold text-primary-dark underline cursor-pointer"
                            onClick={() => setOpenPriceTotalModal(true)}
                        >
                            $105
                        </span>
                        <span className="text-[10px] text-primary-dark">
                            Fees & Taxes Included
                        </span>
                    </div>

                    <button
                        onClick={handleFooterAction}
                        className="h-[52px] w-[236px] rounded-[10px] font-bold text-white bg-primary-dark active:scale-[0.97] transition"
                    >
                        Next
                    </button>
                </div>
            </div >

            {/* MODALS */}
            < TotalPriceModal
                open={openPriceTotalModal}
                onClose={() => setOpenPriceTotalModal(false)}
                onModal={() => {
                    setOpenTaxModal(true);
                    setOpenPriceTotalModal(false);
                }}
                packageName="Gold"
                packagePrice={130}
                add_ons={[]}
                Insurance="$36.14"
            />

            <TaxInsuranceModal
                open={openTaxModal}
                onClose={() => setOpenTaxModal(false)}
                Insurance="$36.14"
                Tax="$12.50"
            />
        </>
    );
};

export default Slots;
