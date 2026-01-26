import axiosInstance from '@/services/api/axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('api/user/login', { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Unknown error' });
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ old_password, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        'api/user/password/reset',
        { old_password, password }
      );

      // 🚨 BACKEND RETURNS 200 EVEN FOR FAILURE
      if (!response.data?.success) {
        return rejectWithValue({
          message: response.data.message || 'Failed to change password',
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          'Failed to change password',
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('api/user/logout');
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Logout failed' });
    }
  }
);

// Create Booking Session
export const createBookingData = createAsyncThunk(
  "dashboard/createBookingData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("api/user/booking/create-booking-session");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
      return rejectWithValue(error.response?.data || { message: "Failed to fetch dashboard data" });
    }
  }
);

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  unique_token: null,
  changePasswordLoading: false,
  changePasswordError: null,
  changePasswordSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: () => initialState,
    resetChangePasswordState: (state) => {
      state.changePasswordLoading = false;
      state.changePasswordError = null;
      state.changePasswordSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const token = action.payload.token;
        if (token) {
          state.token = token;
          state.user = action.payload.user || null;
          state.isLoggedIn = true;
          state.loading = false;
          localStorage.setItem('token', token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })

      // Logout
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload?.message || 'Logout failed';
      })

      // Create Booking Session
      .addCase(createBookingData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingData.fulfilled, (state, action) => {
        const unique_token = action.payload.unique_token;
        if (unique_token) {
          state.unique_token = unique_token;
          localStorage.setItem('unique_token', unique_token);
        }
      })
      .addCase(createBookingData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordError = null;
        state.changePasswordSuccess = false;
      })

      .addCase(changePassword.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.changePasswordSuccess = true;
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.changePasswordError = action.payload?.message;
      });
  },
});

export const { resetAuth, resetChangePasswordState } = authSlice.actions;
export default authSlice.reducer;
