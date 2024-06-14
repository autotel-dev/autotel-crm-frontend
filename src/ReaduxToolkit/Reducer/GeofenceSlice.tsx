import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  circle: null,
  rectangle: null,
  polygon: null,
  type: null,
  geofences: [],
  geofencesGroup: [],
  geofencesDetailData: [],
  loading: false,
  error: null,
  isConnected: true,
  editedItem: "",
};

const GeofenceSlice = createSlice({
  name: "GeofenceSlice",
  initialState,
  reducers: {
    setGeofencesStart: (state) => {
      state.loading = true;
    },
    setGeofences: (state, action) => {
      state.geofences = action.payload;
      state.error = null;
      state.loading = false;
    },
    setGeofencesGroup: (state, action) => {
      state.geofencesGroup = action.payload;
      state.error = null;
      state.loading = false;
    },
    setGeofencesDetailData: (state, action) => {
      state.geofencesDetailData = action.payload;
    },
    setCircle: (state, action) => {
      state.circle = action.payload;
    },
    setRectangle: (state, action) => {
      state.rectangle = action.payload;
    },
    setPolygon: (state, action) => {
      state.polygon = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setEditedItem: (state, action) => {
      state.editedItem = action.payload;
    },
    setGeofencesEnd: (state) => {
      state.loading = false;
    },

    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const {
  setGeofences,
  setGeofencesGroup,
  setGeofencesDetailData,
  setGeofencesStart,
  setGeofencesEnd,
  setCircle,
  setRectangle,
  setPolygon,
  setEditedItem,
  setType,
  setIsConnected,
} = GeofenceSlice.actions;

export default GeofenceSlice.reducer;
