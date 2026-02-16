import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Checkbox } from "@mui/material";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import Gold from "../../../assets/package/Gold-package-booking.svg";
import Eco from "../../../assets/package/eco-package-booking.svg";
import Silver from "../../../assets/package/silver-package-booking.svg";
import Info from "../../../assets/icon/info-circle-grey.svg";
import EditIcon from "../../../assets/icon/edit-3.svg";
import ScissorIcon from "../../../assets/icon/scissor-black.svg";
import DeleteIcon from "../../../assets/icon/trash-black.svg";
import PackageBox from "../../../assets/icon/package-box.svg";
import HeartIcon from "../../../assets/icon/heart-black.svg";
import YellowInfo from "../../../assets/icon/info-circle-yellow.svg";
import StarIcon from "../../../assets/icon/star-black.svg";
import FragranceIcon from "../../../assets/icon/fragrance-black.svg";

import DeletePetModal from "@/components/Modals/DeletePetModal";
import BundlesModal from "@/components/Modals/BundlesModal";
import { CheckboxIcon } from "@/common/CustomCheckbox/CustomCheckboxIcons";
import { capitalize } from "@/common/helpers";

import {
    deletePetDraft,
    deletePetDraftBooking,
    getBookedPetsDetails,
    moveToNextPet,
    updatePetStepData,
    updateTotalPrice,
} from "@/utils/store/slices/booking-flow/bookingFlowSlice";
import { useLoader } from "@/contexts/loaderContext/LoaderContext";

