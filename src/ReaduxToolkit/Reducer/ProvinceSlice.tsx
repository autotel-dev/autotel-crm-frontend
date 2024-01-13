import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provinces: [],
  loading: false,
  error: null,
  id: null,
  value: "",
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
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { setProvinces, setId, setValue } = ProvinceSlice.actions;

export default ProvinceSlice.reducer;
