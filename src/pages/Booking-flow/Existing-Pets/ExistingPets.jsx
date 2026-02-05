import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Card from '@/common/Booking-Flow/Card';
import { Checkbox } from '@mui/material';
import { ChevronLeft, PlusIcon } from 'lucide-react';

import infoGrey from "../../../assets/icon/info-circle-grey.svg";
import PetInfo from '@/components/Modals/PetInfo';
import AddPetModal from '@/components/Modals/AddPetModal';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { moveToNextPet, SavePetServiceType, setPetCounts, toggleExistingPetSelection, togglePet } from '@/utils/store/slices/booking-flow/bookingFlowSlice';

const ExistingPets = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [petInfoModal, setPetInfoModal] = useState(false);
    const [addPetModalOpen, setAddPetModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState(null);

    const {
        dogPets = [],
        catPets = [],
    } = useSelector((state) => state.pets?.pets || {});

    const bookingFlow = useSelector((state) => state.bookingFlow);
    const token = useSelector((state) => state.auth.unique_token);

    const { serviceType, petCounts = { dog: 0, cat: 0 }, bookingAddress, petsDraft, selectedPetIds = [], selectedNewPetIdsExisting = [] } = bookingFlow;

    const pets = petsDraft || [];

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

    const displayAddress = useMemo(() => {
        return bookingAddress || null;
    }, [bookingAddress]);

    const allPets = useMemo(
        () => [...dogPets, ...catPets],
        [dogPets, catPets]
    );

    const filteredPets = useMemo(() => {
        const usedIds = new Set(
            pets
                .map(p => p?.petId)
                .filter(Boolean)
        );

        return allPets.filter(
            pet => !usedIds.has(pet.pet_id)
        );
    }, [allPets, pets]);

    const togglePetSelection = (petId) => {
        const pet = filteredPets.find(p => p.pet_id === petId);
        if (!pet) return;

        const isRemoving = selectedPetIds.includes(petId);

        // 🔹 Update Redux pet list
        dispatch(toggleExistingPetSelection(petId));

        // 🔹 Increment / decrement counts
        dispatch(
            setPetCounts({
                dog: pet.type === "dog" ? (isRemoving ? -1 : 1) : 0,
                cat: pet.type === "cat" ? (isRemoving ? -1 : 1) : 0,
            })
        );
    };

    const handleSubmit = async () => {
        // 🔒 Max pets guard
        if (selectedPetIds.length > 6) {
            toast.error("We are allowing 6 pets for now");
            return;
        }

        // 🔒 Must select at least one NEW pet on this screen
        if (allPets.length > 0 && selectedNewPetIdsExisting.length === 0) {
            toast.error("Please select at least one pet");
            return;
        }

        // 🔍 Already processed pets
        const processedPetIds = new Set(
            petsDraft.map(p => p.petId).filter(Boolean)
        );

        // 👉 First newly selected pet not yet processed
        const nextPetId = selectedNewPetIdsExisting.find(
            id => !processedPetIds.has(id)
        );

        if (!nextPetId) {
            toast.error("Something went wrong. Please try again.");
            return;
        }

        try {
            const res = await dispatch(
                SavePetServiceType({
                    address_id: displayAddress?.address_id,
                    book_pet_ids: selectedNewPetIdsExisting,
                    service_type: serviceType,
                    pet_type,
                    total_cats: catCount,
                    total_dogs: dogCount,
                    total_pets: totalPets,
                    booking_session_token: token,
                })
            ).unwrap();

            const petId = res?.[0];

            console.log(petId);

            if (petId) {
                navigate(`/book/pet/${petId}`);
            }

            // ✅ Move booking flow forward
            dispatch(
                moveToNextPet({
                    petIndex: petsDraft.length,
                })
            );

            // 🔜 Optional navigation
            // navigate(`/book/pet/${nextPetId}`);
        } catch (error) {
            console.error("SavePetServiceType failed", error);
            toast.error("Unable to save pets. Please try again.");
        }
    };

    const filteredPetTypeMap = useMemo(() => {
        const map = new Map();
        filteredPets.forEach(pet => {
            map.set(pet.pet_id, pet.type);
        });
        return map;
    }, [filteredPets]);

    const cleanupInvalidSelectedPets = () => {
        if (!selectedPetIds.length || !filteredPets.length) return;

        let dogRemove = 0;
        let catRemove = 0;

        selectedPetIds.forEach((id) => {
            // ❌ INVALID: selected BUT present again in filtered list
            if (filteredPetTypeMap.has(id)) {
                const petType = filteredPetTypeMap.get(id);

                if (petType === "dog") dogRemove += 1;
                if (petType === "cat") catRemove += 1;

                // remove from selected list
                // dispatch(togglePet(id));
                // dispatch(toggleNewPetExisting(id));

                dispatch(toggleExistingPetSelection(id));

                console.log(id);
                console.log(dogRemove);
                console.log(catRemove);

            }
        });

        if (dogRemove || catRemove) {
            dispatch(
                setPetCounts({
                    dog: -dogRemove,
                    cat: -catRemove,
                })
            );
        }
    };


    return (
        <>
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="flex items-center px-6 py-3 justify-between">
                    <ChevronLeft
                        size={24}
                        className="cursor-pointer"
                        onClick={() => {
                            cleanupInvalidSelectedPets();
                            navigate(-1);
                        }}
                    />
                    <h1 className="font-bold text-xl">
                        Add Pet To Service
                    </h1>
                    <PlusIcon
                        size={24}
                        className="cursor-pointer"
                        onClick={() => setAddPetModalOpen(true)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-4 pb-32 max-w-md mx-auto flex flex-col gap-2">
                <Card>
                    {filteredPets.map((pet) => {
                        const isChecked = selectedPetIds.includes(pet.pet_id);
                        const isDisabled = selectedPetIds.length >= 6 && !isChecked;

                        return (
                            <div
                                key={pet.pet_id}
                                onClick={() => {
                                    if (!isDisabled) togglePetSelection(pet.pet_id);
                                }}
                                className="flex justify-between items-center py-3 first:pt-0 border-b border-[#E4E4E4] last:pb-0 last:border-b-0 cursor-pointer"
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold text-sm">
                                            {pet.name}
                                        </span>

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

                                    <span className="text-sm text-gray-600">
                                        {pet.type === "cat"
                                            ? "Cat"
                                            : pet.breed_name && pet.size_name
                                                ? `${pet.breed_name}, ${pet.size_name}`
                                                : "Dog"}
                                    </span>
                                </div>

                                <Checkbox
                                    checked={isChecked}
                                    disabled={isDisabled}
                                    disableRipple
                                    sx={{
                                        padding: 0,
                                        color: "#7C868A",

                                        "&.Mui-checked": {
                                            color: "#FF314A",
                                        },

                                        /* 👇 THIS targets the input */
                                        "& input": {
                                            cursor: isDisabled ? "not-allowed" : "pointer",
                                            color: isDisabled && "#C4C4C4",
                                        },

                                        /* optional: keep icon cursor in sync */
                                        "& .MuiSvgIcon-root": {
                                            cursor: isDisabled ? "not-allowed" : "pointer",
                                        },
                                    }}
                                />
                            </div>
                        );
                    })}
                </Card>

                {selectedPetIds.length >= 6 ? (
                    <p className="text-sm mt-2 text-brand">
                        You’ve reached the maximum of 6 pets for this booking.
                    </p>
                ) : (
                    <p className="text-sm mt-2">
                        Combine dogs and cats. Max up to 6 pets per booking
                    </p>
                )}
                <p className="text-[10px]">
                    *Adding pets may impact the pricing for your existing selections.
                </p>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 w-full left-0 bg-white z-10"
                style={{
                    boxShadow: "0 0 30px rgba(0,0,0,0.10)",
                    padding: "15px 20px 25px",
                }}>
                <div className="flex justify-center items-center">
                    <button
                        onClick={handleSubmit}
                        className={`w-[390px] h-[50px] rounded-[10px] font-bold transition text-white   bg-primary-dark`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Modals */}
            <PetInfo
                open={petInfoModal}
                onClose={() => setPetInfoModal(false)}
                selectedPet={selectedPet}
            />

            <AddPetModal
                open={addPetModalOpen}
                onClose={() => setAddPetModalOpen(false)}
                description={"*Adding pets may impact the pricing for your existing selections."}
            />
        </>
    );
};

export default ExistingPets;
