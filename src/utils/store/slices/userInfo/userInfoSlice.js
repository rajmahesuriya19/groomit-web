import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/services/api/axios';
import { toast } from "react-toastify";

export const getUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('api/user/info');
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch user info' });
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  async ({ first_name, last_name, email, phone, profile_photo }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('first_name', first_name);
      formData.append('last_name', last_name);
      formData.append('email', email);
      formData.append('phone', phone);
      if (profile_photo) formData.append('profile_photo', profile_photo);

      const { data } = await axiosInstance.post('api/user/info/update', formData);
      return data.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update user info' });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("api/user/booking/start/verify-otp", {
        mobile,
        otp,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "OTP verification failed" });
    }
  }
);

export const sendOtp = createAsyncThunk(
  "user/sendOtp",
  async ({ mobile }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "api/user/booking/start/send-otp",
        { mobile }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send OTP" }
      );
    }
  }
);

export const sendOtpByEmail = createAsyncThunk(
  "user/sendOtpByEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "api/user/password/forgot-via-email",
        { email }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to send OTP" }
      );
    }
  }
);

export const verifyOtpByEmail = createAsyncThunk(
  "user/verifyOtpByEmail",
  async ({ email, key }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("api/user/password/forgot/verify-email", {
        email,
        key,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "OTP verification failed" });
    }
  }
);

export const resetForgotPassword = createAsyncThunk(
  "user/resetForgotPassword",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "api/user/password/forgot/verify-email",
        {
          email,
          key: otp,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to reset password" }
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
      })

      // update user info
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success("Profile updated successfully ✅");
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Something went wrong';
        toast.error("Something went wrong");
      })

      // send otp
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
        toast.success("OTP sent successfully 📩");
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send OTP";
        toast.error(state.error);
      })

      // send otp by Email
      .addCase(sendOtpByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtpByEmail.fulfilled, (state) => {
        state.loading = false;
        toast.success("OTP sent successfully 📩");
      })
      .addCase(sendOtpByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send OTP";
        toast.error(state.error);
      })

      // verify otp
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        toast.success("Phone verified successfully 🎉");
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
        toast.error(state.error);
      })

      // verify otp by Email
      .addCase(verifyOtpByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpByEmail.fulfilled, (state) => {
        state.loading = false;
        toast.success("Phone verified successfully 🎉");
      })
      .addCase(verifyOtpByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
        toast.error(state.error);
      })

      // reset forgot password
      .addCase(resetForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetForgotPassword.fulfilled, (state) => {
        state.loading = false;
        toast.success("Password reset successfully 🔐");
      })
      .addCase(resetForgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to reset password";
        toast.error(state.error);
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
