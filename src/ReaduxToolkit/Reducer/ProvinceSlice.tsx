import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provinces: [],
  countries: [],
  filterProvinces: [],
  countryId: null,
  loading: false,
  error: null,
  id: null,
  value: "",
  noDataFound: "",
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
    setNoDataFound: (state, action) => {
      state.noDataFound = action.payload;
    },
  },
});
export const {
  setProvincesStart,
  setProvinces,
  setFilterProvinces,
  setProvincesEnd,
  setCountries,
  setCountryId,
  setNoDataFound,
  setId,
  setValue,
} = ProvinceSlice.actions;

export default ProvinceSlice.reducer;
