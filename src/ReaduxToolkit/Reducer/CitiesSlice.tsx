import { createSlice } from "@reduxjs/toolkit";
import { getAll } from "../../Api";

const initialState = {
  cities: [],
  loading: false,
  error: null,
  id: null,
  value: "",
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
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
  },
});
export const { setCities, setId, setValue } = CitiesSlice.actions;

export default CitiesSlice.reducer;
