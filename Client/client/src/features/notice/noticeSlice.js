import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../../api/axios'

export const fetchNotices = createAsyncThunk('notice/fetchAll', async (params, thunkAPI) => {
  try {
    const res = await API.get('/notices', { params })
    return res.data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const createNotice = createAsyncThunk('notice/create', async (data, thunkAPI) => {
  try {
    const res = await API.post('/notices', data)
    return res.data.notice
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const deleteNotice = createAsyncThunk('notice/delete', async (id, thunkAPI) => {
  try {
    await API.delete(`/notices/${id}`)
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

const noticeSlice = createSlice({
  name: 'notice',
  initialState: { notices: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending,   (state) => { state.loading = true })
      .addCase(fetchNotices.fulfilled, (state, action) => { state.loading = false; state.notices = action.payload })
      .addCase(fetchNotices.rejected,  (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(createNotice.fulfilled, (state, action) => { state.notices.unshift(action.payload) })
      .addCase(deleteNotice.fulfilled, (state, action) => {
        state.notices = state.notices.filter((n) => n._id !== action.payload)
      })
  },
})

export default noticeSlice.reducer