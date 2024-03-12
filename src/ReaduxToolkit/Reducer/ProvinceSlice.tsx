import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provinces: [],
  countries: [],
  filterProvinces: [],
  activeInActiveProvinces: "All",
  countryId: null,
  loading: false,
  error: null,
  id: null,
  value: "",
  noProvinceFound: "",
  countryName: "",
  isConnected: true,
};

const ProvinceSlice = createSlice({
  name: "ProvinceSlice",
  initialState,
  reducers: {
    setProvincesStart: (state) => {
      state.loading = true;
    },
    setProvinces: (state, action) => {
      state.provinces = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterProvinces: (state, action) => {
      state.filterProvinces = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveProvinces: (state, action) => {
      state.activeInActiveProvinces = action.payload;
    },
    setProvincesEnd: (state) => {
      state.loading = false;
    },
    setCountries: (state, action) => {
      state.countries = action.payload;
      state.error = null;
      state.loading = false;
    },

    setCountryId: (state, action) => {
      state.countryId = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoProvinceFound: (state, action) => {
      state.noProvinceFound = action.payload;
    },
    setCountryName: (state, action) => {
      state.countryName = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setProvincesStart,
  setProvinces,
  setFilterProvinces,
  setInActiveActiveProvinces,
  setProvincesEnd,
  setCountries,
  setCountryId,
  setNoProvinceFound,
  setId,
  setValue,
  setCountryName,
  setIsConnected
} = ProvinceSlice.actions;

export default ProvinceSlice.reducer;
