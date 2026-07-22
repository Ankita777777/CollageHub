import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user:    user || null,
  loading: false,
  error:   null,
  success: false,
  message: '',
}

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    return await authService.login(credentials)
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Login failed'
    )
  }
})

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    return await authService.register(userData)
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Registration failed'
    )
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout()
})

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    return await authService.getMe()
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || 'Failed to get user'
    )
  }
})

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, thunkAPI) => {
    try {
      return await authService.updateProfile(formData)
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to update profile'
      )
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      return await authService.forgotPassword(email)
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to send reset email'
      )
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, thunkAPI) => {
    try {
      return await authService.resetPassword(token, password)
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to reset password'
      )
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false
      state.error   = null
      state.success = false
      state.message = ''
    },
    clearError: (state) => {
      state.error = null
    },
    // ✅ Update user in state and localStorage
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
      localStorage.setItem('user', JSON.stringify(state.user))
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload
        state.success = true
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(login.rejected,  (state, action) => {
        state.loading = false
        state.error   = action.payload
        state.user    = null
      })

      // Register
      .addCase(register.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user    = action.payload
        state.success = true
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
      .addCase(register.rejected,  (state, action) => {
        state.loading = false
        state.error   = action.payload
        state.user    = null
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user    = null
        state.success = false
        state.error   = null
        localStorage.removeItem('user')
      })

      // Get Me
      .addCase(getMe.pending,   (state) => { state.loading = true })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false
        // Merge with existing (keep token)
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      })
      .addCase(getMe.rejected,  (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

      // Update Profile
      .addCase(updateUserProfile.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        // ✅ Update user and persist to localStorage
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem('user', JSON.stringify(state.user))
      })
      .addCase(updateUserProfile.rejected,  (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

      // Forgot Password
      .addCase(forgotPassword.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.message = action.payload?.message || ''
      })
      .addCase(forgotPassword.rejected,  (state, action) => {
        state.loading = false
        state.error   = action.payload
      })

      // Reset Password
      .addCase(resetPassword.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(resetPassword.fulfilled, (state) => { state.loading = false; state.success = true })
      .addCase(resetPassword.rejected,  (state, action) => {
        state.loading = false
        state.error   = action.payload
      })
  },
})

export const { reset, clearError, updateUser } = authSlice.actions
export default authSlice.reducer