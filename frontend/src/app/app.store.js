import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/auth.slice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;