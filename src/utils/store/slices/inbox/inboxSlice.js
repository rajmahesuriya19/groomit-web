import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/services/api/axios";
import { toast } from "react-toastify";

// Fetch Groomer Inbox messages
export const fetchInboxMessages = createAsyncThunk(
    "inbox/fetchInboxMessages",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("api/user/message/list");
            return response.data.data || [];
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch inbox messages");
            return rejectWithValue(error.response?.data || { message: "Failed to fetch inbox messages" });
        }
    }
);

// Fetch Support Inbox messages
export const fetchSupportInboxMessages = createAsyncThunk(
    "inbox/fetchSupportInboxMessages",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("api/user/support/list");
            return response.data.data || [];
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch support messages");
            return rejectWithValue(error.response?.data || { message: "Failed to fetch support messages" });
        }
    }
);

// Fetch a selected chat detail
export const fetchSelectedChat = createAsyncThunk(
    "inbox/fetchSelectedChat",
    async (ticket_id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("api/user/support/detail", { ticket_id });
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch chat details");
            return rejectWithValue(error.response?.data || { message: "Failed to fetch chat details" });
        }
    }
);

const inboxSlice = createSlice({
    name: "inbox",
    initialState: {
        groomersChat: [],
        supportChat: [],
        selectedChat: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearSelectedChat(state) {
            state.selectedChat = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Groomers
            .addCase(fetchInboxMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInboxMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.groomersChat = action.payload;
            })
            .addCase(fetchInboxMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            })

            // Support
            .addCase(fetchSupportInboxMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSupportInboxMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.supportChat = action.payload;
            })
            .addCase(fetchSupportInboxMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            })

            // Selected Chat
            .addCase(fetchSelectedChat.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSelectedChat.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedChat = action.payload;
            })
            .addCase(fetchSelectedChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            });
    },
});

export const { clearSelectedChat } = inboxSlice.actions;
export default inboxSlice.reducer;
