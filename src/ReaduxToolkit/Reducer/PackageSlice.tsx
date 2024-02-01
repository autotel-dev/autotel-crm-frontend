import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  packages: [],
  filterPackages: [],
  allPackagesDuration: [],
  loading: false,
  error: null,
  id: null,
  value: "",
  noPackageFound: "",
  packageDays: null,
  packageDuration: null,
  package: {},
};

const PackageSlice = createSlice({
  name: "PackageSlice",
  initialState,
  reducers: {
    setPackage: (state, action) => {
      state.package = action.payload;
    },
    setPackagesStart: (state) => {
      state.loading = true;
    },
    setPackages: (state, action) => {
      state.packages = action.payload;
      state.error = null;
      state.loading = false;
    },
    setAllPackagesDuration: (state, action) => {
      state.allPackagesDuration = action.payload;
      state.error = null;
      state.loading = false;
    },
    setPackagesEnd: (state) => {
      state.loading = false;
    },
    setFilterPackages: (state, action) => {
      state.filterPackages = action.payload;
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
  },
});
export const {
  setPackage,
  setPackages,
  setFilterPackages,
  setId,
  setPackageDays,
  setPackageDuration,
  setPackagesStart,
  setPackagesEnd,
  setAllPackagesDuration,
  setNoPackageFound,
} = PackageSlice.actions;

export default PackageSlice.reducer;
