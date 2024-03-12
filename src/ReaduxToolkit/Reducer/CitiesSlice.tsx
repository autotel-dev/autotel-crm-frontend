import { createSlice } from "@reduxjs/toolkit";
import { getAll } from "../../Api";

const initialState = {
  cities: [],
  provinces: [],
  countries: [],
  filterCities: [],
  activeInActiveCities: "All",
  loading: false,
  error: null,
  id: null,
  provinceId: null,
  countryId: null,
  value: "",
  noCityFound: "",
  isConnected: true,
};

const CitiesSlice = createSlice({
  name: "CitiesSlice",
  initialState,
  reducers: {
    setCitiesStart: (state) => {
      state.loading = true;
    },
    setCities: (state, action) => {
      state.cities = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterCities: (state, action) => {
      state.filterCities = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveCities: (state, action) => {
      state.activeInActiveCities = action.payload;
    },
    setProvinces: (state, action) => {
      state.provinces = action.payload;
      state.error = null;
      state.loading = false;
    },
    setCountries: (state, action) => {
      state.countries = action.payload;
      state.error = null;
      state.loading = false;
    },
    setCitiesEnd: (state) => {
      state.loading = false;
    },
    setProvinceId: (state, action) => {
      state.provinceId = action.payload;
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
    setNoCityFound: (state, action) => {
      state.noCityFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setCities,
  setCountries,
  setInActiveActiveCities,
  setProvinces,
  setCitiesStart,
  setCitiesEnd,
  setProvinceId,
  setCountryId,
  setFilterCities,
  setId,
  setValue,
  setNoCityFound,
  setIsConnected,
} = CitiesSlice.actions;

export default CitiesSlice.reducer;
