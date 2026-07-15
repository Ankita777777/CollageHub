import { configureStore } from '@reduxjs/toolkit'
import authReducer      from '../features/auth/authSlice'
import noticeReducer    from '../features/notice/noticeSlice'
import studentReducer   from '../features/student/studentSlice'
import admissionReducer from '../features/admission/admissionSlice'
import contactReducer   from '../features/contact/contactSlice'

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    notice:    noticeReducer,
    student:   studentReducer,
    admission: admissionReducer,
    contact:   contactReducer,
  },
})