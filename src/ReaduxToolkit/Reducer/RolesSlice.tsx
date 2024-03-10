import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roles: [],
  filterRoles: [],
  userPermissions: [],
  activeInActiveRoles: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noCountryFound: "",
};

const RolesSlice = createSlice({
  name: "RolesSlice",
  initialState,
  reducers: {
    setRolesStart: (state) => {
      state.loading = true;
    },
    setRoles: (state, action) => {
      state.roles = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterRoles: (state, action) => {
      state.filterRoles = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveRoles: (state, action) => {
      state.activeInActiveRoles = action.payload;
    },
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
      state.error = null;
      state.loading = false;
    },
    setRolesEnd: (state) => {
      state.loading = false;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoRolesFound: (state, action) => {
      state.noCountryFound = action.payload;
    },
  },
});
export const {
  setRoles,
  setFilterRoles,
  setInActiveActiveRoles,
  setRolesStart,
  setRolesEnd,
  setUserPermissions,
  setId,
  setValue,
  setNoRolesFound,
} = RolesSlice.actions;

export default RolesSlice.reducer;
