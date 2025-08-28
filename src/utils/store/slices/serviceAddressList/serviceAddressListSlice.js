import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@/services/api/axios'
import { toast } from 'react-toastify'

// 🔹 Fetch all addresses
export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('api/user/dashboard/address/get')
      return data.data.addresses || []
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch addresses' })
    }
  }
)

// 🔹 Add new address
export const addAddress = createAsyncThunk(
  'addresses/addAddress',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('api/user/address/add', payload)

      if (!data.success) {
        return rejectWithValue({
          message: data.message || "Failed to update address ❌",
          ...data
        })
      }

      return data.data.address
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add address' })
    }
  }
)

// 🔹 Update existing address
export const updateAddress = createAsyncThunk(
  'addresses/updateAddress',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('api/user/address/update', payload)

      if (!data.success) {
        return rejectWithValue(data)
      }
      console.log(data)
      return data.data.address
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update address' })
    }
  }
)

// 🔹 Set Default address
export const setDefaultAddress = createAsyncThunk(
  'addresses/setDefaultAddress',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('api/user/address/set-default', payload)
      return payload.address_id
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update address' })
    }
  }
)

// 🔹 Delete address
export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (address_id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`api/user/address/remove/${address_id}`)
      return address_id
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete address' })
    }
  }
)

// 🔹 Join Waitlist
export const joinWaitlist = createAsyncThunk(
  'addresses/joinWaitlist',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('api/user/booking/join-wait-list', payload)

      if (!data.success) {
        return rejectWithValue({
          message: data.message || "Failed to join waitlist ❌",
          ...data
        })
      }

      return data
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to join waitlist' })
    }
  }
)

const addressSlice = createSlice({
  name: 'addresses',
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAddresses: (state) => {
      state.addresses = []
      state.error = null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false
        state.addresses = action.payload
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

      // Add
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload)
        toast.success("Address added successfully ✅")
      })
      .addCase(addAddress.rejected, (state, action) => {
        toast.error(action.payload?.message || "Failed to add address ❌")
      })

      // Update
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map(addr =>
          addr?.address_id === action.payload?.address_id ? action.payload : addr
        )
        toast.success("Address updated successfully ✅")
      })
      .addCase(updateAddress.rejected, (state, action) => {
        toast.error(action.payload?.message || "Failed to update address ❌")
      })

      // Delete
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(addr => addr?.address_id !== action.payload)
        toast.success("Address deleted ✅")
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        toast.error(action.payload?.message || "Failed to delete address ❌")
      })

      // Set Default Address
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map(addr => ({
          ...addr,
          default_address: addr.address_id === action.payload ? "Y" : "N",
        }))
        toast.success("Default address updated ✅")
      })
      .addCase(setDefaultAddress.rejected, (state, action) => {
        toast.error(action.payload?.message || "Failed to update default address ❌")
      })

      // 🔹 Join Waitlist
      .addCase(joinWaitlist.fulfilled, (state, action) => {
        toast.success("We’ll notify you when service is available in your area! ✅")
      })
      .addCase(joinWaitlist.rejected, (state, action) => {
        toast.error(action.payload?.message || "Failed to join waitlist ❌")
      })
  },
})

export const { clearAddresses } = addressSlice.actions
export default addressSlice.reducer
