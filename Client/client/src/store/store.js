import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import noticeReducer from '../features/notice/noticeSlice'
import studentReducer from '../features/student/studentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notice: noticeReducer,
    student: studentReducer,
  },
})