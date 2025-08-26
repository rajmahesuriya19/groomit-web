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

const initialState = {
  token: null,
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuth: () => initialState,
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
      });
  },
});

export default authSlice.reducer;
