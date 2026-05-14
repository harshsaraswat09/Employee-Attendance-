import { createSlice } from "@reduxjs/toolkit";

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    records: [],
    todayRecord: null,
    teamRecords: [],
    allRecords: [],
    report: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRecords: (state, action) => {
      state.records = action.payload;
    },
    setTodayRecord: (state, action) => {
      state.todayRecord = action.payload;
    },
    setTeamRecords: (state, action) => {
      state.teamRecords = action.payload;
    },
    setAllRecords: (state, action) => {
      state.allRecords = action.payload;
    },
    setReport: (state, action) => {
      state.report = action.payload;
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
  setRecords,
  setTodayRecord,
  setTeamRecords,
  setAllRecords,
  setReport,
  setLoading,
  setError,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;