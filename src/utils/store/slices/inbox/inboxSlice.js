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

// ✅ Send Messages (with FormData)
export const sendSupportMessage = createAsyncThunk(
    "inbox/sendSupportMessage",
    async ({ appointment_id, comment, ticket_id, files = [] }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("appointment_id", appointment_id);
            formData.append("comment", comment);
            formData.append("ticket_id", ticket_id);

            // Append multiple files
            if (files.length > 0) {
                files.forEach((file, index) => {
                    formData.append("files[]", file); // Adjust key if API expects another name
                });
            }

            const response = await axiosInstance.post("api/user/help/save", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send message");
            return rejectWithValue(error.response?.data || { message: "Failed to send message" });
        }
    }
);

const inboxSlice = createSlice({
    name: "inbox",
    initialState: {
        groomersChat: [],
        supportChat: [],
        selectedChat: null,
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
            })

            // Send Support Message
            .addCase(sendSupportMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendSupportMessage.fulfilled, (state, action) => {
                state.loading = false;
                if (state.selectedChat) {
                    state.selectedChat.messages.push(action.payload);
                }
            })
            .addCase(sendSupportMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Something went wrong";
            });
    },
});

export const { clearSelectedChat } = inboxSlice.actions;
export default inboxSlice.reducer;
