import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const submitAdmission = createAsyncThunk(
  'admission/submit',
  async (formData, thunkAPI) => {
    try {
      const res = await API.post('/admissions', formData)
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Submission failed'
      )
    }
  }
)

export const fetchAdmissions = createAsyncThunk(
  'admission/fetchAll',
  async (params, thunkAPI) => {
    try {
      const res = await API.get('/admissions', { params })
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to fetch'
      )
    }
  }
)

export const updateAdmission = createAsyncThunk(
  'admission/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await API.put(`/admissions/${id}`, data)
      return res.data
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Update failed'
      )
    }
  }
)

export const deleteAdmission = createAsyncThunk(
  'admission/delete',
  async (id, thunkAPI) => {
    try {
      await API.delete(`/admissions/${id}`)
      return id
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Delete failed'
      )
    }
  }
)

const admissionSlice = createSlice({
  name: 'admission',
  initialState: {
    admissions: [],
    loading:    false,
    error:      null,
    success:    false,
  },
  reducers: {
    resetAdmission: (state) => {
      state.loading = false
      state.error   = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitAdmission.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(submitAdmission.fulfilled, (state) => { state.loading = false; state.success = true })
      .addCase(submitAdmission.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchAdmissions.pending,   (state) => { state.loading = true })
      .addCase(fetchAdmissions.fulfilled, (state, action) => { state.loading = false; state.admissions = action.payload })
      .addCase(fetchAdmissions.rejected,  (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(updateAdmission.fulfilled, (state, action) => {
        state.admissions = state.admissions.map((a) =>
          a._id === action.payload.admission._id ? action.payload.admission : a
        )
      })

      .addCase(deleteAdmission.fulfilled, (state, action) => {
        state.admissions = state.admissions.filter((a) => a._id !== action.payload)
      })
  },
})

export const { resetAdmission } = admissionSlice.actions
export default admissionSlice.reducer