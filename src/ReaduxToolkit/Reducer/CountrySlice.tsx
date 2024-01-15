import { createSlice } from "@reduxjs/toolkit";
import { getAll } from "../../Api";

const initialState = {
  countries: [],
  loading: false,
  error: null,
  id: null,
  value: "",
};

const CountrySlice = createSlice({
  name: "CitiesSlice",
  initialState,
  reducers: {
    setCountriesStart: (state) => {
      state.loading = true;
    },
    setCountries: (state, action) => {
      state.countries = action.payload;
      state.error = null;
      state.loading = false;
    },
    setCountriesEnd: (state) => {
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
export const {
  setCountries,
  setCountriesStart,
  setCountriesEnd,
  setId,
  setValue,
} = CountrySlice.actions;

export default CountrySlice.reducer;
