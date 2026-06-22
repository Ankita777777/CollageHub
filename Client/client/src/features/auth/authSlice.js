import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import API from '../../api.axios'

export const login = createAsyncThunk('auth/login', async(data, thunkAPI) =>{
    try{
        const res= await API.post('/auth/login', data)
        localStorage.setItem('user', JSON.stringify(res.data))
        return res.data
    }
    catch(err){
        return thunkAPI.rejectWithValue(err.response.data.message)
    }
})

export const logout = createAsyncThunk('auth/logout', async()=>{
    localStorage.removeItem('user')
})

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user: JSON.parse(localStorage.getItem('user')) || null,
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder) =>{
        builder
        .addDefaultCase(login.pending, (state)=> {state.loading = true; state.error=null})
        .addCase(login.fulfilled, (state,action)=>{ state.loading = false; state.user = action.payload})
   .addCase(login.rejected, (state, action)=> { state.loading = false; state.error= action.payload})
   .addCase(logout.fulfilled, (state)=>{state.user = null})
   
    }
})

export default authSlice.reducer
