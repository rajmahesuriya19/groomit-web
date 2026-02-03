import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, MinusIcon, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox } from "@mui/material";
import { toast } from "react-toastify";

import { useLoader } from "@/contexts/loaderContext/LoaderContext";
import { getPetList } from "@/utils/store/slices/petList/petListSlice";

// icons
import infoGrey from "../../../assets/icon/info-circle-grey.svg";
import EmptyDog from "../../../assets/animation/Dog.svg";
import EmptyCat from "../../../assets/animation/Cat.svg";
import Mobilevan from "../../../assets/icon/mobile-van.svg";
import HomeIcon from "../../../assets/icon/home-selection-a.svg";
import ServiceTypeInfo from "@/components/Modals/ServiceTypeInfo";
import PetInfo from "@/components/Modals/PetInfo";
import AddPetModal from "@/components/Modals/AddPetModal";
import Card from "@/common/Booking-Flow/Card";
import BookingFooter from "../BookingFooter";
import { getPetServiceType, initializePetFlow, SavePetServiceType, setPetCounts, setServiceType, togglePet } from "@/utils/store/slices/booking-flow/bookingFlowSlice";

const SERVICE_TYPES = {
    MOBILE: "mobile-van",
    HOME: "in-home",
};

const MAX_PETS = 6;

