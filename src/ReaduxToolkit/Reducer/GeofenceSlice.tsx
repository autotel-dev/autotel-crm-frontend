import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    circle: {
        center: { lat: 24.8607, lng: 67.0011 },
        radius: 1000, // Initial radius in meters
    },
    rectangle: {
        bounds: {
            north: 24.8707,
            south: 24.8507,
            east: 67.0211,
            west: 67.0011,
        },
    },
    polygon: [
        { lat: 24.8607, lng: 67.0011 },
        { lat: 24.8617, lng: 67.0021 },
        { lat: 24.8627, lng: 67.0031 },
        { lat: 24.8637, lng: 67.0041 },
    ],
    type: "",
    geofences: [],
    loading: false,
    error: null,
    expandedDevice: null,
    isConnected: true,
    item: null,
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
        setCircle: (state, action) => {
            state.circle = action.payload;
        },
        setRectangle: (state, action) => {
            state.rectangle = action.payload;
        },
        setPolygon: (state, action) => {
            state.circle = action.payload;
        },
        setType: (state, action) => {
            state.type = action.payload
        },
        setGeofencesEnd: (state) => {
            state.loading = false;
        },
        // setExpandedDevice: (state, action) => {
        //     state.expandedDevice = action.payload;
        // },
        // setItem: (state, action) => {
        //     state.item = action.payload;
        // },



        // setNoDevicesFound: (state, action) => {
        //     state.noDevicesFound = action.payload;
        // },
        // setIsConnected: (state, action) => {
        //     state.isConnected = action.payload;
        // },
    },
});
export const {
    setGeofences,
    setGeofencesStart,
    setGeofencesEnd,
    setCircle, setRectangle, setPolygon, setType

} = GeofenceSlice.actions;

export default GeofenceSlice.reducer;

