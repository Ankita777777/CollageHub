import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const fetchProfile = createAsyncThunk('student/profile', async (_, thunkAPI) => {
  try {
    const res = await API.get('/students/profile')
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const fetchAttendance = createAsyncThunk('student/attendance', async (_, thunkAPI) => {
  try {
    const res = await API.get('/students/attendance')
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const fetchResults = createAsyncThunk('student/results', async (_, thunkAPI) => {
  try {
    const res = await API.get('/students/results')
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const fetchFeeStatus = createAsyncThunk('student/fee', async (_, thunkAPI) => {
  try {
    const res = await API.get('/students/fee')
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const applyLeave = createAsyncThunk('student/applyLeave', async (data, thunkAPI) => {
  try {
    const res = await API.post('/students/leave', data)
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

export const fetchLeaves = createAsyncThunk('student/leaves', async (_, thunkAPI) => {
  try {
    const res = await API.get('/students/leave')
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed')
  }
})

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    profile:    null,
    attendance: { records: [], summary: [] },
    results:    [],
    fee:        { feeStatus: 'due', payments: [] },
    leaves:     [],
    loading:    false,
    error:      null,
  },
  reducers: {
    clearStudentError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    const handle = (thunk, field) => {
      builder
        .addCase(thunk.pending,   (state) => { state.loading = true; state.error = null })
        .addCase(thunk.fulfilled, (state, action) => { state.loading = false; if (field) state[field] = action.payload })
        .addCase(thunk.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
    }
    handle(fetchProfile,    'profile')
    handle(fetchAttendance, 'attendance')
    handle(fetchResults,    'results')
    handle(fetchFeeStatus,  'fee')
    handle(applyLeave,      null)
    handle(fetchLeaves,     'leaves')
  },
})

export const { clearStudentError } = studentSlice.actions
export default studentSlice.reducer