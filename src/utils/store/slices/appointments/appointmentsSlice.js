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

// ✅ Async Thunk to fetch Appointment-Detail data
export const getAppointmentDetail = createAsyncThunk(
    "appointments/getAppointmentDetail",
    async (appointmentId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`api/user/appointment/${appointmentId}`);
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch appointment detail");
            return rejectWithValue(error.response?.data || { message: "Failed to fetch appointment detail" });
        }
    }
);

const appointmentsSlice = createSlice({
    name: "appointments",
    initialState: {
        appointments: [],
        selectedAppointment: null, // ✅ For appointment detail
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedAppointment(state) {
            state.selectedAppointment = null;
            state.detailError = null;
            state.detailLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // 📝 Appointments list
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
            })

            // 📝 Appointment detail
            .addCase(getAppointmentDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAppointmentDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedAppointment = action.payload;
            })
            .addCase(getAppointmentDetail.rejected, (state, action) => {
                state.loading = false;
                state.detailError = action.payload?.message || "Something went wrong";
            });
    },
});

export const { clearSelectedAppointment } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
