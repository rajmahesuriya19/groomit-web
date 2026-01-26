import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { addUpdatePet, getBookingPetBreeds, getPetProfileID } from '@/utils/store/slices/petList/petListSlice';

import BreedModal from '@/components/Modals/BreedModal';
import StepAccordion from '@/components/StepAccordion';
import { StepOneContentDog } from '@/components/Booking-flow-Steps/StepOneContentDog';
import StepTwoContent from '@/components/Booking-flow-Steps/StepTwoContent';
import StepThreeContent from '@/components/Booking-flow-Steps/StepThreeContent';
import StepFourContent from '@/components/Booking-flow-Steps/StepFourContent';
import { StepOneContentCat } from '@/components/Booking-flow-Steps/StepOneContentCat';
import { normalizeDOB } from '@/pages/my-pets/add-update-cat/AddUpdateCat2';
import { useLoader } from '@/contexts/loaderContext/LoaderContext';
import { toast } from 'react-toastify';
import { clearBookingFlow, completePetStep, moveToNextPet, setPetID, updatePetStepData } from '@/utils/store/slices/booking-flow/bookingFlowSlice';
import CancelBookingFlowModal from '@/components/Modals/CancelBookingFlowModal';
import BookingFooter from '../BookingFooter';

/* ---------------- Schema ---------------- */
const dogSchema = yup.object({
    name: yup.string().required('Pet Name is required'),
    date_of_birth: yup.string().required('Age is required'),
    gender: yup.string().required('Gender is required'),
    breed_id: yup.string().required('Breed is required'),
    size_id: yup.string().required('Size is required'),
});

const catSchema = yup.object({
    name: yup.string().required('Pet Name is required'),
    date_of_birth: yup.string().required('Age is required'),
    gender: yup.string().required('Gender is required'),
});

const STEP_KEY_TO_ID = {
    details: 1,
    package: 2,
    grooming: 3,
    addons: 4,
};

const STEP_ORDER = ["details", "package", "grooming", "addons"];

const PetsDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { id } = useParams()
    const isEdit = Boolean(id)
    const { showLoader, hideLoader } = useLoader();

    const hasHydratedRef = React.useRef(false);

    /* ---------------- State ---------------- */
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [openStep, setOpenStep] = useState(1);

    const [breedModalOpen, setBreedModalOpen] = useState(false);
    const [breedListModalOpen, setBreedListModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBreedName, setSelectedBreedName] = useState('');
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [cancelBookingFlow, SetCancelBookingFlow] = useState(false);

    const token = useSelector((state) => state.auth.unique_token);
    const { petBreeds } = useSelector((state) => state.pets);
    const bookingFlow = useSelector((state) => state.bookingFlow);
    const selectedPet = useSelector(
        (state) => state.pets?.selectedPet?.pet ?? null
    );
    const {
        dogPets = [],
        catPets = []
    } = useSelector((state) => state.pets.pets || {});

    const allPets = [...dogPets, ...catPets];

    const {
        selectedPetIds,
        serviceType,
        currentPetIndex,
        petsDraft,
        petCounts = { dog: 0, cat: 0 },
        address: bookingAddress,
        totalPrice
    } = bookingFlow;

    const currentPetType = petCounts.dog > 0 ? 'dog' : 'cat';
    const currentPetDraft = petsDraft[currentPetIndex];

    const addons =
        useSelector(
            (state) =>
                state.bookingFlow.petsDraft[currentPetIndex]?.stepData?.addons
                    ?.items
        ) || [];

    const shouldMarkDirty = location.pathname.includes("/from_pets");

    /* ---------------- Form ---------------- */
    const schema = useMemo(() => {
        return currentPetType === "dog" ? dogSchema : catSchema;
    }, [currentPetType]);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const selectedGender = watch('gender');
    const selectedSize = watch('size_id');

    /* ---------------- Effects ---------------- */
    useEffect(() => {
        dispatch(
            getBookingPetBreeds({
                bookingId: 17600,
                booking_session_token: 'booking_session_6888c7d65d91b1.59307650',
                // booking_session_token: token,
            })
        );
    }, [dispatch]);

    const dateOfBirth = watch("date_of_birth");

    useEffect(() => {
        if (!dateOfBirth) return;

        const dobDate = new Date(dateOfBirth);
        const now = new Date();

        const diffMonths =
            (now.getFullYear() - dobDate.getFullYear()) * 12 +
            (now.getMonth() - dobDate.getMonth());

        if (diffMonths < 3) {
            toast.error("Pets must be a minimum of 3 months old for grooming.");
        }
    }, [dateOfBirth]);

    // useEffect(() => {
    //     if (!currentPetDraft?.stepData?.details) return;
    //     console.log("first");

    //     const details = currentPetDraft.stepData.details;

    //     if (!Object.keys(details).length) return;

    //     // 🐶🐱 Set form values
    //     Object.entries(details).forEach(([key, value]) => {
    //         setValue(key, value, { shouldDirty: false });
    //     });

    //     // 🧬 Auto-set breed name (DOG ONLY)
    //     if ((details.breed_id || details?.breed?.breed_id) && petBreeds?.length) {
    //         const foundBreed = petBreeds.find(
    //             (b) => (b.breed_id?.toString() === details.breed_id?.toString()) || (b.breed_id?.toString() === details?.breed?.breed_id?.toString())
    //         );

    //         if (foundBreed) {
    //             setSelectedBreedName(foundBreed.breed_name);
    //         }
    //     }
    // }, [
    //     currentPetIndex,
    //     currentPetDraft,
    //     petBreeds,
    //     setValue,
    // ]);

    // 🐾 Fetch pet profile in EDIT mode
    useEffect(() => {
        if (!isEdit || !id) return;

        showLoader();

        dispatch(getPetProfileID(id))
            .finally(() => {
                hideLoader();
            });
    }, [isEdit, id, dispatch]);

    // 🐾 EDIT MODE — hydrate Redux + Form
    useEffect(() => {
        if (!isEdit || !selectedPet) return;

        // if (currentPetDraft?.stepData?.details) return;

        console.log("second");

        const detailsPayload = {
            name: selectedPet.name,
            gender: selectedPet.gender,
            date_of_birth: selectedPet.date_of_birth,
            petType: selectedPet.pet_type,
        };

        if (selectedPet.pet_type === "dog") {
            detailsPayload.breed_id = selectedPet.breed_id;
            detailsPayload.size_id = selectedPet.size_id;
        }

        const existingPet = allPets.find((pet) => pet?.pet_id == id);

        /* -----------------------------------
            3️⃣ Merge backend pet + form data
        ----------------------------------- */
        const finalPetObject = {
            ...(existingPet || {}),
            ...detailsPayload,
        };

        console.log(finalPetObject);


        /* ---------------- Redux ---------------- */
        dispatch(
            updatePetStepData({
                petIndex: currentPetIndex,
                step: "details",
                data: finalPetObject,
            })
        );

        /* ---------------- React Hook Form ---------------- */
        Object.entries(detailsPayload).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                setValue(key, value, { shouldDirty: false });
            }
        });

        /* ---------------- Breed name (DOG only) ---------------- */
        if (
            selectedPet.pet_type === "dog" &&
            selectedPet.breed_id &&
            petBreeds?.length
        ) {
            const foundBreed = petBreeds.find(
                (b) => b.breed_id?.toString() === selectedPet.breed_id?.toString()
            );

            if (foundBreed) {
                setSelectedBreedName(foundBreed.breed_name);
            }
        }
    }, [
        isEdit,
        selectedPet,
        currentPetIndex,
        petBreeds,
        dispatch,
        setValue,
    ]);

    useEffect(() => {
        if (!currentPetDraft?.completedSteps) return;

        const reduxCompleted = currentPetDraft.completedSteps;
        const completedStepIds = reduxCompleted
            .map((key) => STEP_KEY_TO_ID[key])
            .filter(Boolean);

        // setCompletedSteps(completedStepIds);

        if (hasHydratedRef.current) return;
        hasHydratedRef.current = true;

        // ✅ EDIT MODE: force Step 1 only
        if (shouldMarkDirty) {
            setCurrentStep(1);
            setOpenStep(1);
            setCompletedSteps(completedStepIds);
            return;
        }

        //  NORMAL FLOW
        const nextStepKey = STEP_ORDER.find(
            (step) => !reduxCompleted.includes(step)
        );

        const nextStepId = nextStepKey
            ? STEP_KEY_TO_ID[nextStepKey]
            : completedStepIds.length + 1;

        setCurrentStep(nextStepId);
        setOpenStep(nextStepId);
        setCompletedSteps(completedStepIds);
    }, [currentPetIndex]);

    /* ---------------- Derived ---------------- */

    /* ---------------- Default Address ---------------- */
    const displayAddress = useMemo(() => {
        return bookingAddress || null;
    }, [bookingAddress]);

    const filteredBreeds = useMemo(() => {
        if (!searchTerm) return petBreeds;
        return petBreeds.filter((b) =>
            b.breed_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, petBreeds]);

    const completeStepAndMove = (step) => {
        console.log(step, "step ==> ");

        setCompletedSteps((prev) => {
            if (prev.includes(step)) return prev;
            return [...prev, step];
        });

        const completedSet = new Set([...completedSteps, step]);

        // find next INCOMPLETE step
        const nextIncompleteStep = STEP_ORDER
            .map((key) => STEP_KEY_TO_ID[key])
            .find((stepId) => !completedSet.has(stepId));

        // ✅ If no next step OR all future steps already completed
        if (!nextIncompleteStep) {
            // just close accordion
            setOpenStep(null);
            return;
        }

        // ✅ Move ONLY to next incomplete step
        setCurrentStep(nextIncompleteStep);
        setOpenStep(nextIncompleteStep);
    };

    /* ---------------- Submit Handlers ---------------- */
    const handleStepOne = async (formData) => {
        console.log(formData);

        /* -------------------------
            Age validation (3 months)
        -------------------------- */
        if (formData.date_of_birth) {
            const dob = normalizeDOB(formData.date_of_birth);
            const dobDate = new Date(dob);
            const now = new Date();

            const diffMonths =
                (now.getFullYear() - dobDate.getFullYear()) * 12 +
                (now.getMonth() - dobDate.getMonth());

            if (diffMonths < 3) {
                toast.error("Pets must be a minimum of 3 months old for grooming.");
                return;
            }
        }

        showLoader();

        const normalizedPayload = {
            ...formData,
            petType: currentPetType === "dog" ? "dog" : "cat",
            pet_id: isEdit ? id : undefined,
            gender: formData.gender?.toUpperCase() === "M" ? "M" : "F",
            date_of_birth: normalizeDOB(formData.date_of_birth),
        };

        try {
            /* -----------------------------------
                1️⃣ Update backend if needed
            ----------------------------------- */
            console.log(isDirty);

            if (!isEdit || isDirty) {
                await dispatch(addUpdatePet(normalizedPayload)).unwrap();
                await dispatch(getPetProfileID(id)).unwrap();
            }

            /* -----------------------------------
                2️⃣ Find FULL pet object by ID
            ----------------------------------- */
            const existingPet = allPets.find((pet) => pet?.pet_id == id);

            /* -----------------------------------
                3️⃣ Merge backend pet + form data
            ----------------------------------- */
            const finalPetObject = {
                ...(existingPet || {}),
                ...normalizedPayload,
            };

            /* -----------------------------------
                4️⃣ Store FULL object in booking flow
            ----------------------------------- */
            dispatch(
                setPetID({
                    petIndex: currentPetIndex,
                    petId: +finalPetObject?.pet_id,
                })
            );

            dispatch(
                updatePetStepData({
                    petIndex: currentPetIndex,
                    step: "details",
                    data: finalPetObject,
                })
            );

            if (!currentPetDraft?.completedSteps?.includes("details")) {
                dispatch(
                    completePetStep({
                        petIndex: currentPetIndex,
                        step: "details",
                    })
                );
            }

            // ✅ EDIT MODE: save & go back to pets list
            if (shouldMarkDirty) {
                // mark local step as completed & move forward
                completeStepAndMove(1);
                navigate("/book/pets");

                return;
            }

            // NORMAL FLOW
            completeStepAndMove(1);
        } finally {
            hideLoader();
        }
    };

    const handleStepTwo = () => {
        const pkg = currentPetDraft?.stepData?.package

        if (!pkg?.id) {
            toast.error("Please select a package")
            return
        }

        if (!currentPetDraft?.completedSteps?.includes("package")) {
            dispatch(
                completePetStep({
                    petIndex: currentPetIndex,
                    step: "package",
                })
            );
        }

        // ✅ EDIT MODE: save & go back to pets list
        if (shouldMarkDirty) {
            // mark local step as completed & move forward
            completeStepAndMove(2);
            navigate("/book/pets");

            return;
        }

        completeStepAndMove(2)
    }

    const handleStepThree = () => {
        const grooming =
            currentPetDraft?.stepData?.grooming;

        // optional validation
        if (!grooming?.condition || !grooming?.behavior) {
            toast.error("Please complete grooming details");
            return;
        }

        if (!currentPetDraft?.completedSteps?.includes("grooming")) {
            dispatch(
                completePetStep({
                    petIndex: currentPetIndex,
                    step: "grooming",
                })
            );
        }

        // ✅ EDIT MODE: save & go back to pets list
        if (shouldMarkDirty) {
            // mark local step as completed & move forward
            completeStepAndMove(3);
            navigate("/book/pets");

            return;
        }

        completeStepAndMove(3);
    };

    const handleStepFour = () => {
        if (!currentPetDraft?.completedSteps?.includes("addons")) {
            dispatch(
                completePetStep({
                    petIndex: currentPetIndex,
                    step: "addons",
                })
            );
        }

        // ✅ EDIT MODE: save & go back to pets list
        if (shouldMarkDirty) {
            // mark local step as completed & move forward
            navigate("/book/pets");

            return;
        }

        const isLastPet =
            currentPetIndex === selectedPetIds.length - 1;

        // 🐾 MOVE TO NEXT PET
        if (!isLastPet) {
            const nextPetIndex = currentPetIndex + 1;
            const nextPetId = selectedPetIds[nextPetIndex];

            // ensure fresh draft FIRST
            dispatch(moveToNextPet({
                petIndex: currentPetIndex + 1,
            }));


            // 🔄 reset UI state for next pet
            setCompletedSteps([]);
            setCurrentStep(1);
            setOpenStep(1);
            reset();

            // 🚀 navigate to next pet URL
            navigate(`/book/pet/${nextPetId}`);

            return;
        }

        // ✅ ALL PETS DONE
        navigate("/book/pets");
    };

    const allStepsCompleted = completedSteps.length === STEP_ORDER.length;

    const handleFooterAction = () => {
        // ✅ If everything is done, move forward
        // if (allStepsCompleted) {
        //     navigate("/book/pets");
        //     // This is bug line please track
        //     return;
        // }

        if (shouldMarkDirty && openStep === 1 && !isDirty) {
            toast.info("No changes to save");
            return;
        }

        switch (openStep) {
            case 1:
                handleSubmit(handleStepOne)();
                break;
            case 2:
                handleStepTwo();
                break;
            case 3:
                handleStepThree();
                break;
            case 4:
                handleStepFour();
                break;
            default:
                // 👇 fallback: open next incomplete step
                const nextIncompleteStep = STEP_ORDER
                    .map((key) => STEP_KEY_TO_ID[key])
                    .find((stepId) => !completedSteps.includes(stepId));

                if (nextIncompleteStep) {
                    setOpenStep(nextIncompleteStep);
                }
                break;
        }
    };

    const stepOneHeader = useMemo(() => {
        const details = currentPetDraft?.stepData?.details;
        if (!details || !completedSteps.includes(1)) {
            return {
                title: "Pet’s Details",
                description: "",
            };
        }

        const petName = details.name || "Pet";

        let descriptionParts = [];

        // 🐶 DOG
        if (details.petType === "dog") {
            const breed = petBreeds.find(
                (b) => b.breed_id?.toString() === details.breed_id?.toString()
            );

            if (breed?.breed_name) {
                descriptionParts.push(breed.breed_name);
            }

            if (details.size_id) {
                const DOG_SIZE_MAP = {
                    2: "Small",
                    3: "Medium",
                    4: "Large",
                    5: "Extra Large",
                    6: "Double Extra Large",
                };

                if (details.size_id) {
                    const sizeLabel = DOG_SIZE_MAP[details.size_id];
                    if (sizeLabel) {
                        descriptionParts.push(sizeLabel);
                    }
                }
            }
        }

        // 🐱 CAT
        if (details.petType === "cat") {
            descriptionParts.push("Cat");
        }

        return {
            title: `${petName}’s Details`,
            description: descriptionParts.join(", "),
        };
    }, [currentPetDraft, completedSteps, petBreeds]);

    const stepTwoHeader = useMemo(() => {
        const pkg = currentPetDraft?.stepData?.package;

        if (!pkg?.id) {
            return { title: "Package", description: "" };
        }

        let desc = `${pkg.name} - ${pkg.title} `;

        if (pkg.type === "recurring" && pkg.recurringConfig?.frequency) {
            desc += `(Every ${pkg.recurringConfig.frequency} weeks)`;
        }

        return { title: "Package", description: desc };
    }, [currentPetDraft]);

    const stepThreeDesc = useMemo(() => {
        if (!completedSteps.includes(3)) return "";

        const g = currentPetDraft?.stepData?.grooming;
        if (!g) return "";

        const parts = [g.condition, g.behavior].filter(Boolean);

        return parts.join(", ");
    }, [currentPetDraft, completedSteps]);

    const stepFourDescription = (() => {
        if (addons.length === 0) return "";

        const names = addons
            .map(a => a?.name)
            .filter(Boolean);

        if (names.length <= 3) {
            return names.join(", ");
        }

        const visible = names.slice(0, 3).join(", ");
        const remaining = names.length - 3;

        return `${visible} + ${remaining} more`;
    })();

    const canOpenStep = (stepId) =>
        stepId <= currentStep || completedSteps.includes(stepId);

    const shouldRenderStep = (stepId) =>
        shouldMarkDirty || currentStep >= stepId;

    /* ---------------- Render ---------------- */

    return (
        <>
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-20">
                <div className="flex items-center px-6 py-3">
                    <ChevronLeft
                        size={24}
                        className="cursor-pointer"
                        onClick={() => {
                            SetCancelBookingFlow(true);
                        }}
                    />
                    <h1 className="flex-1 text-center font-bold text-xl">
                        Pet’s Details
                    </h1>
                </div>
            </div>

            {/* Address */}
            <div className="bg-white border-b px-4 py-2">
                <p className="text-sm text-primary-dark text-center truncate font-medium">
                    <span className='font-bold capitalize'>{serviceType?.toLowerCase()} |{" "}</span>
                    {displayAddress
                        ? `${displayAddress.address1} ${displayAddress.address2}, ${displayAddress.city}, ${displayAddress.state} ${displayAddress.zip}`
                        : "No address selected"}
                </p>
            </div>

            {/* Content */}
            <div className="px-4 py-4 pb-32 max-w-xl mx-auto flex flex-col gap-4">

                {/* STEP 1 */}
                {/* {currentStep >= 1 && ( */}
                {shouldRenderStep(1) && (
                    <StepAccordion
                        stepId={1}
                        openStep={openStep}
                        onToggle={(step) => {
                            if (openStep === step) {
                                setOpenStep(null);
                            } else if (canOpenStep(step)) {
                                setOpenStep(step);
                            }
                        }}
                        title={stepOneHeader.title}
                        description={stepOneHeader.description}
                        showSuccess={completedSteps.includes(1)}
                    >
                        <form onSubmit={handleSubmit(handleStepOne)}>
                            {currentPetType === "dog" ? (<StepOneContentDog
                                showSuccess={completedSteps.includes(1)}
                                register={register}
                                errors={errors}
                                control={control}
                                watch={watch}
                                isDirty={isDirty}
                                setValue={setValue}
                                selectedGender={selectedGender}
                                selectedSize={selectedSize}
                                selectedBreedName={selectedBreedName}
                                setBreedListModalOpen={setBreedListModalOpen}
                                breedListModalOpen={breedListModalOpen}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                filteredBreeds={filteredBreeds}
                                setSelectedBreedName={setSelectedBreedName}
                                setGenderDropdownOpen={setGenderDropdownOpen}
                                genderDropdownOpen={genderDropdownOpen}
                            />) : (
                                <StepOneContentCat
                                    showSuccess={completedSteps.includes(1)}
                                    register={register}
                                    errors={errors}
                                    isDirty={isDirty}
                                    control={control}
                                    setValue={setValue}
                                    selectedGender={selectedGender}
                                    setGenderDropdownOpen={setGenderDropdownOpen}
                                    genderDropdownOpen={genderDropdownOpen}
                                ></StepOneContentCat>
                            )}
                        </form>
                    </StepAccordion>
                )}

                {/* STEP 2 */}
                {/* {currentStep >= 2 && ( */}
                {shouldRenderStep(2) && (
                    <StepAccordion
                        stepId={2}
                        openStep={openStep}
                        onToggle={(step) => {
                            if (openStep === step) {
                                setOpenStep(null);
                            } else if (canOpenStep(step)) {
                                setOpenStep(step);
                            }
                        }}
                        title={stepTwoHeader.title}
                        description={stepTwoHeader.description}
                        showSuccess={completedSteps.includes(2)}
                    >
                        <StepTwoContent showSuccess={completedSteps.includes(2)} />
                    </StepAccordion>
                )}

                {/* STEP 3 */}
                {/* {currentStep >= 3 && ( */}
                {shouldRenderStep(3) && (
                    <StepAccordion
                        stepId={3}
                        openStep={openStep}
                        onToggle={(step) => {
                            if (openStep === step) {
                                setOpenStep(null);
                            } else if (canOpenStep(step)) {
                                setOpenStep(step);
                            }
                        }}
                        title='Grooming Details'
                        description={stepThreeDesc ? stepThreeDesc : ''}
                        showSuccess={completedSteps.includes(3)}
                    >
                        <StepThreeContent showSuccess={completedSteps.includes(3)} />
                    </StepAccordion>
                )}

                {/* STEP 4 */}
                {/* {currentStep >= 4 && ( */}
                {shouldRenderStep(4) && (
                    <StepAccordion
                        stepId={4}
                        openStep={openStep}
                        onToggle={(step) => {
                            if (openStep === step) {
                                setOpenStep(null);
                            } else if (canOpenStep(step)) {
                                setOpenStep(step);
                            }
                        }}
                        title="Add-ons"
                        description={stepFourDescription}
                        showSuccess={completedSteps.includes(4)}
                    >
                        <StepFourContent showSuccess={completedSteps.includes(4)} />
                    </StepAccordion>
                )}
            </div>

            {/* Footer */}
            {/* {currentStep <= 1 ? ( */}
            {openStep === 1 ? (
                <BookingFooter onClick={handleFooterAction} />
            ) : (
                <div
                    className="fixed bottom-0 left-0 w-full bg-white z-20"
                    style={{
                        boxShadow: "0 -8px 30px rgba(0,0,0,0.12)",
                        padding: "16px 20px 24px",
                    }}
                >
                    <div className="max-w-md mx-auto flex items-center justify-between">
                        {/* PRICE */}
                        <div className="flex flex-col gap-2">
                            <span className="text-2xl font-bold text-primary-dark underline cursor-pointer" onClick={() => setOpenPriceTotalModal(true)}>
                                ${totalPrice || 0}
                            </span>
                            <span className="text-[10px] text-primary-dark">
                                Fees & Taxes Included
                            </span>
                        </div>

                        {/* CTA */}
                        <button
                            onClick={handleFooterAction}
                            className="h-[52px] rounded-[10px] font-bold text-white bg-primary-dark active:scale-[0.98] transition w-[236px]"
                        >
                            {allStepsCompleted ? "Continue" : "Next"}
                        </button>
                    </div>
                </div>
            )}

            <BreedModal
                open={breedModalOpen}
                onClose={() => setBreedModalOpen(false)}
                onConfirm={() => setBreedModalOpen(false)}
                title="Mixed breed selected"
                decription="Select the primary breed to help our groomer prepare"
            />
            <CancelBookingFlowModal
                open={cancelBookingFlow}
                onClose={() => SetCancelBookingFlow(false)}
                onConfirm={() => {
                    dispatch(clearBookingFlow());
                    SetCancelBookingFlow(false);
                    navigate("/book/service-address");
                }}
            />
        </>
    );
};

export default PetsDetails;
