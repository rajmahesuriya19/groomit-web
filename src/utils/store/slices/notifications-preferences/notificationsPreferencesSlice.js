import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/api/axios';

// GET preferences
export const getNotificationPreferences = createAsyncThunk(
    'notifications/getPreferences',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('api/user/notifications-preferences');
            return res.data?.preferences;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Failed to fetch preferences' });
        }
    }
);

// POST preferences
export const updateNotificationPreferences = createAsyncThunk(
    'notifications/updatePreferences',
    async (payload, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post(
                'api/user/notifications-preferences',
                payload
            );
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: 'Failed to update preferences' });
        }
    }
);

const initialState = {
    data: null,
    loading: false,
    error: null,
};

const notificationsPreferencesSlice = createSlice({
    name: 'notificationsPreferences',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // GET
            .addCase(getNotificationPreferences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getNotificationPreferences.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getNotificationPreferences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // POST
            .addCase(updateNotificationPreferences.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNotificationPreferences.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(updateNotificationPreferences.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });
    },
});

export default notificationsPreferencesSlice.reducer;
