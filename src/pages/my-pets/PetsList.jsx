import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown, ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";

import EditIcon from "../../assets/icon/edit-3.svg";
import Calender from "../../assets/icon/calendar-black.svg";
import PetPaw from "../../assets/icon/pet.svg";
import Delete from "../../assets/icon/trash-black.svg";
import Heart from "../../assets/icon/heart-black.svg";
import Close from "../../assets/icon/close-circle-red.svg";
import Succes from "../../assets/icon/tick-green.svg";
import FallbackDog from '../../assets/icon/dog-avatar.jpg';
import FallbackCat from '../../assets/icon/cat-avatar.jpg';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MemorialiseModal from "@/components/Modals/MemorialiseModal";
import DeleteDogModal from "@/components/Modals/DeleteDogModal";
import SuccessModal from "@/components/Modals/SuccessModal";
import { useLoader } from "@/contexts/loaderContext/LoaderContext";
import { useDispatch } from "react-redux";
import { getPetList, updatePetStatus } from "@/utils/store/slices/petList/petListSlice";

const InfoRow = ({ booster, type, icon, title, subtitle, onDetails, id }) => (
    <>
        <div className="flex p-[15px] justify-between items-center border-t border-[#E4E4E4]">
            <div className="flex items-start">
                {icon && (
                    <div className="flex bg-[#F2F2F2] items-center justify-center rounded-[10px] me-3 w-[35px] h-[35px]">
                        <img src={icon} alt="" className="w-[22px] h-[22px]" />
                    </div>
                )}

                <div>
                    <p className={`font-inter font-bold text-sm ${title === "Rabies Vaccination" ? 'underline' : ''}`}>{title}</p>
                    {subtitle && <p className="font-inter text-sm">{subtitle}</p>}
                </div>
            </div>

            {booster && (
                <span className="inline-flex items-center px-[6px] py-[4px] rounded-full bg-[#EB5757] text-xs font-bold uppercase text-white">
                    Booster needed
                </span>
            )}
        </div>
        {title === "Rabies Vaccination" && (
            <div className="flex p-[15px] items-start w-full pt-0">
                <button
                    onClick={() => onDetails(type, id)}
                    className={`h-[50px] w-full rounded-[10px] text-primary-dark text-base font-bold bg-white cursor-pointer border border-primary-line`}
                >
                    Update Vaccine Details
                </button>
            </div>
        )}
    </>
);

