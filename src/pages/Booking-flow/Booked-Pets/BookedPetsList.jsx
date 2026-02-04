import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";

import Gold from '../../../assets/package/Gold-package-booking.svg';
import Eco from '../../../assets/package/eco-package-booking.svg';
import Silver from '../../../assets/package/silver-package-booking.svg';

import EditIcon from "../../../assets/icon/edit-3.svg";
import ScissorIcon from "../../../assets/icon/scissor-black.svg";
import Delete from "../../../assets/icon/trash-black.svg";
import PackageBox from "../../../assets/icon/package-box.svg";
import Heart from "../../../assets/icon/heart-black.svg";
import ClockIcon from "../../../assets/icon/clock-black.svg";
import StarIcon from "../../../assets/icon/star-black.svg";
import FragranceIcon from "../../../assets/icon/fragrance-black.svg";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { deletePetDraft, moveToNextPet } from "@/utils/store/slices/booking-flow/bookingFlowSlice";
import { useDispatch, useSelector } from "react-redux";
import DeletePetModal from "@/components/Modals/DeletePetModal";
import { capitalize } from "@/common/helpers";

const InfoRow = ({ index = false, isSingle = false, icon, title, subtitle, uploadedImages = [] }) => (
    <>
        <div className="px-[15px]">
            <div className={`pb-[15px]`}>
                <div className="flex items-start">
                    {(icon && !index) && (
                        <div className="flex bg-[#F2F2F2] items-center justify-center rounded-[10px] me-3 w-[35px] h-[35px]">
                            <img
                                src={icon}
                                alt=""
                                className="w-[22px] h-[22px]"
                            />
                        </div>
                    )}

                    {(icon && index) && (
                        <img
                            src={icon}
                            alt=""
                            className="w-[35px] h-[35px] me-3"
                        />
                    )}

                    <div className="w-full">
                        <p className="font-inter font-bold text-sm">
                            {title}
                        </p>

                        {subtitle && (
                            <p className="font-inter text-sm">
                                {subtitle}
                            </p>
                        )}

                        {uploadedImages.length > 0 && (
                            <div className="flex gap-3 flex-wrap mt-2">
                                {uploadedImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className="w-[105px] h-[70px] rounded-[10px] overflow-hidden"
                                    >
                                        <img
                                            src={img}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
);

export default function BookedPetsList({ petDraft, isSingle }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const bookingFlow = useSelector((state) => state.bookingFlow);

    const { selectedPetIdsfromAPI, groomingDetails } = bookingFlow;

    const { stepData } = petDraft || {};
    const { details = {}, package: pkg = {}, grooming = {}, addons = {} } = stepData || {};

    const COAT_TYPE_LABELS = groomingDetails?.coatTypes;
    const BEHAVIOR_LABELS = groomingDetails?.behaviors;

    const getCoatLabel = (key) =>
        COAT_TYPE_LABELS?.[key] || key;

    const getBehaviorLabel = (key) =>
        BEHAVIOR_LABELS?.[key] || key;

    const [expanded, setExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const {
        name,
        breed_name,
        size_name,
        breed,
        size,
        petType
    } = details;

    const {
        productType,
        service,
        pricingType,
        packageTitle
    } = pkg;

    const {
        condition,
        behavior,
        shampoo,
        note,
        images = [],
    } = grooming;

    const { items = [] } = addons;

    /* ---------- Helpers ---------- */
    const serviceLabel =
        pricingType === "recurring" ? "Recurring" : "One-Time";

    const addonsLabel = useMemo(() => {
        if (!items?.length) return "";

        const bundles = items.filter(i => i.category === "BUNDLES");
        const addons = items.filter(i => i.category !== "BUNDLES");

        const bundledAddonNames = new Set();

        bundles.forEach(bundle => {
            const html =
                bundle?.raw?.prod_desc_html ||
                bundle?.raw?.prod_desc ||
                "";

            addons.forEach(addon => {
                if (
                    html.toLowerCase().includes(addon.name.toLowerCase())
                ) {
                    bundledAddonNames.add(addon.name);
                }
            });
        });

        const filteredAddons = addons.filter(
            addon => !bundledAddonNames.has(addon.name)
        );

        return [...bundles, ...filteredAddons]
            .map(i => i.name?.replace(/\s+/g, " ").trim())
            .join(", ");
    }, [items]);

    const uploadedImages = useMemo(
        () => images.map(img => img.preview),
        [images]
    );

    const PACKAGE_ICONS = {
        gold: Gold,
        eco: Eco,
        silver: Silver,
    };

    const packageIcon =
        PACKAGE_ICONS[productType] || PackageBox;

    // keep expanded in sync if pet list changes
    useEffect(() => {
        if (isSingle) {
            setExpanded(true);
        }
    }, [isSingle]);

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

    const handleEdit = (e) => {
        e.stopPropagation();

        dispatch(
            moveToNextPet({
                petIndex: petDraft?.petIndex
            })
        );

        navigate(`/book/pet/${selectedPetIdsfromAPI[petDraft?.petIndex]}/from_pets`);
    };

    const handleDeletePet = () => {
        dispatch(
            deletePetDraft({
                petIndex: petDraft?.petIndex,
            })
        );
        setIsDeleteModalOpen(false);
    };

    return (
        <>
            <Accordion
                expanded={expanded}
                onChange={() => {
                    if (!isSingle) {
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
                {/* HEADER */}
                <AccordionSummary>
                    <div className="flex p-[15px] bg-white rounded-t-[15px] w-full items-center justify-between">
                        <div className="flex items-center gap-[10px]">
                            <div>
                                <h2 className="font-bold text-base capitalize text-primary-dark">{name}</h2>
                                <span className="font-inter text-sm text-primary-dark capitalize">
                                    {petType === "cat"
                                        ? "Cat"
                                        : `${breed?.breed_name || breed_name}, ${size?.size || size_name}`}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {!isSingle && <button
                                className="rounded-[10px] border border-primary-line p-[7px]"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDeleteModalOpen(true);
                                }}
                            >
                                <img src={Delete} alt="Delete" className="w-[21px] h-[21px]" />
                            </button>}
                            <button
                                className="rounded-[10px] border border-primary-line p-[7px]"
                                onClick={handleEdit}
                            >
                                <img src={EditIcon} alt="Edit" className="w-[21px] h-[21px]" />
                            </button>

                            {!isSingle && (
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
                </AccordionSummary>

                {/* BODY */}
                <AccordionDetails>
                    <div className="bg-white rounded-b-[15px] overflow-hidden">
                        <InfoRow
                            icon={packageIcon}
                            title={`${service} | ${capitalize(packageTitle)}`}
                            subtitle="Package"
                            index={true}
                        />

                        <InfoRow
                            icon={ClockIcon}
                            title={serviceLabel}
                            subtitle="Service"
                        />

                        {/* SHAMPOO */}
                        {shampoo && (
                            <InfoRow
                                icon={FragranceIcon}
                                title={shampoo}
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

                        {/* COAT */}
                        {condition && (
                            <InfoRow
                                icon={ScissorIcon}
                                title={getCoatLabel(condition)}
                                subtitle="Coat Conditions"
                            />
                        )}

                        {/* BEHAVIOR */}
                        {behavior && (
                            <InfoRow
                                icon={Heart}
                                title={getBehaviorLabel(behavior)}
                                subtitle="Behavior"
                            />
                        )}

                        {/* NOTES + IMAGES */}
                        {!!note && (
                            <InfoRow
                                title="Notes & Styling References"
                                subtitle={note}
                                uploadedImages={uploadedImages}
                            />
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>

            <DeletePetModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleDeletePet()}
                title={`Remove ${name}`}
                decription={`Are you sure you want to remove ${name} from this appointment? Checkk's details will stay saved in your Groomit account.`}
            />
        </>
    );
}
