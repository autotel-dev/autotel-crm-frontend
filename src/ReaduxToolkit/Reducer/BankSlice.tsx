import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  banks: [],
  filterBanks: [],
  activeInActiveBanks: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noBanksFound: "",
  isConnected: true,
};

const BankSlice = createSlice({
  name: "BankSlice",
  initialState,
  reducers: {
    setBanksStart: (state) => {
      state.loading = true;
    },
    setBanks: (state, action) => {
      state.banks = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterBanks: (state, action) => {
      state.filterBanks = action.payload;
      state.error = null;
      state.loading = false;
    },

    setBanksEnd: (state) => {
      state.loading = false;
    },
    setInActiveActiveBanks: (state, action) => {
      state.activeInActiveBanks = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoBankFound: (state, action) => {
      state.noBanksFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setBanks,
  setFilterBanks,
  setBanksStart,
  setBanksEnd,
  setInActiveActiveBanks,
  setId,
  setValue,
  setNoBankFound,
  setIsConnected
} = BankSlice.actions;

export default BankSlice.reducer;