export default function PetsList({ pet, isSingle, memorizez }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    const { showLoader, hideLoader } = useLoader();

    const [expanded, setExpanded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [memorialiseOpen, setMemorialiseOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [successTitle, setSuccessTitle] = useState('');

    const {
        name = "Unnamed Pet",
        breed_name = "Unknown",
        ageFull,
        gender_show,
        temperament,
        vaccinated_exp_date,
        vaccinated_image_url,
        vaccinated_exp_date_display,
        special_note,
        type,
        is_show_booster
    } = pet || {};

    const petImage =
        pet?.profilePicture?.path || pet?.photo_url || (type === "dog" ? FallbackDog : FallbackCat);

    // keep expanded in sync if pet list changes
    useEffect(() => {
        if (isSingle) {
            setExpanded(true);
        }
    }, [isSingle]);

    const handlePetDetails = (type, id) => {
        navigate(`/user/pet/edit/${type}/${id}`);
    };

    const handleMemorialisePet = async (id) => {
        if (!id) return;
        try {
            showLoader();
            await dispatch(updatePetStatus({ pet_id: id, add: true })).unwrap();
            await dispatch(getPetList()).unwrap();
            setSuccessTitle(`${pet?.name} was successfully removed from memorialized`);
            setMemorialiseOpen(false);
            setSuccessModal(true);
        } catch (error) {
            console.error("Memorialise failed:", error);
        } finally {
            hideLoader();
        }
    };

    const handleDeletePet = async (id) => {
        if (!id) return;
        try {
            showLoader();
            await dispatch(updatePetStatus({ pet_id: id, remove_type: "D" })).unwrap();
            setSuccessTitle("Your Pet has been deleted successfully.");
            setIsDeleteModalOpen(false);
            setSuccessModal(true);
        } catch (error) {
            console.error("Delete failed:", error);
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
                            <img
                                src={petImage}
                                alt={name}
                                className="w-[35px] h-[35px] rounded-[10px] object-cover"
                            />

                            <div>
                                <h2 className="font-bold text-base capitalize text-primary-dark">{name}</h2>
                                <span className="font-inter text-sm text-primary-dark capitalize">
                                    {breed_name}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {!memorizez && <button
                                onClick={() => handlePetDetails(type, pet?.pet_id)}
                                className="rounded-[10px] border border-primary-line p-[7px]"
                            >
                                <img src={EditIcon} alt="Edit" className="w-[21px] h-[21px]" />
                            </button>}

                            {memorizez && (
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsOpen((prev) => !prev);
                                        }}
                                        className="p-[7px]"
                                    >
                                        <EllipsisVertical size={22} />
                                    </button>

                                    {isOpen && (
                                        <div
                                            ref={menuRef}
                                            onClick={(e) => e.stopPropagation()}
                                            className="z-20 absolute right-0 top-full mt-2 inline-flex w-[300px] flex-col rounded-[12px] border border-[#E4E4E4] bg-white p-[7px]"
                                        >
                                            {/* Remove From Memorialized */}
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setMemorialiseOpen(true);
                                                }}
                                                className="flex w-full items-center justify-between rounded-[8px] px-[12px] py-[10px]"
                                            >
                                                <div className="flex items-center gap-[8px]">
                                                    <img src={PetPaw} alt="" className="h-[22px] w-[22px]" />
                                                    <span className="font-inter text-sm font-bold tracking-[-0.28px] text-primary-dark">
                                                        Remove From Memorialized
                                                    </span>
                                                </div>

                                                <ChevronRight size={24} className="text-primary-light" />
                                            </button>

                                            {/* Divider */}
                                            <div className="mx-[8px] h-[1px] bg-[#E4E4E4]" />

                                            {/* Delete Pet */}
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="flex w-full items-center justify-between rounded-[8px] px-[12px] py-[10px]"
                                            >
                                                <div className="flex items-center gap-[8px]">
                                                    <img src={Delete} alt="" className="h-[22px] w-[22px]" />
                                                    <span className="font-inter text-sm font-bold tracking-[-0.28px]">
                                                        Delete Pet
                                                    </span>
                                                </div>

                                                <ChevronRight size={24} className="text-primary-light" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

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
                        {ageFull && gender_show && (
                            <InfoRow
                                icon={Calender}
                                title={`${ageFull}, ${gender_show}`}
                                subtitle="Gender & Age"
                            />
                        )}

                        {temperament && (
                            <InfoRow icon={Heart} title={temperament} subtitle="Behavior" />
                        )}

                        {vaccinated_exp_date_display && (
                            <InfoRow
                                icon={PetPaw}
                                title={"Rabies Vaccination"}
                                subtitle={`Expiration: ${vaccinated_exp_date_display}`}
                                onDetails={handlePetDetails}
                                id={pet?.pet_id}
                                type={type}
                                booster={is_show_booster}
                            />
                        )}

                        {special_note && (
                            <InfoRow
                                title="Additional Information"
                                subtitle={special_note}
                            />
                        )}
                    </div>
                </AccordionDetails>
            </Accordion>

            <DeleteDogModal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => handleDeletePet(pet?.pet_id)}
                icon={Close}
                title={`Delete ${pet?.name}`}
                decription={"By deleting this pet’s profile, it will no longer appear in your app. Are you sure you want to continue?"}
            />
            <SuccessModal
                open={successModal}
                onClose={() => setSuccessModal(false)}
                onConfirm={() => setSuccessModal(false)}
                icon={Succes}
                title={successTitle}
            />
            <MemorialiseModal
                open={memorialiseOpen}
                onClose={() => setMemorialiseOpen(false)}
                onConfirm={() => handleMemorialisePet(pet?.pet_id)}
                icon={Close}
                title={`Remove From Memorialized`}
                decription={`Are you sure you want to remove ${pet?.name} from memorialized?`}
            />
        </>
    );
}
