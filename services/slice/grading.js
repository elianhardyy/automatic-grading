import { createSlice } from "@reduxjs/toolkit";

const gradingSlice = createSlice({
  name: "grading",
  initialState: {
    grading: null,
    loading: false,
    error: null,
  },
  reducers: {
    setGradingEdit: (state, action) => {
      state.grading = action.payload;
    },
  },
});
export const { setGradingEdit } = gradingSlice.actions;
export const gradingReducer = gradingSlice.reducer;