const ServiceTypePets = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showLoader, hideLoader } = useLoader();

    const {
        dogPets = [],
        catPets = [],
    } = useSelector((state) => state.pets?.pets || {});
    const token = useSelector((state) => state.auth.unique_token);
    const bookingFlow = useSelector((state) => state.bookingFlow || {});

    const {
        serviceType,
        selectedPetIds = [],
        selectedPetIdsfromAPI = [],
        petCounts = { dog: 0, cat: 0 },
        address: bookingAddress,
        getPetServiceTypeApi
    } = bookingFlow;

    const disabledServices = getPetServiceTypeApi?.isDisabledService || [];
    const disabledPets = getPetServiceTypeApi?.isDisabledPet || [];

    const isMobileDisabled = disabledServices.includes("mobile-van");
    const isHomeDisabled = disabledServices.includes("in-home");

    const isDogDisabled = disabledPets.includes("dog");
    const isCatDisabled = disabledPets.includes("cat");

    const canAddAnyPet = getPetServiceTypeApi?.canAddDog || getPetServiceTypeApi?.canAddCat;

    const dogCount = petCounts?.dog || 0;
    const catCount = petCounts?.cat || 0;
    const totalPets = dogCount + catCount;

    let pet_type = "";

    if (dogCount > 0 && catCount > 0) {
        pet_type = "both";
    } else if (dogCount > 0) {
        pet_type = "dog";
    } else if (catCount > 0) {
        pet_type = "cat";
    }

    const [serviceTypeModal, setServiceTypeModal] = useState(false);
    const [petInfoModal, setPetInfoModal] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);
    const [addPetModalOpen, AddPetModalOpen] = useState(false);

    /* ---------------- Default Address ---------------- */
    const displayAddress = useMemo(() => {
        return bookingAddress || null;
    }, [bookingAddress]);

    /* ---------------- Pets ---------------- */
    const allPets = useMemo(
        () => [...dogPets, ...catPets],
        [dogPets, catPets]
    );

    const togglePetSelection = (petId) => {
        if (
            !selectedPetIds.includes(petId) &&
            selectedPetIds.length >= MAX_PETS
        ) {
            toast.error("You can select up to 6 pets only");
            return;
        }

        dispatch(togglePet(petId));
    };

    /* ---------------- Sync Counts from Selected Pets ---------------- */
    useEffect(() => {
        if (!allPets.length) return;

        const dog = allPets.filter(
            (p) => p.type === "dog" && selectedPetIds.includes(p.pet_id)
        ).length;

        const cat = allPets.filter(
            (p) => p.type === "cat" && selectedPetIds.includes(p.pet_id)
        ).length;

        dispatch(setPetCounts({ dog, cat, flag: true }));
    }, [selectedPetIds, allPets, dispatch]);

    /* ---------------- API ---------------- */
    useEffect(() => {
        let mounted = true;
        showLoader();

        dispatch(getPetList()).finally(() => {
            if (mounted) hideLoader();
        });

        return () => {
            mounted = false;
        };
    }, [dispatch]);

    useEffect(() => {
        if (!displayAddress?.address_id || !token) return;

        dispatch(getPetServiceType({
            address_id: displayAddress.address_id,
            booking_session_token: token
        }));
    }, [dispatch, displayAddress?.address_id, token]);

    useEffect(() => {
        if (!getPetServiceTypeApi || !allPets.length) return;

        selectedPetIds.forEach((id) => {
            const pet = allPets.find(p => p.pet_id === id);
            if (!pet) return;

            if (
                (pet.type === "dog" && isDogDisabled) ||
                (pet.type === "cat" && isCatDisabled)
            ) {
                dispatch(togglePet(id));
            }
        });
    }, [getPetServiceTypeApi, isDogDisabled, isCatDisabled, allPets]);

    /* ---------------- Counter Flow ---------------- */
    const updateCounts = (dog, cat) => {
        if (dog + cat > MAX_PETS) {
            toast.error("You can add up to 6 pets only");
            return;
        }

        dispatch(setPetCounts({ dog, cat, flag: true }));
    };

    const incrementDog = () => {
        if (isDogDisabled) return;
        updateCounts(dogCount + 1, catCount);
    };
    const decrementDog = () => updateCounts(Math.max(dogCount - 1, 0), catCount);

    const incrementCat = () => {
        if (isCatDisabled) return;
        updateCounts(dogCount, catCount + 1);
    };
    const decrementCat = () => updateCounts(dogCount, Math.max(catCount - 1, 0));

    const handleSubmit = async () => {
        showLoader();

        // CASE 1: Existing pets
        if (allPets.length > 0) {
            if (!selectedPetIds.length) {
                toast.error("Please select at least one pet");
                return;
            }

            try {
                const res = await dispatch(
                    SavePetServiceType({
                        address_id: displayAddress?.address_id,
                        book_pet_ids: selectedPetIds,
                        service_type: serviceType,
                        pet_type,
                        total_cats: catCount,
                        total_dogs: dogCount,
                        total_pets: totalPets,
                        booking_session_token: token,
                    })
                ).unwrap();

                // const [firstPetId] = selectedPetIds;
                // navigate(`/book/pet/${firstPetId}`);

                const petId = res?.[0] || selectedPetIdsfromAPI[0];

                if (petId) {
                    navigate(`/book/pet/${petId}`);
                }
            } catch (err) {
                toast.error(err?.message || "Something went wrong");
            }
            hideLoader();
            return;
        }

        // CASE 2: Counter flow (new pets)
        if (totalPets === 0) {
            toast.error("Please select at least one pet");
            return;
        }

        try {
            dispatch(
                initializePetFlow({
                    dog: petCounts.dog,
                    cat: petCounts.cat,
                })
            );

            navigate("/book/pet/details");
            hideLoader();
        } catch (err) {
            hideLoader();
            toast.error(err?.message || "Something went wrong");
        }
    };
    ;

    const isNextDisabled = allPets.length
        ? selectedPetIds.length === 0
        : totalPets === 0;

    /* ---------------- UI ---------------- */
    return (
        <>
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="flex items-center px-6 py-3">
                    <ChevronLeft
                        size={24}
                        className="text-primary-light cursor-pointer"
                        onClick={() => navigate(-1)}
                    />
                    <h1 className="flex-1 text-center font-filson font-bold text-xl text-primary-dark">
                        Service Type & Pets
                    </h1>
                </div>
            </div>

            {/* Address */}
            <div className="bg-white border-b px-4 py-2">
                <p className="text-sm text-primary-dark text-center truncate font-medium">
                    {displayAddress
                        ? `${displayAddress?.address1} ${displayAddress?.address2}, ${displayAddress?.city}, ${displayAddress?.state} ${displayAddress?.zip}`
                        : "No address selected"}
                </p>
            </div>

            {/* Content */}
            <div className="px-4 py-4 pb-32 flex flex-col gap-4 max-w-xl mx-auto">
                {/* Service Type */}
                <Card title="Service Type"
                    action={
                        <img src={infoGrey} alt="infoGrey" className="w-6 h-6 cursor-pointer" onClick={() => setServiceTypeModal(true)} />
                    }
                >
                    <ServiceOption
                        active={serviceType === SERVICE_TYPES.MOBILE}
                        disabled={isMobileDisabled}
                        onClick={() => {
                            if (isMobileDisabled) return;
                            dispatch(setServiceType(SERVICE_TYPES.MOBILE));
                        }}
                        icon={Mobilevan}
                        title="Mobile Van"
                        badge="POPULAR"
                        description="We come to you with our fully equipped van"
                    />

                    <ServiceOption
                        active={serviceType === SERVICE_TYPES.HOME}
                        disabled={isHomeDisabled}
                        onClick={() => {
                            if (isHomeDisabled) return;
                            dispatch(setServiceType(SERVICE_TYPES.HOME));
                        }}
                        icon={HomeIcon}
                        title="In-Home"
                        description="Groomer comes to your home"
                    />

                    {isMobileDisabled && isHomeDisabled && (
                        <div className="text-xs font-normal pt-2 text-brand">
                            No services are available in your area
                        </div>
                    )}
                </Card>

                {/* Pets */}
                {serviceType && (
                    allPets.length > 0 ? (
                        <>
                            <Card
                                title="Pet(s) Being Serviced"
                                action={canAddAnyPet &&
                                    <div
                                        className="flex items-center gap-1 text-[#3064A3] cursor-pointer"
                                        onClick={() => { AddPetModalOpen(true) }}
                                    >
                                        <PlusIcon size={22} />
                                        <span className="text-sm">Add</span>
                                    </div>
                                }
                            >
                                {allPets.map((pet) => {
                                    const isPetDisabled =
                                        (pet.type === "dog" && isDogDisabled) ||
                                        (pet.type === "cat" && isCatDisabled);

                                    return (
                                        <div
                                            key={pet.pet_id}
                                            className="flex justify-between items-center py-3 border-b border-[#E4E4E4] last:border-b-0 last:pb-0"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-sm">{pet.name}</span>
                                                    {((pet?.age && pet?.gender) || (pet.breed_name && pet.size_name)) && (
                                                        <img
                                                            src={infoGrey}
                                                            alt=""
                                                            className="w-5 h-5 cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedPet(pet);
                                                                setPetInfoModal(true);
                                                            }}
                                                        />
                                                    )}
                                                </div>

                                                <span className="text-sm">
                                                    {pet?.type === "cat"
                                                        ? "Cat"
                                                        : pet.breed_name && pet.size_name
                                                            ? `${pet.breed_name}, ${pet.size_name}`
                                                            : "Dog"}
                                                </span>
                                            </div>

                                            <Checkbox
                                                checked={selectedPetIds.includes(pet.pet_id)}
                                                disabled={isPetDisabled}
                                                onChange={() => {
                                                    if (isPetDisabled) return;
                                                    togglePetSelection(pet.pet_id);
                                                }}
                                                disableRipple
                                                sx={{
                                                    padding: 0,
                                                    color: "#7C868A",
                                                    "&.Mui-checked": {
                                                        color: "#FF314A",
                                                    },
                                                    "&:hover": {
                                                        backgroundColor: "transparent",
                                                    },
                                                    "&.Mui-focusVisible": {
                                                        outline: "none",
                                                    },
                                                }}
                                            />
                                        </div>
                                    )
                                })}
                            </Card>

                            {allPets?.length > 6 && <div className="text-sm">
                                Combine dogs and cats. Max up to 6 pets per booking
                            </div>}
                        </>
                    ) : (
                        <Card title="Who need grooming?">
                            <p className="text-sm">
                                Can add up to 6 pets (Dogs & Cats Combined)
                            </p>

                            <div className="w-full flex items-center gap-2 mt-4">
                                {/* Dogs */}
                                <div
                                    className="flex flex-col justify-center items-center gap-4 rounded-[10px] border border-primary-line bg-[#FBFCFC] w-full"
                                    style={{ padding: "15px 15px 0 15px" }}
                                >
                                    <div className="text-base font-bold">How many dogs?</div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={decrementDog}
                                            disabled={dogCount === 0}
                                            className={`w-[36px] h-[36px] rounded-[10px] border flex justify-center items-center
                        ${dogCount === 0
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-white text-primary-dark"
                                                }`}
                                        >
                                            <MinusIcon size={22} />
                                        </button>

                                        <span className="text-base w-[30px] text-center">
                                            {dogCount}
                                        </span>

                                        <button
                                            onClick={incrementDog}
                                            disabled={isDogDisabled || totalPets === MAX_PETS}
                                            className={`w-[36px] h-[36px] rounded-[10px] border flex justify-center items-center
                        ${totalPets === MAX_PETS
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-white text-primary-dark"
                                                }`}
                                        >
                                            <PlusIcon size={22} />
                                        </button>
                                    </div>

                                    <img src={EmptyDog} alt="Dog" className="w-[92px] h-[88px]" />
                                </div>

                                {/* Cats */}
                                <div
                                    className="flex flex-col justify-center items-center gap-4 rounded-[10px] border border-primary-line bg-[#FBFCFC] w-full"
                                    style={{ padding: "15px 15px 0 15px" }}
                                >
                                    <div className="text-base font-bold">How many cats?</div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={decrementCat}
                                            disabled={catCount === 0}
                                            className={`w-[36px] h-[36px] rounded-[10px] border flex justify-center items-center
                        ${catCount === 0
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-white text-primary-dark"
                                                }`}
                                        >
                                            <MinusIcon size={22} />
                                        </button>

                                        <span className="text-base w-[30px] text-center">
                                            {catCount}
                                        </span>

                                        <button
                                            onClick={incrementCat}
                                            disabled={isCatDisabled || totalPets === MAX_PETS}
                                            className={`w-[36px] h-[36px] rounded-[10px] border flex justify-center items-center
                        ${totalPets === MAX_PETS
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-white text-primary-dark"
                                                }`}
                                        >
                                            <PlusIcon size={22} />
                                        </button>
                                    </div>

                                    <img src={EmptyCat} alt="Cat" className="w-[92px] h-[88px]" />
                                </div>
                            </div>
                        </Card>
                    )
                )}
            </div>

            {/* Footer */}
            <BookingFooter
                onClick={handleSubmit}
                disabled={isNextDisabled}
            />

            {/* Modals */}
            <ServiceTypeInfo
                open={serviceTypeModal}
                onClose={() => setServiceTypeModal(false)}
            />
            <PetInfo
                open={petInfoModal}
                onClose={() => setPetInfoModal(false)}
                selectedPet={selectedPet}
            />
            <AddPetModal
                open={addPetModalOpen}
                onClose={() => AddPetModalOpen(false)}
            />
        </>
    );
};

/* ================= Reusable UI ================= */

const ServiceOption = ({ active, onClick, disabled, icon, title, badge, description }) => (
    <div
        onClick={onClick}
        className={`flex gap-3 items-center p-3 rounded-xl border  transition
      ${disabled ? "bg-[#F2F2F2] border-primary-light cursor-not-allowed" : active
                ? "border-brand cursor-pointer"
                : "border-primary-light cursor-pointer"
            }`}
    >
        <div className="bg-[#F2F2F2] rounded-lg w-9 h-9 flex items-center justify-center">
            <img src={icon} alt="" className="w-5 h-5" />
        </div>

        <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
                <span className={`text-sm font-bold`}>{title}</span>
                {badge && (
                    <span className="text-[10px] px-2 py-[2px] bg-[#9449CE] text-white rounded-full font-bold">
                        {badge}
                    </span>
                )}
            </div>
            <span className="text-xs">{description}</span>
        </div>
    </div>
);

export default ServiceTypePets;
