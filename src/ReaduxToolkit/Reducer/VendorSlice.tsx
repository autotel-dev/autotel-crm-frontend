import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  vendor: [],
  cities: [],
  countries: [],
  filterVendor: [],
  activeInActiveVendor: "All",
  loading: true,
  error: null,
  id: null,
  cityId: null,
  countryId: null,
  value: "",
  noVendorFound: "",
  isConnected: true,
};

const VendorSlice = createSlice({
  name: "VendorSlice",
  initialState,
  reducers: {
    setVendorStart: (state) => {
      state.loading = true;
    },
    setVendor: (state, action) => {
      state.vendor = action.payload;
      // state.error = null;
      // state.loading = false;
    },
    setFilterVendor: (state, action) => {
      state.filterVendor = action.payload;
      // state.error = null;
      // state.loading = false;
    },
    setInActiveActiveVendor: (state, action) => {
      state.activeInActiveVendor = action.payload;
    },
    setCities: (state, action) => {
      state.cities = action.payload;
      state.error = null;
      // state.loading = false;
    },
    setCountries: (state, action) => {
      state.countries = action.payload;
      state.error = null;
      // state.loading = false;
    },
    setVendorEnd: (state) => {
      state.loading = false;
    },
    setCitiesId: (state, action) => {
      state.cityId = action.payload;
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
    setNoVendorFound: (state, action) => {
      state.noVendorFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
    setVendorLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});
export const {
  setVendor,
  setCountries,
  setInActiveActiveVendor,
  setCities,
  setVendorStart,
  setVendorEnd,
  setCitiesId,
  setCountryId,
  setFilterVendor,
  setId,
  setValue,
  setNoVendorFound,
  setIsConnected,
  setVendorLoading
} = VendorSlice.actions;

export default VendorSlice.reducer;
