import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  languages: [],
  filterLanguages: [],
  activeInActiveLanguages: "All",
  loading: false,
  error: null,
  id: null,
  value: "",
  noLanguagesFound: "",
  isConnected: true,
};

const LanguagesSlice = createSlice({
  name: "LanguagesSlice",
  initialState,
  reducers: {
    setLanguagesStart: (state) => {
      state.loading = true;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterLanguages: (state, action) => {
      state.filterLanguages = action.payload;
      state.error = null;
      state.loading = false;
    },

    setLanguagesEnd: (state) => {
      state.loading = false;
    },
    setInActiveActiveLanguages: (state, action) => {
      state.activeInActiveLanguages = action.payload;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoLanguagesFound: (state, action) => {
      state.noLanguagesFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setLanguages,
  setFilterLanguages,
  setLanguagesStart,
  setLanguagesEnd,
  setInActiveActiveLanguages,
  setId,
  setValue,
  setNoLanguagesFound,
  setIsConnected
} = LanguagesSlice.actions;

export default LanguagesSlice.reducer;
