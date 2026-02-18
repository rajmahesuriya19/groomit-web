import axiosInstance from "@/services/api/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

/* =========================
   GET REVIEWS
========================= */

export const getReviews = createAsyncThunk(
    "reviews/getReviews",
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                "api/user/reviews/get",
                payload
            );

            return data || [];
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch reviews" }
            );
        }
    }
);

/* =========================
   SLICE
========================= */

const reviewsSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: [],
        averageRating: 0,
        totalReviews: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearReviews: (state) => {
            state.reviews = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            /* PENDING */
            .addCase(getReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            /* SUCCESS */
            .addCase(getReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload?.surveys || [];
                state.averageRating = action.payload?.average_rating || 0;
                state.totalReviews = action.payload?.total_reviews || 0;
            })

            /* ERROR */
            .addCase(getReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                toast.error(action.payload?.message || "Something went wrong");
            });
    },
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
