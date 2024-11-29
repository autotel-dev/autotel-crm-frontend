import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  servicePackages: [],
  serviceFilterPackages: [],
  services: [],
  allPackagesDuration: [],
  activeInActivePackages: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noPackageFound: "",
  packageDays: null,
  packageDuration: null,
  package: {},
  isConnected: true,
};

const CompanyServicePackageSlice = createSlice({
  name: "CompanyServicePackageSlice",
  initialState,
  reducers: {
    setPackage: (state, action) => {
      state.package = action.payload;
    },
    setPackagesStart: (state) => {
      state.loading = true;
    },
    setServicePackages: (state, action) => {
      state.servicePackages = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActivePackages: (state, action) => {
      state.activeInActivePackages = action.payload;
    },
    setAllPackagesDuration: (state, action) => {
      state.allPackagesDuration = action.payload;
      state.error = null;
      state.loading = false;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setPackagesEnd: (state) => {
      state.loading = false;
    },
    setServiceFilterPackages: (state, action) => {
      state.serviceFilterPackages = action.payload;
      state.error = null;
      state.loading = false;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setPackageDays: (state, action) => {
      state.packageDays = action.payload;
    },
    setPackageDuration: (state, action) => {
      state.packageDuration = action.payload;
    },
    setNoPackageFound: (state, action) => {
      state.noPackageFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setPackage,
  setServicePackages,
  setServiceFilterPackages,
  setInActiveActivePackages,
  setServices,
  setId,
  setPackageDays,
  setPackageDuration,
  setPackagesStart,
  setPackagesEnd,
  setAllPackagesDuration,
  setNoPackageFound,
  setIsConnected,
} = CompanyServicePackageSlice.actions;

export default CompanyServicePackageSlice.reducer;
