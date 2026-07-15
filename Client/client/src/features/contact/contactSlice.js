import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const sendContact = createAsyncThunk(
  'contact/send',
  async (formData, thunkAPI) => {
    try {
      const res = await API.post('/contact', formData)
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to send message'
      )
    }
  }
)

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    loading: false,
    error:   null,
    success: false,
    message: '',
  },
  reducers: {
    resetContact: (state) => {
      state.loading = false
      state.error   = null
      state.success = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContact.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(sendContact.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload.message
      })
      .addCase(sendContact.rejected,  (state, action) => {
        state.loading = false
        state.error   = action.payload
      })
  },
})

export const { resetContact } = contactSlice.actions
export default contactSlice.reducer