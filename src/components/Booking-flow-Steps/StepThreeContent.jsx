import Card from "@/common/Booking-Flow/Card";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import React, { useState } from "react";

import Info from "../../assets/icon/info-circle-grey.svg";
import FillGallery from "../../assets/icon/fill-black-gallery.svg";
import PremiumModal from "../Modals/PremiumModal";
import HypoallergenicModal from "../Modals/HypoallergenicModal";
import SuccessIcon from "../../assets/icon/tick-green.svg";
import { useDispatch, useSelector } from "react-redux";
import { updatePetStepData } from "@/utils/store/slices/booking-flow/bookingFlowSlice";
import MattingInfoModal from "../Modals/MattingInfoModal";
import HardToHandleModal from "../Modals/HardToHandleModal";

/* -------------------- constants -------------------- */

const CONDITIONS = ["Not Matted", "Matted", "Severe Matted"];
const BEHAVIOUR = ["Friendly", "Anxious", "Hard to Handle"];

const SHAMPOO_OPTIONS = [
    { label: "Premium (Scented)", value: "premium" },
    { label: "Hypoallergenic (Fragrance Free)", value: "hypoallergenic" },
];

/* -------------------- component -------------------- */

const StepThreeContent = ({ showSuccess }) => {
    const dispatch = useDispatch();
    const fileInputRef = React.useRef(null);

    const currentPetIndex = useSelector(
        (state) => state.bookingFlow.currentPetIndex
    );

    const grooming =
        useSelector(
            (state) =>
                state.bookingFlow.petsDraft[currentPetIndex]?.stepData?.grooming
        ) || {};

    const {
        condition,
        behavior,
        shampoo = "premium",
        note = "",
        images = [],
        mattingInfo,
    } = grooming;

    const [localNote, setLocalNote] = React.useState(note);
    const [premiumModal, setPremiumModal] = React.useState(false);
    const [hypoModal, setHypoModal] = React.useState(false);

    const [behaviourModal, setBehaviourModal] = React.useState(false);
    const [pendingBehaviour, setPendingBehaviour] = React.useState(null);
    const [behaviourError, setBehaviourError] = React.useState("");

    const [mattingModal, setMattingModal] = React.useState(false);
    const [pendingCondition, setPendingCondition] = React.useState(null);
    const [conditionError, setConditionError] = React.useState("");

    /* -------------------- helpers -------------------- */

    const updateGrooming = (data) => {
        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: "grooming",
                data,
            })
        );
    };

    /* -------------------- coat condition logic -------------------- */

    const handleConditionSelect = (item) => {
        setConditionError("");

        // ✅ Not Matted = immediate + clear consent
        if (item === "Not Matted") {
            updateGrooming({
                condition: "Not Matted",
                mattingInfo: null,
            });
            setPendingCondition(null);
            return;
        }

        // 🔒 Matted / Severe Matted requires confirmation
        setPendingCondition(item);
        setMattingModal(true);
    };

    const handleBehaviourSelect = (val) => {
        setBehaviourError("");

        if (val === "Hard to Handle") {
            updateGrooming({ behavior: null });

            setPendingBehaviour(val);
            setBehaviourModal(true);
            return;
        }

        updateGrooming({ behavior: val });
    };

    const handleBehaviourSubmit = () => {
        updateGrooming({ behavior: "Hard to Handle" });

        setPendingBehaviour(null);
        setBehaviourModal(false);
        setBehaviourError("");
    };

    const handleBehaviourModalClose = () => {
        setBehaviourModal(false);

        if (pendingBehaviour) {
            setPendingBehaviour(null);
            setBehaviourError("Please confirm pet’s behaviour");
        }
    };

    const handleMattingModalSubmit = (approval) => {
        updateGrooming({
            condition: pendingCondition,
            mattingInfo: { approval },
        });

        setPendingCondition(null);
        setMattingModal(false);
        setConditionError("");
    };

    const handleMattingModalClose = () => {
        setMattingModal(false);

        // ❌ First-time close without submit
        if (pendingCondition && !mattingInfo) {
            setPendingCondition(null);
            setConditionError("Please select pet's coat conditions");
        }
        // ✅ If consent already exists → do nothing
    };

    /* -------------------- notes debounce -------------------- */

    React.useEffect(() => {
        setLocalNote(note);
    }, [note, currentPetIndex]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (localNote !== note) {
                updateGrooming({ note: localNote });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localNote]);

    /* -------------------- images -------------------- */

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        const toBase64 = (file) =>
            new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });

        const newImages = await Promise.all(
            files.map(async (file) => ({
                preview: await toBase64(file),
            }))
        );

        updateGrooming({ images: [...images, ...newImages] });
    };

    const removeImage = (index) => {
        updateGrooming({
            images: images.filter((_, i) => i !== index),
        });
    };

    /* -------------------- UI helpers -------------------- */

    const renderPills = (options, selected, onClick) => (
        <div className="flex gap-2">
            {options.map((item) => (
                <button
                    key={item}
                    onClick={() => onClick(item)}
                    className={`w-full py-3 rounded-[10px] border transition ${selected === item
                        ? "border-brand shadow-md font-bold"
                        : "border-primary-light"
                        }`}
                >
                    {item}
                </button>
            ))}
        </div>
    );

    /* -------------------- render -------------------- */

    return (
        <>
            <Card title="Grooming Details"
                action={showSuccess &&
                    <div
                        className="flex items-center gap-1 text-[#3064A3] cursor-pointer"
                    >
                        <img src={SuccessIcon} alt="Success" className="w-6 h-6 cursor-pointer" />
                    </div>
                }
            >
                {/* Coat Conditions */}
                <section className="space-y-2">
                    <h3 className="font-bold">Coat Conditions</h3>

                    {renderPills(CONDITIONS, condition, handleConditionSelect)}

                    {mattingInfo?.approval && (
                        <div
                            className="text-xs text-[#3064A3] underline px-1 cursor-pointer"
                            onClick={() => {
                                setMattingModal(true);
                            }}
                        >
                            {grooming.mattingInfo.approval === "approve"
                                ? "I approve the shave-down for my pet"
                                : "I do not approve the shave-down for my pet"}
                        </div>
                    )}

                    {conditionError && (
                        <p className="text-xs text-brand mt-1">
                            {conditionError}
                        </p>
                    )}
                </section>

                {/* Behavior */}
                <section className="pt-4 space-y-2">
                    <h3 className="font-bold">Behavior</h3>
                    {renderPills(BEHAVIOUR, behavior, handleBehaviourSelect)}

                    {behaviourError && (
                        <p className="text-xs text-brand mt-1">
                            {behaviourError}
                        </p>
                    )}
                </section>

                {/* Shampoo & Conditioner */}
                <section className="pt-4 space-y-2">
                    <h3 className="font-bold">Shampoo & Conditioner</h3>

                    <div className="flex flex-col gap-2">
                        {SHAMPOO_OPTIONS.map((option) => (
                            <div
                                key={option.value}
                                className="flex items-center gap-2"
                            >
                                <Radio
                                    checked={shampoo === option.value}
                                    onChange={() =>
                                        updateGrooming({ shampoo: option.value })
                                    }
                                    sx={{
                                        p: 0,
                                        color: "#7C868A",
                                        "&.Mui-checked": { color: "#FF314A" },
                                    }}
                                />

                                <span
                                    className="text-sm cursor-pointer"
                                    onClick={() => updateGrooming({ shampoo: option.value })}
                                >
                                    {option.label}
                                </span>

                                {option.value === "premium" && (
                                    <img
                                        src={Info}
                                        alt="Info"
                                        className="w-[22px] h-[22px] cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPremiumModal(true);
                                        }}
                                    />
                                )}

                                {option.value === "hypoallergenic" && (
                                    <img
                                        src={Info}
                                        alt="Info"
                                        className="w-[22px] h-[22px] cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setHypoModal(true);
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Notes & Styling References */}
                <section className="pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold">Notes & Styling References</h3>
                        <span className="text-xs text-primary-light">Optional</span>
                    </div>

                    {/* Notes input */}
                    <div className="relative">
                        <textarea
                            value={localNote}
                            onChange={(e) => setLocalNote(e.target.value)}
                            placeholder="Enter Notes"
                            className="w-full min-h-[90px] rounded-[10px] border border-primary-line py-3 pl-3 pr-12 text-sm resize-none focus:outline-none"
                        />

                        {/* Gallery icon */}
                        <img
                            src={FillGallery}
                            alt="Upload"
                            onClick={() => fileInputRef.current.click()}
                            className="absolute right-3 top-3 w-8 h-8 cursor-pointer"
                        />

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {/* Image previews */}
                    {images.length > 0 && (
                        <div className="flex gap-3 flex-wrap">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative w-[105px] h-[70px] rounded-[10px] overflow-hidden"
                                >
                                    <img
                                        src={img.preview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-primary-dark text-white text-xs rounded-full flex items-end justify-center"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </Card>

            <PremiumModal
                open={premiumModal}
                onClose={() => setPremiumModal(false)}
            />

            <HypoallergenicModal
                open={hypoModal}
                onClose={() => setHypoModal(false)}
            />

            <MattingInfoModal
                open={mattingModal}
                selected={mattingInfo?.approval}
                onClose={handleMattingModalClose}
                onSubmit={handleMattingModalSubmit}
            />

            <HardToHandleModal
                open={behaviourModal}
                onClose={handleBehaviourModalClose}
                onSubmit={handleBehaviourSubmit}
            />
        </>
    );
};

export default StepThreeContent;
