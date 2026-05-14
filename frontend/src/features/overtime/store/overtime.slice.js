import { createSlice } from "@reduxjs/toolkit";

const overtimeSlice = createSlice({
  name: "overtime",
  initialState: {
    myOvertimes: [],
    pendingOvertimes: [],
    loading: false,
    error: null,
  },
  reducers: {
    setMyOvertimes: (state, action) => {
      state.myOvertimes = action.payload;
    },
    setPendingOvertimes: (state, action) => {
      state.pendingOvertimes = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMyOvertimes,
  setPendingOvertimes,
  setLoading,
  setError,
} = overtimeSlice.actions;

export default overtimeSlice.reducer;