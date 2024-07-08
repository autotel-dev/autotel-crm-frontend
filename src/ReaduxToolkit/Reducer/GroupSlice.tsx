import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  group: [],
  filterGroups: [],
  userPermissions: [],
  activeInActiveGroups: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noGroupFound: "",
  isConnected: true,
};

const GroupSlice = createSlice({
  name: "GroupSlice",
  initialState,
  reducers: {
    setGroupStart: (state) => {
      state.loading = true;
    },
    setGroup: (state, action) => {
      state.group = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterGroups: (state, action) => {
      state.filterGroups = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInActiveActiveGroups: (state, action) => {
      state.activeInActiveGroups = action.payload;
    },
    setUserPermissions: (state, action) => {
      state.userPermissions = action.payload;
      state.error = null;
      state.loading = false;
    },
    setGroupEnd: (state) => {
      state.loading = false;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoGroupFound: (state, action) => {
      state.noGroupFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setGroup,
  setFilterGroups,
  setInActiveActiveGroups,
  setGroupStart,
  setGroupEnd,
  setUserPermissions,
  setId,
  setValue,
  setNoGroupFound,
  setIsConnected
} = GroupSlice.actions;

export default GroupSlice.reducer;
