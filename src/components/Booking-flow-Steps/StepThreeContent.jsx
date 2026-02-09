import Card from "@/common/Booking-Flow/Card";
import { Radio } from "@mui/material";
import React, { useState } from "react";

import Info from "../../assets/icon/info-circle-grey.svg";
import FillGallery from "../../assets/icon/fill-black-gallery.svg";
import ShampooModal from "../Modals/ShampooModal";
import SuccessIcon from "../../assets/icon/tick-green.svg";
import { useDispatch, useSelector } from "react-redux";
import { updatePetStepData, updateTotalPrice } from "@/utils/store/slices/booking-flow/bookingFlowSlice";
import MattingInfoModal from "../Modals/MattingInfoModal";
import HardToHandleModal from "../Modals/HardToHandleModal";

/* -------------------- component -------------------- */

const StepThreeContent = ({
    showSuccess,
    conditionError,
    behaviorError,
    setConditionError,
    setBehaviorError,
}) => {
    const dispatch = useDispatch();
    const fileInputRef = React.useRef(null);

    const { currentPetIndex, groomingDetails, petsDraft } = useSelector(
        (state) => state.bookingFlow
    );

    const savedPackage = petsDraft?.[currentPetIndex]?.stepData?.package || {};

    const disabledCoatTypes = savedPackage?.disabledCoatType || [];
    const COAT_TYPE_LABELS = groomingDetails?.coatTypes;
    const BEHAVIOR_LABELS = groomingDetails?.behaviors;

    const SHAMPOO_OPTIONS = groomingDetails?.shampoos;
    const coatProducts = groomingDetails?.coatAndBehaviorProducts || {};

    const COAT_KEYS = ["not-matted", "matted", "severe"].filter(
        (key) => key in coatProducts
    );

    const BEHAVIOR_KEYS = ["friendly", "anxious", "aggressive"].filter(
        (key) => key in coatProducts
    );

    const grooming =
        useSelector(
            (state) =>
                state.bookingFlow.petsDraft[currentPetIndex]?.stepData?.grooming
        ) || {};

    const {
        condition,
        behavior,
        shampooId,
        shampoo = "premium",
        note = "",
        images = [],
        mattingInfo,
    } = grooming;

    const [localNote, setLocalNote] = React.useState(note || "");
    const [shampooModal, setShampooModal] = React.useState(false);
    const [shampooDecs, setShampooDecs] = React.useState(false);
    const [shampooTitle, setShampooTitle] = React.useState(false);

    const [behaviourModal, setBehaviourModal] = React.useState(false);
    const [pendingBehaviour, setPendingBehaviour] = React.useState(null);

    const [mattingModal, setMattingModal] = React.useState(false);
    const [pendingCondition, setPendingCondition] = React.useState(null);

    /* -------------------- helpers -------------------- */

    const updateGrooming = (data, shouldUpdatePrice = false) => {
        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: "grooming",
                data,
            })
        );

        if (shouldUpdatePrice) {
            dispatch(updateTotalPrice({ petIndex: currentPetIndex }));
        }
    };

    /* -------------------- Effect logic -------------------- */

    React.useEffect(() => {
        if (!COAT_KEYS.length) return;

        // if no condition selected OR selected one is disabled
        if (!condition || disabledCoatTypes.includes(condition)) {
            const fallback = COAT_KEYS.find(
                (key) => !disabledCoatTypes.includes(key)
            );

            if (!fallback) return;

            updateGrooming({
                condition: fallback,
                conditionProduct:
                    fallback === "not-matted" ? null : coatProducts[fallback],
                mattingInfo: null,
                shave_down_status: groomingDetails?.pets?.shave_down_status,
            }, true);
        }
    }, [
        disabledCoatTypes,
        COAT_KEYS,
        condition,
    ]);

    /* -------------------- coat condition logic -------------------- */

    const handleConditionSelect = (key) => {
        setConditionError("");

        // Not matted → no modal, no product
        if (key === "not-matted") {
            updateGrooming({
                condition: key,
                conditionProduct: null,
                mattingInfo: null,
            });
            return;
        }

        // Matted / Severe → needs approval
        setPendingCondition(key);
        setMattingModal(true);
    };

    const handleBehaviourSelect = (key) => {
        setBehaviorError("");

        if (key === "aggressive") {
            setPendingBehaviour(key);
            setBehaviourModal(true);
            return;
        }

        updateGrooming({
            behavior: key,
            behaviorProduct: coatProducts[key] || null,
            shave_down_status: groomingDetails?.pets?.shave_down_status
        }, true);
    };

    const handleBehaviourSubmit = () => {
        updateGrooming({
            behavior: "aggressive",
            behaviorProduct: coatProducts["aggressive"],
            shave_down_status: groomingDetails?.pets?.shave_down_status
        }, true);

        setPendingBehaviour(null);
        setBehaviourModal(false);
        setBehaviorError("");
    };

    const handleBehaviourModalClose = () => {
        setBehaviourModal(false);

        if (pendingBehaviour) {
            setPendingBehaviour(null);
            if (!behavior) {
                setBehaviorError("Please confirm pet’s behaviour");
            }
        }
    };

    const handleMattingModalSubmit = (approval) => {
        updateGrooming({
            condition: pendingCondition,
            conditionProduct: coatProducts[pendingCondition],
            mattingInfo: { approval },
            shave_down_status: groomingDetails?.pets?.shave_down_status
        }, true);

        setPendingCondition(null);
        setMattingModal(false);
        setConditionError("");
    };

    const handleMattingModalClose = () => {
        setMattingModal(false);

        // ❌ First-time close without submit
        if (pendingCondition && !mattingInfo) {
            setPendingCondition(null);
            if (!condition) {
                setConditionError("Please select pet's coat conditions");
            }
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

    /* -------------------- useEffect -------------------- */

    React.useEffect(() => {
        if (
            SHAMPOO_OPTIONS?.length &&
            !shampooId
        ) {
            const first = SHAMPOO_OPTIONS[0];

            updateGrooming({
                shampooId: first.id,
                shampoo: first.prod_name,
                shampooPrice: first?.price,
                shave_down_status: groomingDetails?.pets?.shave_down_status
            }, true);
        }
    }, [SHAMPOO_OPTIONS, shampooId]);

    /* -------------------- images -------------------- */

    const handleImageUpload = async (e) => {
        const input = e.target;
        const files = Array.from(input.files || []);

        console.log("FILES:", e.target.files);
        console.log("ARRAY:", Array.from(e.target.files || []));


        if (!files.length) return;

        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

        const uploadedImages = await Promise.all(
            files.map(async (file) => ({
                file,
                preview: await toBase64(file),
            }))
        );

        updateGrooming({
            images: [...images, ...uploadedImages],
        });

        // ✅ RESET INPUT (critical)
        input.value = "";
    };

    const removeImage = (index) => {
        updateGrooming({
            images: images.filter((_, i) => i !== index),
        });
    };

    /* -------------------- UI helpers -------------------- */

    const renderPills = ({
        options = [],
        selectedKey,
        labelMap = {},
        onSelect,
        disabledKeys = [],
    }) => (
        <div className="flex gap-2">
            {options.map((key) => {
                const isDisabled = disabledKeys.includes(key);
                const isSelected = selectedKey === key;

                return (
                    <button
                        key={key}
                        disabled={isDisabled}
                        onClick={() => {
                            if (!isDisabled) onSelect(key);
                        }}
                        className={`w-full py-3 rounded-[10px] border transition
                    ${isSelected
                                ? "border-brand shadow-md font-bold"
                                : "border-primary-light"
                            }
                            ${isDisabled
                                ? "opacity-40 cursor-not-allowed bg-gray-50"
                                : "hover:border-brand"
                            }`}
                    >
                        {labelMap[key] || key}
                    </button>
                )
            })}
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

                    {renderPills({
                        options: COAT_KEYS,
                        selectedKey: condition,
                        labelMap: COAT_TYPE_LABELS,
                        onSelect: handleConditionSelect,
                        disabledKeys: disabledCoatTypes,
                    })}

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

                    {savedPackage?.disabledCoatTypeMessage && (
                        <p className="text-xs mt-1">
                            {savedPackage?.disabledCoatTypeMessage}
                        </p>
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
                    {renderPills({
                        options: BEHAVIOR_KEYS,
                        selectedKey: behavior,
                        labelMap: BEHAVIOR_LABELS,
                        onSelect: handleBehaviourSelect,
                    })}

                    {behaviorError && (
                        <p className="text-xs text-brand mt-1">
                            {behaviorError}
                        </p>
                    )}
                </section>

                {/* Shampoo & Conditioner */}
                <section className="pt-4 space-y-2">
                    <h3 className="font-bold">Shampoo & Conditioner</h3>

                    <div className="flex flex-col gap-2">
                        {SHAMPOO_OPTIONS.map((option) => (
                            <div
                                key={option.id}
                                className="flex items-center gap-2"
                            >
                                <Radio
                                    checked={shampooId === option.id}
                                    onChange={() =>
                                        updateGrooming({ shampooId: option.id, shampoo: option?.prod_name, shampooPrice: option?.price, shave_down_status: groomingDetails?.pets?.shave_down_status }, true)
                                    }
                                    sx={{
                                        p: 0,
                                        color: "#7C868A",
                                        "&.Mui-checked": { color: "#FF314A" },
                                    }}
                                />

                                <span
                                    className="text-sm cursor-pointer"
                                    onClick={() => updateGrooming({ shampooId: option.id, shampoo: option?.prod_name, shampooPrice: option?.price, shave_down_status: groomingDetails?.pets?.shave_down_status }, true)}
                                >
                                    {option.prod_name} {""} ({option.prod_desc})
                                </span>

                                {(option.prod_desc_html || option.prod_short_desc) && (
                                    <img
                                        src={Info}
                                        alt="Info"
                                        className="w-[22px] h-[22px] cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShampooModal(true);
                                            setShampooDecs(option.prod_desc_html || option.prod_short_desc)
                                            setShampooTitle(option.prod_name)
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

            <ShampooModal
                open={shampooModal}
                onClose={() => setShampooModal(false)}
                shampooTitle={shampooTitle}
                shampooDecs={shampooDecs}
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
