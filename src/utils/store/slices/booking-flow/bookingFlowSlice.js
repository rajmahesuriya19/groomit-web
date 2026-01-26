import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    /* ---------------- Address & Service ---------------- */
    address: null,
    serviceType: null,

    /* ---------------- Page-2 (Selection) ---------------- */
    selectedPetIds: [],
    petCounts: {
        dog: 0,
        cat: 0,
    },

    /* ---------------- Page-3+ (Creation Flow) ---------------- */
    petQueue: [],
    currentPetIndex: 0,
    petsDraft: [],

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
            state.selectedPetIds = [];
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
            console.log(1);
            state.petsDraft[petIndex].stepData[step] = {
                ...state.petsDraft[petIndex].stepData[step],
                ...data,
            };
        },

        updateTotalPrice(state, action) {
            const { petIndex } = action.payload;

            const petDraft = state.petsDraft[petIndex];
            if (!petDraft) return;

            let total = 0;

            /* ---------------- PACKAGE PRICE ---------------- */

            const pkg = petDraft.stepData.package;

            if (pkg?.type === "one-time") {
                total += Number(pkg.price.replace(/[^0-9.]/g, ""));
            }

            if (pkg?.type === "recurring" && pkg.recurringConfig) {
                const { billing, annualTotal, perAppointment } = pkg.recurringConfig;

                total +=
                    billing === "annual"
                        ? Number(annualTotal)
                        : Number(perAppointment);
            }

            /* ---------------- ADD-ONS PRICE ---------------- */

            const addons = petDraft.stepData.addons?.items || [];

            const addonsTotal = addons.reduce(
                (sum, addon) => sum + Number(addon.price || 0),
                0
            );

            total += addonsTotal;

            /* ---------------- SAVE ---------------- */

            petDraft.stepData.totalPrice = total;

            // 🧮 Booking-level total
            state.totalPrice = state.petsDraft.reduce(
                (sum, pet) => sum + (pet.stepData.totalPrice || 0),
                0
            );
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

        /* ================= Appointment ================= */
        setAppointment(state, action) {
            state.appointment = action.payload;
        },

        /* ================= Reset ================= */
        clearBookingFlow() {
            return initialState;
        }
    },
});

export const {
    setBookingAddress,
    setServiceType,
    togglePet,
    setPetCounts,

    deletePetDraft,
    initializePetFlow,
    setPetID,
    AddSelectedPetIds,
    updatePetStepData,
    updateTotalPrice,
    completePetStep,
    moveToNextPet,

    setAppointment,
    clearBookingFlow,
} = bookingFlowSlice.actions;

export default bookingFlowSlice.reducer;
