import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trips: [],
  filterTrips: [],
  selectedTrip: null,
  loading: false,
  error: null,
  id: null,
  value: "",
  noTripFound: "",
  isConnected: true,
};

const TripSlice = createSlice({
  name: "TripSlice",
  initialState,
  reducers: {
    setTripStart: (state) => {
      state.loading = true;
    },
    setTrips: (state, action) => {
      state.trips = action.payload;
      state.error = null;
      state.loading = false;
    },
    setFilterTrips: (state, action) => {
      state.filterTrips = action.payload;
      state.error = null;
      state.loading = false;
    },
    setSelectedTrip: (state, action) => {
      state.selectedTrip = action.payload;
    },
    setTripEnd: (state) => {
      state.loading = false;
    },
    setId: (state, action) => {
      state.id = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
    setNoTripFound: (state, action) => {
      state.noTripFound = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const {
  setTrips,
  setFilterTrips,
  setSelectedTrip,
  setTripStart,
  setTripEnd,
  setId,
  setValue,
  setNoTripFound,
  setIsConnected,
} = TripSlice.actions;

export default TripSlice.reducer;
