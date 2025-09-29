import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/api/axios';
import { toast } from "react-toastify";

// Fetch pet list
export const getPetList = createAsyncThunk(
    'pets/getPetList',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('api/user/pet/list');
            return data.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch pet list' });
        }
    }
);

// Fetch pet profile by ID
export const getPetProfileID = createAsyncThunk(
    'pets/getPetProfileID',
    async (petId, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`api/user/pet/profile/${petId}`);
            return data.data || {};
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch pet profile' });
        }
    }
);

// Add or update a pet
export const addUpdatePet = createAsyncThunk(
    'pets/addUpdatePet',
    async (
        { petType, name, date_of_birth, gender, special_note, temperament, breed_id, is_mixed, size_id, pet_id, vaccinated_exp_date, profile_photo, vaccinated_image_url },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();
            formData.append('petType', petType);
            formData.append('name', name);
            formData.append('date_of_birth', date_of_birth);
            formData.append('gender', gender);
            formData.append('additional_information', special_note || '');
            formData.append('temperament', temperament || '');
            formData.append('breed_id', breed_id);
            formData.append('is_mixed', is_mixed ? 1 : 0);
            formData.append('size_id', size_id);
            if (pet_id) formData.append('pet_id', pet_id);
            if (vaccinated_exp_date) formData.append('vaccinated_exp_date', vaccinated_exp_date);
            if (profile_photo instanceof File) {
                formData.append('profile_picture', profile_photo);
            }
            if (vaccinated_image_url instanceof File) {
                formData.append('vaccinate_certificate', vaccinated_image_url, vaccinated_image_url?.name || vaccinated_image_url?.displayName);
            }
            // if (profile_photo) formData.append('profile_picture', profile_photo);
            // if (vaccinated_image_url) formData.append('vaccinate_certificate', vaccinated_image_url?.displayName);

            const { data } = await axiosInstance.post('api/user/pet/save', formData);
            return data.data?.pet;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to save pet' });
        }
    }
);

// Delete / Memorialize / Activate Pet
export const updatePetStatus = createAsyncThunk(
    'pets/updatePetStatus',
    async ({ pet_id, remove_type }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`api/user/pet/remove`, {
                pet_id,
                remove_type, // "M" = Memorialise, "D" = Permanent delete, "A" = Active
            });
            return { pet_id, remove_type, data: data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update pet status' });
        }
    }
);

// Fetch pet breeds for booking
export const getBookingPetBreeds = createAsyncThunk(
    'pets/getBookingPetBreeds',
    async ({ bookingId }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/booking/pet/get/${bookingId}`,
                {
                    "booking_session_token": "booking_session_6888c7d65d91b1.59307650"
                }
            );

            // Only return pet_breeds
            return data?.data?.pet_breeds || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch booking pet breeds' });
        }
    }
);

const petsSlice = createSlice({
    name: 'pets',
    initialState: {
        pets: [],
        petBreeds: [],
        selectedPet: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearPets: (state) => {
            state.pets = [];
            state.error = null;
        },
        clearSelectedPet: (state) => {
            state.selectedPet = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Pet List
            .addCase(getPetList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPetList.fulfilled, (state, action) => {
                state.loading = false;
                state.pets = action.payload;
            })
            .addCase(getPetList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Get Pet Profile by ID
            .addCase(getPetProfileID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPetProfileID.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedPet = action.payload;
            })
            .addCase(getPetProfileID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            // Add / Update Pet
            .addCase(addUpdatePet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUpdatePet.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload) {
                    const existingIndex = state.pets.findIndex((p) => p.id === action.payload.id);
                    if (existingIndex !== -1) {
                        state.pets[existingIndex] = action.payload;
                    } else {
                        state.pets.push(action.payload);
                    }
                }

                toast.success("Pet saved successfully ✅");
            })
            .addCase(addUpdatePet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

            .addCase(updatePetStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePetStatus.fulfilled, (state, action) => {
                state.loading = false;

                const { pet_id, remove_type } = action.payload;
                if (remove_type === "D") {
                    // Hard delete
                    toast.success("Pet deleted permanently ❌");
                } else if (remove_type === "M") {
                    // Memorialize
                    toast.success("Pet memorialized 🕊️");
                } else if (remove_type === "A") {
                    // Reactivate
                    toast.success("Pet re-activated ✅");
                }
            })
            .addCase(updatePetStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Something went wrong';
                toast.error(state.error);
            })

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
            });

    },
});

export const { clearPets, clearSelectedPet } = petsSlice.actions;
export default petsSlice.reducer;
