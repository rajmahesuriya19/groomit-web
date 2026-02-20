import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/services/api/axios";
import { toast } from "react-toastify";

/* =========================
   GET Dashboard
========================= */

export const getDashboardData = createAsyncThunk(
    "dashboard/getDashboardData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("api/user/dashboard");
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
            return rejectWithValue(error.response?.data || { message: "Failed to fetch dashboard data" });
        }
    }
);

/* =========================
   SAVE REMINDER
========================= */

export const SaveReminder = createAsyncThunk(
    "dashboard/SaveReminder",
    async ({ user_pet_id, frequency_weeks, is_enabled }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `api/user/pet-reminders/set`,
                { user_pet_id, frequency_weeks, is_enabled }
            );

            return data?.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save reminder");
            return rejectWithValue(error.response?.data || { message: "Failed to save reminder" });
        }
    }
);

/* =========================
   GET PET PARTICULARS
========================= */

export const getPetParticulars = createAsyncThunk(
    "dashboard/getPetParticulars",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                "api/user/get-pet-particulars"
            );

            return response.data?.data;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch pet particulars"
            );
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch pet particulars",
                }
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        dashboard: [],
        loading: false,
        error: null,

        reminderOptions: [],
        isEnabled: false,
        selectedFrequency: null,
        isModalOpen: false,
    },
    reducers: {
        closeReminderModal: (state) => {
            state.isModalOpen = false;
        },
        toggleEnable: (state, action) => {
            state.isEnabled = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Dashboard
            .addCase(getDashboardData.pending, (state) => {
                state.loading = true;
            })
            .addCase(getDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
                state.isEnabled = false;
                state.selectedFrequency = 0;
            })
            .addCase(getDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // Save Reminder
            .addCase(SaveReminder.pending, (state) => {
                state.loading = true;
            })
            .addCase(SaveReminder.fulfilled, (state, action) => {
                state.loading = false;

                // ✅ Update state from API response
                state.isEnabled = action.meta.arg.is_enabled;

                // ✅ Open modal ONLY after success
                if (state.isEnabled) {
                    state.isModalOpen = true;
                }
            })
            .addCase(SaveReminder.rejected, (state) => {
                state.loading = false;
            })

            // Get Pet Particulars
            .addCase(getPetParticulars.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPetParticulars.fulfilled, (state, action) => {
                state.loading = false;

                const frequencies = action.payload?.pet_reminder_frequencies || [];

                // Convert [2,4,6] → option objects
                state.reminderOptions = frequencies.map((week, index) => ({
                    id: index + 1,
                    label: `Every ${week} weeks`,
                    value: week,
                }));

                // Optional: set first as default if none selected
                if (!state.selectedFrequency && frequencies.length) {
                    state.selectedFrequency = frequencies[0];
                }
            })
            .addCase(getPetParticulars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
    },
});

export const { closeReminderModal, toggleEnable } = dashboardSlice.actions;
export default dashboardSlice.reducer;