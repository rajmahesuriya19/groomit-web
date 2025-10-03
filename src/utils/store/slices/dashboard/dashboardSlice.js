import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/services/api/axios";
import { toast } from "react-toastify";

// ✅ Async Thunk to fetch dashboard data
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

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        dashboard: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
            })
            .addCase(getDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            });
    },
});

export default dashboardSlice.reducer;
