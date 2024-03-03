import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  countries: [],
  filterCountries: [],
  activeInActiveCountries: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noCountryFound: "",
};

const CountrySlice = createSlice({
  name: "CountriesSlice",
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
    setInActiveActiveCountries: (state, action) => {
      state.activeInActiveCountries = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoCountryFound: (state, action) => {
      state.noCountryFound = action.payload;
    },
  },
});
export const {
  setCountries,
  setFilterCountries,
  setCountriesStart,
  setCountriesEnd,
  setInActiveActiveCountries,
  setId,
  setValue,
  setNoCountryFound,
} = CountrySlice.actions;

export default CountrySlice.reducer;
