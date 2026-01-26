import React, { useEffect, useState } from "react";
import Card from "@/common/Booking-Flow/Card";
import { Checkbox } from "@mui/material";
import Info from "../../assets/icon/info-circle-grey.svg";
import SuccessIcon from "../../assets/icon/tick-green.svg";
import BundlesModal from "../Modals/BundlesModal";
import { useDispatch, useSelector } from "react-redux";
import { updatePetStepData, updateTotalPrice } from "@/utils/store/slices/booking-flow/bookingFlowSlice";

const ADD_ON_SECTIONS = [
    {
        sectionId: "bundles",
        title: "Bundles",
        items: [
            {
                id: 1,
                label: "Recurring Bundle",
                badge: "Save $20",
                badgeColor: "bg-[#0A7170]",
                oldPrice: 40,
                price: 20,
                info: {
                    title: "Recurring Bundle",
                    description: (
                        <>
                            <strong>Includes all the recommended necessities</strong> to maintain the
                            hygiene of your dog. Including{" "}
                            <strong>Gland Expression, Teeth Brushing & Paw Balm</strong>.
                        </>
                    ),
                },
            },
        ],
    },
    {
        sectionId: "skin-coat",
        title: "Skin & Coat",
        items: [
            {
                id: 5,
                label: "Oatmeal Treatment",
                price: 15,
            },
        ],
    },
    {
        sectionId: "skin-coated",
        title: "Skin & Coated",
        items: [
            {
                id: 6,
                label: "New Treatment",
                price: 15,
            },
        ],
    },
    {
        sectionId: "treatments",
        title: "Treatments",
        items: [
            {
                id: 9,
                label: "Flea Treatment",
                oldPrice: 25,
                price: 18,
                badge: "Popular",
                badgeColor: "bg-[#3064A3]",
            },
        ],
    },
];

const AddOnRow = ({ item, checked, onToggle, onInfo }) => {
    return (
        <div className="flex justify-between items-center gap-3">
            {/* Left */}
            <div className="flex items-center gap-2 flex-wrap">
                <Checkbox
                    checked={checked}
                    onChange={onToggle}
                    disableRipple
                    sx={{
                        p: 0,
                        color: "#7C868A",
                        "&.Mui-checked": { color: "#FF314A" },
                    }}
                />

                <span
                    className="text-base cursor-pointer"
                    onClick={onToggle}
                >
                    {item.label}
                </span>

                {item.badge && (
                    <span
                        className={`text-[10px] px-2 py-[2px] ${item.badgeColor ?? "bg-[#3064A3]"} text-white rounded-full font-bold`}
                    >
                        {item.badge}
                    </span>
                )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                {item.oldPrice && (
                    <span className="text-base text-primary-light line-through">
                        ${item.oldPrice}
                    </span>
                )}

                <span className="text-base font-bold">
                    ${item.price}
                </span>

                <img
                    src={Info}
                    alt="Info"
                    className="w-[22px] h-[22px] cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onInfo(item.info);
                    }}
                />
            </div>
        </div>
    );
};

const StepFourContent = ({ showSuccess }) => {
    const dispatch = useDispatch();
    const [infoModal, setInfoModal] = useState(null);

    const currentPetIndex = useSelector(
        (state) => state.bookingFlow.currentPetIndex
    );

    const addons =
        useSelector(
            (state) =>
                state.bookingFlow.petsDraft[currentPetIndex]?.stepData?.addons
                    ?.items
        ) || [];

    const toggleItem = (item) => {
        console.log(item);

        const exists = addons.some((x) => x.id === item.id);

        const updated = exists
            ? addons.filter((x) => x.id !== item.id)
            : [...addons, { id: item.id, price: item.price, name: item?.label }];

        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: "addons",
                data: { items: updated },
            })
        );

        dispatch(updateTotalPrice({ petIndex: currentPetIndex }));
    };

    return (
        <>
            <Card title="Add-ons"
                action={showSuccess &&
                    <div
                        className="flex items-center gap-1 text-[#3064A3] cursor-pointer"
                    >
                        <img src={SuccessIcon} alt="Success" className="w-6 h-6 cursor-pointer" />
                    </div>
                }
            >
                {ADD_ON_SECTIONS.map((section) => (
                    <section key={section.sectionId} className="pt-4 space-y-2">
                        <h3 className="font-bold">{section.title}</h3>

                        <div className="flex flex-col gap-3">
                            {section.items.map((item) => (
                                <AddOnRow
                                    key={item.id}
                                    item={item}
                                    checked={addons.some((x) => x.id === item.id)}
                                    onToggle={() => toggleItem(item)}
                                    onInfo={(info) => setInfoModal(info)}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </Card>

            {infoModal && (
                <BundlesModal
                    open
                    title={infoModal.title}
                    description={infoModal.description}
                    onClose={() => setInfoModal(false)}
                />
            )}
        </>
    );
};

export default StepFourContent;
