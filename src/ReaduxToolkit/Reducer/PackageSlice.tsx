import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  packages: [],
  loading: false,
  error: null,
  id: null,
  value: "",
};

const PackageSlice = createSlice({
  name: "PackageSlice",
  initialState,
  reducers: {
    setPackages: (state, action) => {
      state.packages = action.payload;
      state.error = null;
      state.loading = false;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
  },
});
export const { setPackages, setId } = PackageSlice.actions;

export default PackageSlice.reducer;
