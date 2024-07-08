import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  networkProvider: [],
  filterNetworkProvider: [],
  activeInActiveNetworkProvider: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noNetworkProviderFound: "",
  isConnected: true,
};

const NetworkProviderSlice = createSlice({
  name: "NetworkProviderSlice",
  initialState,
  reducers: {
    setNetworkProviderStart: (state) => {
      state.loading = true;
    },
    setNetworkProvider: (state, action) => {
      state.networkProvider = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterNetworkProvider: (state, action) => {
      state.filterNetworkProvider = action.payload;
      state.error = null;
      state.loading = false;
    },

    setNetworkProviderEnd: (state) => {
      state.loading = false;
    },
    setInActiveActiveNetworkProvider: (state, action) => {
      state.activeInActiveNetworkProvider = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoNetworkProviderFound: (state, action) => {
      state.noNetworkProviderFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setNetworkProvider,
  setFilterNetworkProvider,
  setNetworkProviderStart,
  setNetworkProviderEnd,
  setInActiveActiveNetworkProvider,
  setId,
  setValue,
  setNoNetworkProviderFound,
  setIsConnected
} = NetworkProviderSlice.actions;

export default NetworkProviderSlice.reducer;
