import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@/services/api/axios'
import { toast } from 'react-toastify'

// 🔹 Fetch all payment cards
export const fetchPaymentCards = createAsyncThunk(
  'cards/fetchPaymentCards',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('api/user/dashboard/card/list')
      return data.data.cards
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch cards' })
    }
  }
)

// 🔹 Add a new payment card
export const addPaymentCard = createAsyncThunk(
  'cards/addPaymentCard',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('api/user/booking/payment/card/add', payload)
      return data.data.card;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add card' })
    }
  }
)

// 🔹 Delete a payment card
export const deletePaymentCard = createAsyncThunk(
  'cards/deletePaymentCard',
  async ({ cardId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`api/user/booking/payment/card/${cardId}`, {
        "booking_session_token": "booking_session_6679b2185631a2.00523624"
      })
      return cardId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete card' })
    }
  }
)

// 🔹 Verify card thunk
export const verifyPaymentCard = createAsyncThunk(
  'cards/verifyPaymentCard',
  async ({ user_billing_id, amount }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        'api/user/booking/payment/card/verify',
        { user_billing_id, amount }
      );

      return {
        user_billing_id,
        verified_at: data.data.verified_at,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: 'Failed to verify card' }
      );
    }
  }
);

const paymentCardsSlice = createSlice({
  name: 'cards',
  initialState: {
    cards: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCard: (state) => {
      state.cards = []
      state.error = null
      state.loading = false
    },
    removeCardId: (state, action) => {
      state.cards = state.cards.filter(card => card.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Cards
      .addCase(fetchPaymentCards.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentCards.fulfilled, (state, action) => {
        state.loading = false
        state.cards = action.payload
      })
      .addCase(fetchPaymentCards.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Something went wrong'
      })

      // 🔹 Add Card
      .addCase(addPaymentCard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addPaymentCard.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload) {
          state.cards.push(action.payload)
        }
        toast.success('Card added successfully ✅')
      })
      .addCase(addPaymentCard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to add card'
        toast.error(state.error)
      })

      // 🔹 Delete Card
      .addCase(deletePaymentCard.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePaymentCard.fulfilled, (state, action) => {
        state.loading = false
        state.cards = state.cards.filter(card => card.billing_id !== action.payload)
        toast.success('Card deleted successfully 🗑️')
      })
      .addCase(deletePaymentCard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to delete card'
        toast.error(state.error)
      })
  },
})

export const { clearCard, removeCardId } = paymentCardsSlice.actions
export default paymentCardsSlice.reducer
