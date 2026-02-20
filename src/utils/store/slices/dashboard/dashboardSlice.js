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

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        dashboard: [],
        loading: false,
        error: null,

        reminderOptions: [],
        isEnabled: false,
        selectedFrequency: null,
        reminderLoading: false,
        isModalOpen: false,
    },
    reducers: {
        closeReminderModal: (state) => {
            state.isModalOpen = false;
        },
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
            })
            .addCase(getDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // Save Reminder
            .addCase(SaveReminder.pending, (state) => {
                state.reminderLoading = true;
            })
            .addCase(SaveReminder.fulfilled, (state, action) => {
                state.reminderLoading = false;

                // ✅ Update state from API response
                state.isEnabled = action.meta.arg.is_enabled;
                state.selectedFrequency = action.meta.arg.frequency_weeks;

                // ✅ Open modal ONLY after success
                if (state.isEnabled) {
                    state.isModalOpen = true;
                }
            })
            .addCase(SaveReminder.rejected, (state) => {
                state.reminderLoading = false;
            });
    },
});

export const { closeReminderModal } = dashboardSlice.actions;
export default dashboardSlice.reducer;