/* -------------------- Recommended Add-on Row -------------------- */
export const RecommendedAddOnRow = ({ item, checked, onToggle, onInfo }) => (
    <div
        className="flex justify-between items-center pb-3 cursor-pointer"
        onClick={onToggle}
    >
        <div className="flex items-center gap-2">
            <Checkbox
                checked={checked}
                disableRipple
                icon={<CheckboxIcon />}
                checkedIcon={<CheckboxIcon checked />}
                sx={{ p: 0 }}
            />
            <span className="text-base font-medium">{item.prod_name}</span>
        </div>

        <div className="flex items-center gap-2">
            <span className="text-base font-bold">${item.price}</span>
            <img
                src={Info}
                alt="Info"
                className="w-[22px] h-[22px]"
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

/* -------------------- Info Row -------------------- */
const InfoRow = ({ icon, title, subtitle, uploadedImages = [], index }) => (
    <div className="px-[15px] pb-[15px]">
        <div className="flex items-start">
            {icon && (
                index ? (
                    <img src={icon} className="w-[35px] h-[35px] me-3" />
                ) : (
                    <div className="bg-[#F2F2F2] rounded-[10px] w-[35px] h-[35px] flex items-center justify-center me-3">
                        <img src={icon} className="w-[22px] h-[22px]" />
                    </div>
                )
            )}

            <div className="w-full">
                <p className="font-bold text-sm">{title}</p>
                {subtitle && <p className="text-sm">{subtitle}</p>}

                {uploadedImages.length > 0 && (
                    <div className="flex gap-3 flex-wrap mt-2">
                        {uploadedImages.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                className="w-[105px] h-[70px] rounded-[10px] object-cover"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
);

/* -------------------- Main Component -------------------- */
export default function BookedPetsList({ petsDetails, index, isSingle }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showLoader, hideLoader } = useLoader();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const token = useSelector((state) => state.auth.unique_token);
    const bookingFlow = useSelector((state) => state.bookingFlow);

    const { selectedPetIdsfromAPI, petsDraft = [] } = bookingFlow;

    console.log(petsDetails);

    const stepData = petsDraft[index]?.stepData || {};
    const addons = stepData.addons || {};
    const selectedRecommendedAddons = addons.recommendedAddons || [];

    const [isOpen, setIsOpen] = useState(false);
    const [expanded, setExpanded] = useState(isSingle);
    const [deleteModal, setDeleteModal] = useState(false);
    const [infoModal, setInfoModal] = useState(null);
    const [displayContentShow, setDisplayContentShow] = useState(false);

    /* -------------------- Icons -------------------- */
    const PACKAGE_ICONS = {
        gold: Gold,
        eco: Eco,
        silver: Silver,
    };

    const selectedPackage = petsDetails?.package?.selected;
    const packageIcon =
        PACKAGE_ICONS[selectedPackage?.productType] || PackageBox;

    const addonsLabel = useMemo(() => {
        const bundles = petsDetails?.bundleProducts || [];
        const addons = petsDetails?.addonProducts || [];

        if (!bundles.length && !addons.length) return "";

        // Collect addon names that are already included in bundles
        const bundledAddonNames = new Set();

        bundles.forEach(bundle => {
            const html =
                bundle?.prod_desc_html ||
                bundle?.prod_desc ||
                "";

            const normalizedHtml = html.toLowerCase();

            addons.forEach(addon => {
                const addonName = addon?.prod_name?.toLowerCase();
                if (!addonName) return;

                if (normalizedHtml.includes(addonName)) {
                    bundledAddonNames.add(addon.prod_name);
                }
            });
        });

        // Only keep addons NOT included in any bundle
        const standaloneAddons = addons.filter(
            addon => !bundledAddonNames.has(addon.prod_name)
        );

        return [
            ...bundles.map(b => b.prod_name),
            ...standaloneAddons.map(a => a.prod_name)
        ]
            .filter(Boolean)
            .join(", ");
    }, [
        petsDetails?.bundleProducts,
        petsDetails?.addonProducts
    ]);

    /* -------------------- Helpers -------------------- */
    const getAddonId = (product) =>
        product?.id ?? product?.prod_id;

    const isAddonChecked = (product) => {
        const addonId = getAddonId(product);
        return selectedRecommendedAddons.some(
            (a) => a.id === addonId
        );
    };

    const toggleRecommendedAddon = (product) => {
        const addonId = getAddonId(product);
        const exists = selectedRecommendedAddons.some(
            (a) => a.id === addonId
        );

        const updated = exists
            ? selectedRecommendedAddons.filter(
                (a) => a.id !== addonId
            )
            : [
                ...selectedRecommendedAddons,
                {
                    id: addonId,
                    name: product.prod_name,
                    price: Number(product.price),
                    raw: product,
                },
            ];

        dispatch(
            updatePetStepData({
                petIndex: index,
                step: "addons",
                data: { recommendedAddons: updated },
            })
        );

        dispatch(updateTotalPrice({ petIndex: index }));
    };

    const handleEdit = (e) => {
        e.stopPropagation();

        dispatch(
            moveToNextPet({
                petIndex: index
            })
        );

        navigate(`/book/pet/${selectedPetIdsfromAPI[index]}/from_pets`);
    };

    const handleDelete = async () => {
        try {
            showLoader();

            await dispatch(
                deletePetDraftBooking({
                    id: petsDetails?.id,
                    booking_session_token: token,
                })
            ).unwrap();

            await dispatch(getBookedPetsDetails(
                { booking_session_token: token }
            )).unwrap();

            // update local draft if needed
            dispatch(deletePetDraft({ petIndex: index }));

            setDeleteModal(false);
        } catch (error) {
            console.error("Delete pet failed:", error);
            toast.error(error?.message || "Failed to delete pet");
        } finally {
            hideLoader();
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isOpen &&
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        if (petsDetails?.isDraft) {
            setDisplayContentShow(true);
        }
    }, [petsDetails])

    const stepsConfig = useMemo(() => {
        if (!petsDetails?.isDraft) return [];

        return [
            {
                key: "pet",
                label: "Pet Details",
                isCompleted: petsDetails?.isPetInformationAdded,
            },
            {
                key: "package",
                label: "Package",
                isCompleted: petsDetails?.isPackageAdded,
            },
            {
                key: "grooming",
                label: "Grooming Details",
                isCompleted: petsDetails?.isGroomingAdded,
            },
        ].filter(step => !step.isCompleted);
    }, [petsDetails]);

    /* -------------------- Render -------------------- */
    return (
        <>
            <Accordion
                expanded={expanded}
                onChange={(e) => {
                    e.stopPropagation();
                    if (!isSingle && !displayContentShow) {
                        setExpanded((prev) => !prev);
                    }
                }}
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
                <AccordionSummary
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isSingle && !displayContentShow) {
                            setExpanded((prev) => !prev);
                        }
                    }}
                >
                    <div className="flex flex-col p-[15px] bg-white rounded-t-[15px] w-full gap-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-[10px]">
                                <div>
                                    <h2 className="font-bold text-base capitalize text-primary-dark">{petsDetails.name}</h2>
                                    <span className="font-inter text-sm text-primary-dark capitalize">
                                        {petsDetails?.type === "cat"
                                            ? ""
                                            : (petsDetails?.breed && petsDetails?.size) ? `${petsDetails.breed?.breed_name}, ${petsDetails.size?.size_name}` : ''}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {(!isSingle) && <button
                                    className="rounded-[10px] border border-primary-line p-[7px]"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteModal(true);
                                    }}
                                >
                                    <img src={DeleteIcon} alt="Delete" className="w-[21px] h-[21px]" />
                                </button>}
                                <button
                                    className="rounded-[10px] border border-primary-line p-[7px]"
                                    onClick={handleEdit}
                                >
                                    <img src={EditIcon} alt="Edit" className="w-[21px] h-[21px]" />
                                </button>

                                {(!isSingle && !displayContentShow) && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpanded((prev) => !prev);
                                        }}
                                        className="flex bg-[#F2F2F2] items-center justify-center rounded-[10px] p-[7px]"
                                    >
                                        <ChevronDown
                                            size={22}
                                            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                )}
                            </div>
                        </div>

                        {displayContentShow && stepsConfig.length > 0 && (
                            <>
                                <div className="flex items-center bg-[#F2F2F2] text-[10px] font-bold uppercase rounded-[10px] px-[10px] py-[15px]">
                                    {stepsConfig.map((step, idx) => (
                                        <div
                                            key={step.key}
                                            className={`flex items-center justify-center flex-1 gap-[5px] ${idx !== stepsConfig.length - 1
                                                ? "border-r border-primary-line"
                                                : ""
                                                }`}
                                        >
                                            <img
                                                src={YellowInfo}
                                                alt="Pending"
                                                className="w-5 h-5"
                                            />
                                            <span>{step.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleEdit}
                                    className="bg-white border border-primary-dark text-primary-dark text-sm font-bold rounded-[10px] h-[50px] w-full mt-[10px]"
                                >
                                    Complete Details
                                </button>
                            </>
                        )}

                        {!expanded && petsDetails?.recommendedProducts.length > 0 && <div className="pb-[15px]">
                            <div className="border border-black rounded-[10px] overflow-hidden">
                                <div className="bg-black font-bold text-base px-[15px] py-[10px] text-white capitalize">
                                    Commonly added for pets like {petsDetails?.name}
                                </div>

                                <div className="flex flex-col px-[15px] pt-4 pb-2">
                                    {Array.isArray(
                                        petsDetails?.recommendedProducts
                                    ) &&
                                        petsDetails?.recommendedProducts.map(
                                            (product) => (
                                                <RecommendedAddOnRow
                                                    key={getAddonId(product)}
                                                    item={product}
                                                    checked={isAddonChecked(product)}
                                                    onToggle={(e) => {
                                                        e.stopPropagation();
                                                        toggleRecommendedAddon(product);
                                                    }}
                                                    onInfo={setInfoModal}
                                                />
                                            )
                                        )}
                                </div>
                            </div>
                        </div>}
                    </div>
                </AccordionSummary>

                <AccordionDetails className="bg-white rounded-b-[15px]">
                    <InfoRow
                        icon={packageIcon}
                        title={`${selectedPackage?.service} | ${capitalize(
                            selectedPackage?.title
                        )}`}
                        subtitle="Package"
                        index
                    />

                    {petsDetails.shampooProduct && (
                        <InfoRow
                            icon={FragranceIcon}
                            title={petsDetails.shampooProduct.prod_name}
                            subtitle="Shampoo"
                        />
                    )}

                    {/* ADD-ONS */}
                    {addonsLabel && (
                        <InfoRow
                            icon={StarIcon}
                            title={addonsLabel}
                            subtitle="Add-ons"
                        />
                    )}

                    {petsDetails.coat_type_name && (
                        <InfoRow
                            icon={ScissorIcon}
                            title={petsDetails.coat_type_name}
                            subtitle="Coat Condition"
                        />
                    )}

                    {petsDetails.behavior_to_display && (
                        <InfoRow
                            icon={HeartIcon}
                            title={petsDetails.behavior_to_display}
                            subtitle="Behavior"
                        />
                    )}

                    {petsDetails.notes_for_groomer && (
                        <InfoRow
                            title="Notes & Styling References"
                            subtitle={petsDetails.notes_for_groomer}
                            uploadedImages={petsDetails.referenceImages?.map((i) => i.path)}
                        />
                    )}

                    {petsDetails?.recommendedProducts.length > 0 && <div className="pb-[15px] px-[15px]">
                        <div className="border border-black rounded-[10px] overflow-hidden">
                            <div className="bg-black font-bold text-base px-[15px] py-[10px] text-white capitalize">
                                Commonly added for pets like {petsDetails?.name}
                            </div>

                            <div className="flex flex-col px-[15px] pt-4 pb-2">
                                {Array.isArray(
                                    petsDetails?.recommendedProducts
                                ) &&
                                    petsDetails?.recommendedProducts.map(
                                        (product) => (
                                            <RecommendedAddOnRow
                                                key={getAddonId(product)}
                                                item={product}
                                                checked={isAddonChecked(product)}
                                                onToggle={(e) => {
                                                    e.stopPropagation();
                                                    toggleRecommendedAddon(product);
                                                }}
                                                onInfo={setInfoModal}
                                            />
                                        )
                                    )}
                            </div>
                        </div>
                    </div>}
                </AccordionDetails>
            </Accordion>

            <DeletePetModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={() => handleDelete()}
                title={`Remove ${petsDetails.name}`}
                decription={`Are you sure you want to remove ${petsDetails.name} from this appointment? ${petsDetails.name}'s details will stay saved in your Groomit account.`}
            />

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
}
