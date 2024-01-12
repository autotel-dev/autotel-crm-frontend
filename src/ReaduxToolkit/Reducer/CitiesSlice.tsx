import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cities: [],
  loading: false,
  error: null,
};

const CitiesSlice = createSlice({
  name: "CitiesSlice",
  initialState,
  reducers: {
    setCities: (state, action) => {
      state.cities = action.payload;
      state.error = null;
      state.loading = false;
    },
  },
});
export const { setCities } = CitiesSlice.actions;

export default CitiesSlice.reducer;
