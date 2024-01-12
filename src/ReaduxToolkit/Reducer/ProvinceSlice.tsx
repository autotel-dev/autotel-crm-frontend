import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provinces: [],
  loading: false,
  error: null,
};

const ProvinceSlice = createSlice({
  name: "ProvinceSlice",
  initialState,
  reducers: {
    setProvinces: (state, action) => {
      state.provinces = action.payload;
      state.error = null;
      state.loading = false;
    },
  },
});
export const { setProvinces } = ProvinceSlice.actions;

export default ProvinceSlice.reducer;
