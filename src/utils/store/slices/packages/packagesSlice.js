import axiosInstance from "@/services/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

/* =========================
   GET Packages
========================= */

export const getPackages = createAsyncThunk(
    "packages/getPackages",
    async (
        { zip, breed_id, size_id, pet_type, booking_session_token },
        { rejectWithValue }
    ) => {
        try {
            const { data } = await axiosInstance.post(
                "api/user/packages/search",
                { zip, breed_id, size_id, pet_type, booking_session_token }
            );

            // 🔥 IMPORTANT FIX
            if (!data?.success) {
                return rejectWithValue({
                    message: data?.message || "No packages found",
                });
            }

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch packages" }
            );
        }
    }
);

// GET Packages by PetID
export const getPackageByPet = createAsyncThunk(
    "packages/getPackageByPet",
    async ({ petId }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/packages/search/${petId}`
            );

            // 🔥 IMPORTANT FIX
            if (!data?.success) {
                return rejectWithValue({
                    message: data?.message || "No packages found",
                });
            }

            return data || [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch packages" }
            );
        }
    }
);

/* =========================
   SLICE
========================= */

const packagesSlice = createSlice({
    name: "packages",
    initialState: {
        packages: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearPackages: (state) => {
            state.packages = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            /* PENDING */
            .addCase(getPackages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            /* SUCCESS */
            .addCase(getPackages.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload?.packages || [];
            })

            /* ERROR */
            .addCase(getPackages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                toast.error(action.payload?.message || "Something went wrong");
            })

            // GET Packages by PetID
            /* PENDING */
            .addCase(getPackageByPet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            /* SUCCESS */
            .addCase(getPackageByPet.fulfilled, (state, action) => {
                state.loading = false;
                state.packages = action.payload?.packages || [];
            })

            /* ERROR */
            .addCase(getPackageByPet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                toast.error(action.payload?.message || "Something went wrong");
            });
    },
});

export const { clearPackages } = packagesSlice.actions;
export default packagesSlice.reducer;
