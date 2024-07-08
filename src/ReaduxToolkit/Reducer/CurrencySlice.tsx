import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currencies: [],
  filterCurrencies: [],
  activeInActiveCurrencies: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noCurrenciesFound: "",
  isConnected: true,
};

const CurrenciesSlice = createSlice({
  name: "CurrenciesSlice",
  initialState,
  reducers: {
    setCurrenciesStart: (state) => {
      state.loading = true;
    },
    setCurrencies: (state, action) => {
      state.currencies = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterCurrencies: (state, action) => {
      state.filterCurrencies = action.payload;
      state.error = null;
      state.loading = false;
    },

    setCurrenciesEnd: (state) => {
      state.loading = false;
    },
    setInActiveActiveCurrencies: (state, action) => {
      state.activeInActiveCurrencies = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoCurrenciesFound: (state, action) => {
      state.noCurrenciesFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setCurrencies,
  setFilterCurrencies,
  setCurrenciesStart,
  setCurrenciesEnd,
  setInActiveActiveCurrencies,
  setId,
  setValue,
  setNoCurrenciesFound,
  setIsConnected
} = CurrenciesSlice.actions;

export default CurrenciesSlice.reducer;
