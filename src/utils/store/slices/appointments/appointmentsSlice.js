import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/services/api/axios";
import { toast } from "react-toastify";

// ✅ Async Thunk to fetch Appointments data
export const getAppointments = createAsyncThunk(
    "appointments/getAppointments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("api/user/appointments");
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch appointments");
            return rejectWithValue(error.response?.data || { message: "Failed to fetch appointments" });
        }
    }
);

const appointmentsSlice = createSlice({
    name: "appointments",
    initialState: {
        appointments: [],
        loading: false,
        error: null,
    },
    reducers: {
        // You can add reducers here for updating state manually if needed
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAppointments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAppointments.fulfilled, (state, action) => {
                state.loading = false;
                state.appointments = action.payload;
            })
            .addCase(getAppointments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            });
    },
});

export default appointmentsSlice.reducer;
