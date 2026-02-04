import React, { useState, useMemo } from "react";
import Card from "@/common/Booking-Flow/Card";
import { Checkbox } from "@mui/material";
import Info from "../../assets/icon/info-circle-grey.svg";
import SuccessIcon from "../../assets/icon/tick-green.svg";
import BundlesModal from "../Modals/BundlesModal";
import { useDispatch, useSelector } from "react-redux";
import {
    updatePetStepData,
    updateTotalPrice,
} from "@/utils/store/slices/booking-flow/bookingFlowSlice";

/* ---------------- Reusable Row ---------------- */
export const AddOnRow = ({ item, checked, onToggle, onInfo }) => {
    return (
        <div className="flex justify-between items-center gap-3">
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

                <span className="text-base cursor-pointer" onClick={onToggle}>
                    {item.prod_name}
                </span>

                {item.saves && (
                    <span className="text-[10px] px-2 py-[2px] bg-[#3064A3] text-white rounded-full uppercase">
                        Save <span className="font-bold">${item.saves}</span>
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                {/* {item.oldPrice && (
                    <span className="text-base text-primary-light line-through">
                        ${item.oldPrice}
                    </span>
                )} */}

                <span className="text-base font-bold">${item.price}</span>

                <img
                    src={Info}
                    alt="Info"
                    className="w-[22px] h-[22px] cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        onInfo({
                            title: item.prod_name,
                            description: item.prod_desc_html,
                        });
                    }}
                />
            </div>
        </div>
    );
};

/* ---------------- Main Component ---------------- */
const StepFourContent = ({ showSuccess }) => {
    const dispatch = useDispatch();
    const [infoModal, setInfoModal] = useState(null);

    const { currentPetIndex, addonsDetails, petsDraft } = useSelector(
        (state) => state.bookingFlow
    );

    /* ---------------- Redux Data ---------------- */
    const selectedAddons =
        petsDraft[currentPetIndex]?.stepData?.addons?.items || [];

    const bundles = addonsDetails?.bundles || [];
    const addonsArray = addonsDetails?.addonsArray || {};
    const addonsWithBundles = addonsDetails?.addonsWithBundles || {};


    console.log(addonsDetails);

    /* ---------------- Helpers ---------------- */
    const isChecked = (id) =>
        selectedAddons.some((item) => item.id === id);

    const toggleItem = (item, category = null) => {
        const isBundle = category === "BUNDLES";
        const exists = selectedAddons.some((x) => x.id === item.id);

        let updatedItems = [...selectedAddons];

        if (isBundle) {
            const bundleAddonIds = addonsWithBundles[item.id] || [];

            if (exists) {
                const remainingBundles = updatedItems.filter(
                    (x) => x.category === "BUNDLES" && x.id !== item.id
                );

                const addonIdsUsedByOtherBundles = new Set();

                remainingBundles.forEach((bundle) => {
                    const ids = addonsWithBundles[bundle.id] || [];
                    ids.forEach((id) =>
                        addonIdsUsedByOtherBundles.add(String(id))
                    );
                });

                updatedItems = updatedItems.filter((x) => {
                    // remove bundle itself
                    if (x.id === item.id) return false;

                    // if addon belongs to removed bundle
                    if (bundleAddonIds.includes(String(x.id))) {
                        // keep it ONLY if another bundle still uses it
                        return addonIdsUsedByOtherBundles.has(String(x.id));
                    }

                    return true;
                });
            } else {
                // ✅ Add bundle
                updatedItems.push({
                    id: item.id,
                    name: item.prod_name,
                    price: item.price,
                    category: "BUNDLES",
                    raw: item,
                });

                // ✅ Auto-add bundle addons
                bundleAddonIds.forEach((addonId) => {
                    const addonExists = updatedItems.some(
                        (x) => String(x.id) === String(addonId)
                    );

                    if (!addonExists) {
                        const addonObj = allAddonsFlat.find(
                            (a) => String(a.id) === String(addonId)
                        );

                        if (addonObj) {
                            updatedItems.push({
                                id: addonObj.id,
                                name: addonObj.prod_name,
                                price: addonObj.price,
                                category: addonObj.prod_kwd,
                                raw: addonObj,
                            });
                        }
                    }
                });
            }
        } else {
            // 🔁 Normal addon toggle (unchanged behavior)
            updatedItems = exists
                ? updatedItems.filter((x) => x.id !== item.id)
                : [
                    ...updatedItems,
                    {
                        id: item.id,
                        name: item.prod_name,
                        price: item.price,
                        category,
                        raw: item,
                    },
                ];
        }

        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: "addons",
                data: { items: updatedItems },
            })
        );

        dispatch(updateTotalPrice({ petIndex: currentPetIndex }));
    };

    /* ---------------- Memoized Categories ---------------- */
    const addonCategories = useMemo(() => {
        return Object.entries(addonsArray);
    }, [addonsArray]);

    const allAddonsFlat = useMemo(() => {
        return Object.values(addonsArray).flat();
    }, [addonsArray]);

    /* ---------------- Render ---------------- */
    return (
        <>
            <Card
                title="Add-ons"
                action={
                    showSuccess && (
                        <div className="flex items-center gap-1 text-[#3064A3] cursor-pointer">
                            <img
                                src={SuccessIcon}
                                alt="Success"
                                className="w-6 h-6"
                            />
                        </div>
                    )
                }
            >
                {/* -------- Bundles -------- */}
                {bundles.length > 0 && (
                    <section className=" space-y-2">
                        <h3 className="font-bold">Bundles</h3>

                        <div className="flex flex-col gap-2">
                            {bundles.map((item) => (
                                <AddOnRow
                                    key={item.id}
                                    item={item}
                                    checked={isChecked(item.id)}
                                    onToggle={() => toggleItem(item, "BUNDLES")}
                                    onInfo={setInfoModal}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* -------- Addons by Category -------- */}
                {addonCategories.map(([category, items]) => (
                    <section key={category} className="pt-3 space-y-2">
                        <h3 className="font-bold capitalize">
                            {category === "SKIN&COAT" ? 'Skin & Coat' : category.toLocaleLowerCase().replace(/_/g, " ")}
                        </h3>

                        <div className="flex flex-col gap-3">
                            {items.map((item) => (
                                <AddOnRow
                                    key={item.id}
                                    item={item}
                                    checked={isChecked(item.id)}
                                    onToggle={() =>
                                        toggleItem(item, category)
                                    }
                                    onInfo={setInfoModal}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </Card>

            {/* -------- Info Modal -------- */}
            {infoModal && (
                <BundlesModal
                    open
                    title={infoModal.title}
                    description={infoModal.description}
                    onClose={() => setInfoModal(null)}
                />
            )}
        </>
    );
};

export default StepFourContent;
