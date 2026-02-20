import axiosInstance from "@/services/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Fetch pet breeds for booking
export const getBookingPetBreeds = createAsyncThunk(
    'bookingFlow/getBookingPetBreeds',
    async ({ pet_type, booking_session_token }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/pet/get`,
                {
                    pet_type,
                    booking_session_token
                }
            );

            // Only return pet_breeds
            return data?.data?.pet_breeds || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

// Fetch pet breeds size from breed_id for booking
export const getBookingPetSizes = createAsyncThunk(
    'bookingFlow/getBookingPetSizes',
    async ({ breed_id, booking_session_token }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/pet/breed-sizes/get`,
                {
                    breed_id,
                    booking_session_token
                }
            );

            // Only return pet_breeds
            return data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

// Get Pet Service Type
export const getPetServiceType = createAsyncThunk(
    'bookingFlow/getPetServiceType',
    async ({ address_id, booking_session_token }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/service_type/get`,
                {
                    address_id,
                    booking_session_token
                }
            );

            // Only return pet_breeds
            return data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

// Save Pet Service Type
export const SavePetServiceType = createAsyncThunk(
    'bookingFlow/SavePetServiceType',
    async ({
        address_id,
        book_pet_ids,
        pet_type,
        service_type,
        total_cats,
        total_dogs,
        total_pets,
        booking_session_token
    }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/service_type/save`,
                {
                    address_id,
                    book_pet_ids,
                    pet_type,
                    service_type,
                    total_cats,
                    total_dogs,
                    total_pets,
                    booking_session_token
                }
            );

            // Only return pet_breeds
            return data?.bookingSessionPetId || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

// Fetch pet profile by Generated ID
export const getPetProfileGeneratedID = createAsyncThunk(
    'bookingFlow/getPetProfileGeneratedID',
    async ({ petId, booking_session_token }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/pet/get/${petId}`,
                { booking_session_token }
            );

            return data.data || {};
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch pet profile' });
        }
    }
);

// Get Package Details
export const getPackageDetails = createAsyncThunk(
    'bookingFlow/getPackageDetails',
    async ({ id, breed_id, size_id, pet_type, booking_session_token }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/pet/package/get/${id}`,
                { breed_id, size_id, pet_type, booking_session_token }
            );

            // Only return pet_breeds
            return data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

// Save Package Details
export const savePackageDetails = createAsyncThunk(
    'bookingFlow/savePackageDetails',
    async ({ pet_id, package_product_id, booking_session_token }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/pet/package/save`,
                { pet_id, package_product_id, booking_session_token }
            );

            // Only return pet_breeds
            return data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

// Get Grooming Details
export const getGroomingDetails = createAsyncThunk(
    'bookingFlow/getGroomingDetails',
    async ({ id, breed_id, size_id, pet_type, booking_session_token }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/pet/groom-detail/${id}`,
                { breed_id, size_id, pet_type, booking_session_token }
            );

            // Only return pet_breeds
            return data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

// Save Grooming Details
export const saveGroomingDetails = createAsyncThunk(
    "bookingFlow/saveGroomingDetails",
    async (
        {
            booking_session_token,
            pet_id,
            coat_type,
            behavior,
            shampoo_product_id,
            notes,
            shave_down_status,
            images = [],
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();

            // required fields
            formData.append("booking_session_token", booking_session_token);
            formData.append("pet_id", pet_id);
            formData.append("coat_type", coat_type);
            formData.append("behavior", behavior);
            formData.append("shampoo_product_id", shampoo_product_id);

            // optional fields
            if (notes) {
                formData.append("notes", notes);
            }

            if (shave_down_status) {
                formData.append("shave_down_status", shave_down_status);
            }

            images.forEach((file) => {
                if (file instanceof File) {
                    formData.append(
                        "reference_style_images[]",
                        file,
                        file.name
                    );
                }
            });

            const { data } = await axiosInstance.post("api/user/booking/pet/groom-detail/save", formData);

            return data?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to save grooming details" }
            );
        }
    }
);

// Get Addons Details
export const getAddonsDetails = createAsyncThunk(
    'bookingFlow/getAddonsDetails',
    async ({ id, breed_id, size_id, pet_type, booking_session_token }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/pet/addons/get/${id}`,
                { breed_id, size_id, pet_type, booking_session_token }
            );

            // Only return pet_breeds
            return data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

// Save Addons Details
export const saveAddonsDetails = createAsyncThunk(
    "bookingFlow/saveAddonsDetails",
    async (
        {
            booking_session_token,
            pet_id,
            bundle_product_ids = [],
            addon_product_ids = [],
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();

            // 🔹 Required fields
            formData.append("booking_session_token", booking_session_token);
            formData.append("pet_id", pet_id);

            // 🔹 Bundle IDs
            bundle_product_ids.forEach((id) => {
                formData.append("bundle_product_ids[]", id);
            });

            // 🔹 Addon IDs
            addon_product_ids.forEach((id) => {
                formData.append("addon_product_ids[]", id);
            });

            const { data } = await axiosInstance.post(
                "api/user/booking/pet/addons/save",
                formData
            );

            return data?.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to save addons details",
                }
            );
        }
    }
);

// Get Pets List on Booked Pets Details
export const getBookedPetsDetails = createAsyncThunk(
    'bookingFlow/getBookedPetsDetails',
    async ({ booking_session_token }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/pet/list`,
                { booking_session_token }
            );

            // Only return pet_breeds
            return data?.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

// Delete pet from booking list
export const deletePetDraftBooking = createAsyncThunk(
    "bookingFlow/deletePetDraftBooking",
    async ({ id, booking_session_token }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(
                `api/user/booking/pet/remove/${id}`,
                {
                    params: { booking_session_token },
                }
            );

            return {
                id,
                message: response?.data?.message,
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || {
                    message: "Failed to delete pet from booking",
                }
            );
        }
    }
);

const initialState = {
    /* ---------------- Address & Service ---------------- */
    address: null,
    serviceType: null,
    getPetServiceTypeApi: null,

    /* ---------------- Page-2 (Selection) ---------------- */
    selectedPet: null,
    selectedPetIdsfromAPI: [],
    selectedPetIds: [],
    selectedNewPetIdsExisting: [],
    petCounts: {
        dog: 0,
        cat: 0,
    },
    petBreeds: [],
    petSizes: [],
    loading: false,
    error: null,

    /* ---------------- Page-3+ (Creation Flow) ---------------- */
    petQueue: [],
    currentPetIndex: 0,
    petsDraft: [],
    packageDetails: [],
    groomingDetails: [],
    addonsDetails: [],

    bookedPetDetails: [],

    /* ---------------- Calender ---------------- */
    selectedSlot: null,
    selectedGroomer: null,

    /* ---------------- Appointment ---------------- */
    appointment: null,
};

const createEmptyPetDraft = (type, petId = null) => ({
    petId,
    type,
    stepData: {
        details: {},
        package: {},
        grooming: {},
        addons: {},
        totalPrice: 0,
    },
    completedSteps: [],
});

const bookingFlowSlice = createSlice({
    name: "bookingFlow",
    initialState,
    reducers: {
        /* ================= Address ================= */
        setBookingAddress(state, action) {
            state.address = action.payload;
        },

        /* ================= Service Type ================= */
        setServiceType(state, action) {
            if (state.serviceType === action.payload) return;

            state.serviceType = action.payload;

            // FULL reset only when service actually changes
            // state.selectedPetIds = [];
            state.selectedNewPetIdsExisting = [];
            state.selectedPetIdsfromAPI = [];
            state.petCounts = { dog: 0, cat: 0 };
            state.petQueue = [];
            state.currentPetIndex = 0;
            state.petsDraft = [];
        },

        /* ================= Existing Pets Flow ================= */
        togglePet(state, action) {
            const petId = action.payload;

            if (state.selectedPetIds.includes(petId)) {
                state.selectedPetIds = state.selectedPetIds.filter(
                    (id) => id !== petId
                );
            } else {
                state.selectedPetIds.push(petId);
            }
        },

        toggleExistingPetSelection(state, action) {
            // Normalize payload → always an array of ids
            const petIds = Array.isArray(action.payload)
                ? action.payload
                : [action.payload];

            state.selectedPetIds ??= [];
            state.selectedNewPetIdsExisting ??= [];

            petIds.forEach((petId) => {
                const isSelected = state.selectedPetIds.includes(petId);

                if (isSelected) {
                    // REMOVE from both
                    state.selectedPetIds = state.selectedPetIds.filter(id => id !== petId);
                    state.selectedNewPetIdsExisting =
                        state.selectedNewPetIdsExisting.filter(id => id !== petId);
                } else {
                    // ADD to both (avoid duplicates)
                    if (!state.selectedPetIds.includes(petId)) {
                        state.selectedPetIds.push(petId);
                    }

                    if (!state.selectedNewPetIdsExisting.includes(petId)) {
                        state.selectedNewPetIdsExisting.push(petId);
                    }
                }
            });
        },

        setPetCounts(state, action) {
            const { dog = 0, cat = 0, flag = false } = action.payload;

            if (flag) {
                state.petCounts = {
                    dog: Math.max(0, dog),
                    cat: Math.max(0, cat),
                };
                return;
            }

            state.petCounts.dog = Math.max(0, state.petCounts.dog + dog);
            state.petCounts.cat = Math.max(0, state.petCounts.cat + cat);
        },

        initializePetFlow(state, action) {
            const { dog = 0, cat = 0 } = action.payload || {};

            const nextQueue = [
                ...Array(dog).fill("dog"),
                ...Array(cat).fill("cat"),
            ];

            state.petQueue = nextQueue;
            state.currentPetIndex = 0;
            state.petsDraft = nextQueue.map(type => createEmptyPetDraft(type));
        },

        /* ================= STEP DATA ================= */
        AddSelectedPetIds(state, action) {
            const petId = action.payload;

            state.selectedPetIds.push(petId);
        },

        setPetID(state, action) {
            const { petIndex, petId } = action.payload;

            // safety check
            if (!state.petsDraft[petIndex]) return;

            state.petsDraft[petIndex].petId = petId;
            state.petsDraft[petIndex].petIndex = petIndex;
        },

        deletePetDraft(state, action) {
            const { petIndex } = action.payload;

            const petDraft = state.petsDraft[petIndex];
            if (!petDraft) return;

            const petId = petDraft.petId;
            const details = petDraft.stepData?.details || {};

            let petType = details.type || details.pet_type || null;

            /* remove draft */
            state.petsDraft.splice(petIndex, 1);

            /* fix currentPetIndex */
            if (state.currentPetIndex >= petIndex) {
                state.currentPetIndex = Math.max(0, state.currentPetIndex - 1);
            }

            /* remove selected pet */
            if (petId) {
                state.selectedPetIds = state.selectedPetIds.filter(id => id !== petId);
            }

            /* update counts */
            if (petType === "dog") state.petCounts.dog = Math.max(0, state.petCounts.dog - 1);
            if (petType === "cat") state.petCounts.cat = Math.max(0, state.petCounts.cat - 1);

            /* 🔥 RE-SYNC INDEXES */
            state.petsDraft.forEach((pet, index) => {
                pet.petIndex = index;
                if (pet.stepData) {
                    pet.stepData.petindex = index;
                }
            });
        },

        updatePetStepData(state, action) {
            const { petIndex, step, data } = action.payload;

            // Ensure draft exists
            if (!state.petsDraft[petIndex]) {
                state.petsDraft[petIndex] = createEmptyPetDraft(
                    state.petQueue[petIndex]
                );
            }

            state.petsDraft[petIndex].stepData[step] = {
                ...state.petsDraft[petIndex].stepData[step],
                ...data,
            };
        },

        updateTotalPrice(state, action) {
            const { petIndex } = action.payload;

            console.log("🟢 updateTotalPrice fired");
            console.log("👉 petIndex:", petIndex);

            const petDraft = state.petsDraft?.[petIndex];
            if (!petDraft) {
                console.warn("❌ petDraft not found for index:", petIndex);
                return;
            }

            console.log("🐶 petDraft:", JSON.parse(JSON.stringify(petDraft)));

            let subTotal = 0;

            /* ---------------- PACKAGE PRICE ---------------- */

            const pkg = petDraft.stepData?.package;
            console.log("📦 Package data:", pkg);

            if (pkg?.pricingType === "one-time") {
                console.log("💵 One-time price:", pkg?.price);
                console.log("🚐 Mobile van fee:", pkg?.mobileVanFee);

                subTotal += Number(pkg?.price || 0);
                subTotal += Number(pkg?.mobileVanFee || 0);
            }

            if (pkg?.pricingType === "recurring" && pkg?.recurringConfig) {
                const { billing, annualTotal, perAppointment } = pkg.recurringConfig;

                console.log("🔁 Recurring billing:", billing);
                console.log("🔁 Annual total:", annualTotal);
                console.log("🔁 Per appointment:", perAppointment);

                subTotal += Number(
                    billing === "annual"
                        ? annualTotal || 0
                        : perAppointment || 0
                );
            }

            /* ---------------- SAFETY INSURANCE ---------------- */

            if (pkg?.safetyInsuranceFee) {
                console.log("🛡 Safety insurance fee:", pkg.safetyInsuranceFee);
                subTotal += Number(pkg.safetyInsuranceFee);
            }

            /* ---------------- GROOMING ---------------- */

            const grooming = petDraft.stepData?.grooming;
            console.log("✂️ Grooming data:", grooming);

            if (grooming?.conditionProduct?.price) {
                console.log("🐕 Coat condition price:", grooming.conditionProduct.price);
                subTotal += Number(grooming.conditionProduct.price);
            }

            if (grooming?.behaviorProduct?.price) {
                console.log("😾 Behavior price:", grooming.behaviorProduct.price);
                subTotal += Number(grooming.behaviorProduct.price);
            }

            if (grooming?.shampooPrice) {
                console.log("🧴 Shampoo price:", grooming.shampooPrice);
                subTotal += Number(grooming.shampooPrice);
            }

            /* ---------------- ADD-ONS & BUNDLES ---------------- */

            const addons = petDraft.stepData?.addons?.items || [];
            const addonsWithBundles = state.addonsDetails?.addonsWithBundles || {};

            console.log("➕ Selected addons:", addons);
            console.log("🎁 Addons-with-bundles map:", addonsWithBundles);

            const selectedBundles = addons.filter(
                (item) => item.category === "BUNDLES"
            );

            const selectedAddons = addons.filter(
                (item) => item.category !== "BUNDLES"
            );

            selectedBundles.forEach((bundle) => {
                console.log("🎁 Bundle price:", bundle.price);
                subTotal += Number(bundle.price || 0);
            });

            const coveredAddonIds = new Set();

            selectedBundles.forEach((bundle) => {
                (addonsWithBundles[bundle.id] || []).forEach((id) => {
                    coveredAddonIds.add(String(id));
                });
            });

            console.log("🧠 Covered addon IDs:", [...coveredAddonIds]);

            selectedAddons.forEach((addon) => {
                if (!coveredAddonIds.has(String(addon.id))) {
                    console.log("➕ Addon added:", addon.id, addon.price);
                    subTotal += Number(addon.price || 0);
                } else {
                    console.log("🚫 Addon skipped (covered by bundle):", addon.id);
                }
            });

            /* ---------------- SUBTOTAL CHECK ---------------- */

            console.log("💰 Subtotal BEFORE tax:", subTotal);

            /* ---------------- TAX (LAST STEP) ---------------- */

            const TAX_RATE = 0.0887;

            const taxAmount = Number((subTotal * TAX_RATE).toFixed(2));
            const totalPrice = Number((subTotal + taxAmount).toFixed(2));

            console.log("🧾 Tax rate:", TAX_RATE);
            console.log("🧾 Tax amount:", taxAmount);
            console.log("🧾 Final total:", totalPrice);

            /* ---------------- SAVE PET TOTAL ---------------- */

            petDraft.stepData.subTotal = subTotal;
            petDraft.stepData.taxAmount = taxAmount;
            petDraft.stepData.totalPrice = totalPrice;

            console.log("✅ Saved stepData:", petDraft.stepData);

            /* ---------------- BOOKING TOTAL ---------------- */

            state.totalPrice = state.petsDraft.reduce(
                (sum, pet) => sum + Number(pet?.stepData?.totalPrice || 0),
                0
            );

            console.log("🏁 Booking total price:", state.totalPrice);
        },

        completePetStep(state, action) {
            const { petIndex, step } = action.payload;

            if (!state.petsDraft[petIndex]) return;

            if (!state.petsDraft[petIndex].completedSteps.includes(step)) {
                state.petsDraft[petIndex].completedSteps.push(step);
            }
        },

        moveToNextPet(state, action) {
            const { petIndex } = action.payload;

            state.currentPetIndex = petIndex;
        },

        /* ================= Calender ================= */
        setSelectedSlott(state, action) {
            state.selectedSlot = action.payload;
        },

        setSelectedGroomerr(state, action) {
            state.selectedGroomer = action.payload;
        },

        /* ================= Appointment ================= */
        setAppointment(state, action) {
            state.appointment = action.payload;
        },

        /* ================= Reset ================= */
        clearBookingFlow() {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Booking Pet Breeds
            .addCase(getBookingPetBreeds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookingPetBreeds.fulfilled, (state, action) => {
                state.loading = false;
                state.petBreeds = action.payload;
            })
            .addCase(getBookingPetBreeds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Get Booking Pet Size from breed Id
            .addCase(getBookingPetSizes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookingPetSizes.fulfilled, (state, action) => {
                state.loading = false;
                state.petSizes = action.payload;
            })
            .addCase(getBookingPetSizes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Get Pet Service Type
            .addCase(getPetServiceType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPetServiceType.fulfilled, (state, action) => {
                state.loading = false;
                state.getPetServiceTypeApi = action.payload;
            })
            .addCase(getPetServiceType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Save Pet Service Type
            .addCase(SavePetServiceType.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(SavePetServiceType.fulfilled, (state, action) => {
                state.loading = false;

                state.selectedPetIdsfromAPI = action.payload;

                // state.selectedPetIdsfromAPI = [
                //     ...(state.selectedPetIdsfromAPI || []),
                //     ...action.payload,
                // ];

                if (state.selectedNewPetIdsExisting.length > 0) {
                    state.selectedNewPetIdsExisting = [];
                }
            })
            .addCase(SavePetServiceType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Get Pet Profile by Generated ID
            .addCase(getPetProfileGeneratedID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPetProfileGeneratedID.fulfilled, (state, action) => {
                state.loading = false;
                state.petBreeds = action.payload?.pet_breeds;
                state.selectedPet = action.payload?.pets;
            })
            .addCase(getPetProfileGeneratedID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Get Package Details
            .addCase(getPackageDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPackageDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.packageDetails = action.payload;
            })
            .addCase(getPackageDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Get Grooming Details
            .addCase(getGroomingDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGroomingDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.groomingDetails = action.payload;
            })
            .addCase(getGroomingDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Get Addons Details
            .addCase(getAddonsDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAddonsDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.addonsDetails = action.payload;
            })
            .addCase(getAddonsDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Get Addons Details
            .addCase(getBookedPetsDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookedPetsDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.bookedPetDetails = action.payload;
            })
            .addCase(getBookedPetsDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })
    }
});

export const {
    setBookingAddress,
    setServiceType,
    togglePet,
    toggleExistingPetSelection,
    setPetCounts,

    deletePetDraft,
    initializePetFlow,
    setPetID,
    AddSelectedPetIds,
    updatePetStepData,
    updateTotalPrice,
    completePetStep,
    moveToNextPet,

    setSelectedGroomerr,
    setSelectedSlott,

    setAppointment,
    clearBookingFlow,
} = bookingFlowSlice.actions;

export default bookingFlowSlice.reducer;
