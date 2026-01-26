import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";

import EditIcon from "../../../assets/icon/edit-3.svg";
import Calender from "../../../assets/icon/calendar-black.svg";
import ScissorIcon from "../../../assets/icon/scissor-black.svg";
import Delete from "../../../assets/icon/trash-black.svg";
import PackageBox from "../../../assets/icon/package-box.svg";
import Heart from "../../../assets/icon/heart-black.svg";
import ClockIcon from "../../../assets/icon/clock-black.svg";
import StarIcon from "../../../assets/icon/star-black.svg";
import FragranceIcon from "../../../assets/icon/fragrance-black.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useLoader } from "@/contexts/loaderContext/LoaderContext";
import { deletePetDraft, moveToNextPet, setPetID } from "@/utils/store/slices/booking-flow/bookingFlowSlice";
import { useDispatch, useSelector } from "react-redux";
import DeletePetModal from "@/components/Modals/DeletePetModal";

const InfoRow = ({ icon, title, subtitle, uploadedImages = [] }) => (
    <>
        <div className="px-[15px]">
            <div className="border-t border-[#E4E4E4] py-[15px]">
                <div className="flex items-start">
                    {icon && (
                        <div className="flex bg-[#F2F2F2] items-center justify-center rounded-[10px] me-3 w-[35px] h-[35px]">
                            <img
                                src={icon}
                                alt=""
                                className="w-[22px] h-[22px]"
                            />
                        </div>
                    )}

                    <div>
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

    const { currentPetIndex } = bookingFlow;

    const { stepData } = petDraft || {};
    const { details = {}, package: pkg = {}, grooming = {} } = stepData || {};

    const { showLoader, hideLoader } = useLoader();

    const [expanded, setExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const {
        name,
        gender_show,
        ageFull,
    } = details;

    const {
        title: packageTitle,
        name: packageName,
        type: packageType,
    } = pkg;

    const {
        condition,
        behavior,
        shampoo,
        note,
        images = [],
        addons = [],
    } = grooming;

    /* ---------- Helpers ---------- */
    const serviceLabel =
        packageType === "recurring" ? "Recurring" : "One-Time";

    const addonsLabel = (() => {
        if (!addons.length) return "";
        if (addons.length <= 3) return addons.map(a => a.name).join(", ");
        return `${addons.slice(0, 3).map(a => a.name).join(", ")} + ${addons.length - 3} more`;
    })();

    const shampooLabel =
        shampoo === "premium"
            ? "Hypoallergenic (Fragrance Free)"
            : shampoo || "";

    const uploadedImages = images.map(img => img.preview);

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

        navigate(`/book/pet/${petDraft?.petId}/from_pets`);
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
                                    {packageTitle || packageName}
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
                            icon={PackageBox}
                            title={`${packageTitle} | ${packageName}`}
                            subtitle="Package"
                        />

                        <InfoRow
                            icon={ClockIcon}
                            title={serviceLabel}
                            subtitle="Service"
                        />

                        {/* ADD-ONS */}
                        {addonsLabel && (
                            <InfoRow
                                icon={StarIcon}
                                title={addonsLabel}
                                subtitle="Add-ons"
                            />
                        )}

                        {/* SHAMPOO */}
                        {shampooLabel && (
                            <InfoRow
                                icon={FragranceIcon}
                                title={shampooLabel}
                                subtitle="Shampoo"
                            />
                        )}

                        {ageFull && gender_show && (
                            <InfoRow
                                icon={Calender}
                                title={`${ageFull}, ${gender_show}`}
                                subtitle="Gender & Age"
                            />
                        )}

                        {/* COAT */}
                        {condition && (
                            <InfoRow
                                icon={ScissorIcon}
                                title={condition}
                                subtitle="Coat Conditions"
                            />
                        )}

                        {/* BEHAVIOR */}
                        {behavior && (
                            <InfoRow
                                icon={Heart}
                                title={behavior}
                                subtitle="Behavior"
                            />
                        )}

                        {/* NOTES + IMAGES */}
                        {(note) && (
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
