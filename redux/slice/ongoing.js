import { createSlice } from "@reduxjs/toolkit";

const ongoingSlice = createSlice({
  name: "ongoing",
  initialState: {
    ongoing: [],
    loading: false,
    error: null,
  },
  reducers: {
    setOngoing: (state, action) => {
      state.ongoing = action.payload;
    },
    addOngoing: (state, action) => {
      state.ongoing.push(action.payload);
    },
    removeOngoing: (state, action) => {
      state.ongoing = state.ongoing.filter(
        (item) => item.id !== action.payload.id
      );
    },
    clearOngoing: (state) => {
      state.ongoing = [];
    },
  },
  extraReducers: (builder) => {},
});

export const { setOngoing, addOngoing, removeOngoing, clearOngoing } =
  ongoingSlice.actions;
export const ongoingReducer = ongoingSlice.reducer;
