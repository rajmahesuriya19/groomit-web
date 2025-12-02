import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/services/api/axios";
import { toast } from "react-toastify";

export const getGroomersList = createAsyncThunk(
    "groomers/getGroomersList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("api/user/groomer/list/all");
            return response.data.data.groomers;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch Groomers list" });
        }
    }
);

export const addGroomerFav = createAsyncThunk(
    "groomers/addGroomerFav",
    async (groomer_id, { rejectWithValue }) => {
        try {
            await axiosInstance.post("api/user/groomer/add-favorite", { groomer_id });
            return groomer_id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to Favourite" });
        }
    }
);

export const addBlockedGroomer = createAsyncThunk(
    "groomers/addBlockedGroomer",
    async (groomer_id, { rejectWithValue }) => {
        try {
            await axiosInstance.post("api/user/groomer/block/add", { groomer_id });
            return groomer_id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to Favourite" });
        }
    }
);

export const removeGroomerFav = createAsyncThunk(
    "groomers/removeGroomerFav",
    async (groomer_id, { rejectWithValue }) => {
        try {
            await axiosInstance.post("api/user/groomer/remove-favorite", { groomer_id });
            return groomer_id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to Favourite" });
        }
    }
);

export const removeBlockedGroomer = createAsyncThunk(
    "groomers/removeBlockedGroomer",
    async (groomer_id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`api/user/groomer/block/remove/${groomer_id}`);
            return groomer_id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to Favourite" });
        }
    }
);

const groomersSlice = createSlice({
    name: "groomers",
    initialState: {
        groomers: [],
        loading: false,
        error: null,
    },
    reducers: {
        toggleFavLocal: (state, action) => {
            state.groomers = state.groomers.map((g) =>
                g.groomer_id === action.payload
                    ? { ...g, is_fav_groomer: !g.is_fav_groomer }
                    : g
            );
        },

        toggleBlockLocal: (state, action) => {
            state.groomers = state.groomers.map(g =>
                g.groomer_id === action.payload
                    ? { ...g, is_blocked_groomer: !g.is_blocked_groomer }
                    : g
            );
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getGroomersList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getGroomersList.fulfilled, (state, action) => {
                state.loading = false;
                state.groomers = action.payload || [];
            })
            .addCase(getGroomersList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            })

            .addCase(addGroomerFav.fulfilled, (state, action) => {
                const groomerName = state.groomers.find(g => g.groomer_id === action.payload)?.name;
                toast.success(
                    groomerName
                        ? `${groomerName} added to your favorites ❤️`
                        : "Groomer added to favorites ❤️"
                );
            })

            .addCase(removeGroomerFav.fulfilled, (state, action) => {
                const groomerName = state.groomers.find(g => g.groomer_id === action.payload)?.name;
                toast.info(
                    groomerName
                        ? `${groomerName} removed from your favorites 💔`
                        : "Groomer removed from favorites 💔"
                );
            })

            .addCase(addBlockedGroomer.fulfilled, (state, action) => {
                const id = action.payload;

                // update state instantly
                state.groomers = state.groomers.map(g =>
                    g.groomer_id === id
                        ? { ...g, is_blocked_groomer: true }
                        : g
                );

                const groomerName = state.groomers.find(g => g.groomer_id === id)?.name;

                toast.success(
                    groomerName
                        ? `${groomerName} has been blocked 🚫`
                        : "Groomer blocked 🚫"
                );
            })

            .addCase(removeBlockedGroomer.fulfilled, (state, action) => {
                const id = action.payload;

                // update state instantly
                state.groomers = state.groomers.map(g =>
                    g.groomer_id === id
                        ? { ...g, is_blocked_groomer: false, blocked_by: null }
                        : g
                );

                const groomerName = state.groomers.find(g => g.groomer_id === id)?.name;

                toast.info(
                    groomerName
                        ? `${groomerName} has been unblocked ✔️`
                        : "Groomer unblocked ✔️"
                );
            })
    },
});

export const { toggleFavLocal, toggleBlockLocal } = groomersSlice.actions;
export default groomersSlice.reducer;
