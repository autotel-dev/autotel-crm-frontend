import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  insurance: [],
  filterInsurances: [],
  activeInActiveInsurances: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noInsuranceFound: "",
  isConnected: true,
};

const InsuranceSlice = createSlice({
  name: "InsuranceSlice",
  initialState,
  reducers: {
    setInsuranceStart: (state) => {
      state.loading = true;
    },
    setInsurance: (state, action) => {
      state.insurance = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterInsurances: (state, action) => {
      state.filterInsurances = action.payload;
      state.error = null;
      state.loading = false;
    },

    setInsuranceEnd: (state) => {
      state.loading = false;
    },
    setInActiveActiveInsurances: (state, action) => {
      state.activeInActiveInsurances = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoInsuranceFound: (state, action) => {
      state.noInsuranceFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setInsurance,
  setFilterInsurances,
  setInsuranceStart,
  setInsuranceEnd,
  setInActiveActiveInsurances,
  setId,
  setValue,
  setNoInsuranceFound,
  setIsConnected
} = InsuranceSlice.actions;

export default InsuranceSlice.reducer;
