import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  complainTypes: [],
  filterComplainTypes: [],
  setComplainTypePriorities: [],
  activeInActiveComplainTypes: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noComplainTypesFound: "",
  isConnected: true,
};

const ComplainsTypeSlice = createSlice({
  name: "ComplainsTypeSlice",
  initialState,
  reducers: {
    setComplainsTypesStart: (state) => {
      state.loading = true;
    },
    setComplainsTypes: (state, action) => {
      state.complainTypes = action.payload;
      state.error = null;
      state.loading = false;
    },
    setComplainTypePriorities: (state, action) => {
      state.setComplainTypePriorities = action.payload;
    },
    setFilterComplainsTypes: (state, action) => {
      state.filterComplainTypes = action.payload;
      state.error = null;
      state.loading = false;
    },

    setComplainsTypesEnd: (state) => {
      state.loading = false;
    },
    setInActiveComplainsTypes: (state, action) => {
      state.activeInActiveComplainTypes = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoComplainsTypesFound: (state, action) => {
      state.noComplainTypesFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setComplainsTypes,
  setFilterComplainsTypes,
  setComplainsTypesStart,
  setComplainsTypesEnd,
  setInActiveComplainsTypes,
  setId,
  setValue,
  setNoComplainsTypesFound,
  setComplainTypePriorities,
  setIsConnected,
} = ComplainsTypeSlice.actions;

export default ComplainsTypeSlice.reducer;
