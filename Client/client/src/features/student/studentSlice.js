import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const fetchProfile = createAsyncThunk('student/profile', async (_, thunkAPI) => {
  try {
    const res = await API.get('/students/profile')
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const fetchAttendance = createAsyncThunk('student/attendance', async (_, thunkAPI) => {
  try {
    const res = await API.get('/students/attendance')
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const fetchResults = createAsyncThunk('student/results', async (_, thunkAPI) => {
  try {
    const res = await API.get('/students/results')
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const fetchFeeStatus = createAsyncThunk('student/fee', async (_, thunkAPI) => {
  try {
    const res = await API.get('/students/fee')
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const applyLeave = createAsyncThunk('student/applyLeave', async (data, thunkAPI) => {
  try {
    const res = await API.post('/students/leave', data)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    profile: null,
    attendance: { records: [], summary: [] },
    results: [],
    fee: { feeStatus: '', payments: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled,    (state, action) => { state.profile = action.payload })
      .addCase(fetchAttendance.fulfilled, (state, action) => { state.attendance = action.payload })
      .addCase(fetchResults.fulfilled,    (state, action) => { state.results = action.payload })
      .addCase(fetchFeeStatus.fulfilled,  (state, action) => { state.fee = action.payload })
      .addMatcher(
        (action) => action.type.startsWith('student/') && action.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null }
      )
      .addMatcher(
        (action) => action.type.startsWith('student/') && action.type.endsWith('/fulfilled'),
        (state) => { state.loading = false }
      )
      .addMatcher(
        (action) => action.type.startsWith('student/') && action.type.endsWith('/rejected'),
        (state, action) => { state.loading = false; state.error = action.payload }
      )
  },
})

export default studentSlice.reducer