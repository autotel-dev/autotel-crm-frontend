import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branch: [],
  filterBranches: [],
  userPermissions: [],
  activeInActiveBranches: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noBranchFound: "",
  isConnected: true,
};

const BranchSlice = createSlice({
  name: "BranchSlice",
  initialState,
  reducers: {
    setBranchStart: (state) => {
      state.loading = true;
    },
    setBranch: (state, action) => {
      state.branch = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterBranches: (state, action) => {
      state.filterBranches = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveBranches: (state, action) => {
      state.activeInActiveBranches = action.payload;
    },
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
      state.error = null;
      state.loading = false;
    },
    setBranchEnd: (state) => {
      state.loading = false;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoBranchFound: (state, action) => {
      state.noBranchFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setBranch,
  setFilterBranches,
  setInActiveActiveBranches,
  setBranchStart,
  setBranchEnd,
  setUserPermissions,
  setId,
  setValue,
  setNoBranchFound,
  setIsConnected
} = BranchSlice.actions;

export default BranchSlice.reducer;
