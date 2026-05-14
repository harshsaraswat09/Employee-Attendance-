import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/auth.slice.js";
import attendanceReducer from "../features/attendance/store/attendance.slice.js";
import overtimeReducer from "../features/overtime/store/overtime.slice.js";
import userReducer from "../features/dashboard/store/user.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    overtime: overtimeReducer,
    user: userReducer,
  },
});

export default store;