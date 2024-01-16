import { createSlice } from "@reduxjs/toolkit";
import { getAll } from "../../Api";

const initialState = {
  countries: [],
  filterCountries: [],
  loading: false,
  error: null,
  id: null,
  value: "",
  noDataFound:""
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
    setFilterCountries: (state, action) => {
      state.filterCountries = action.payload;
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
    setNoDataFound: (state, action) => {
      state.noDataFound = action.payload;
    },
  },
});
export const {
  setCountries,
  setFilterCountries,
  setCountriesStart,
  setCountriesEnd,
  setNoDataFound,
  setId,
  setValue,
} = CountrySlice.actions;

export default CountrySlice.reducer;
