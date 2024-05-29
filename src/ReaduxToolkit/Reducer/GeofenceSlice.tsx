import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    circle: null,
    rectangle: null,
    polygon: [],
    type: null,
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
            state.polygon = action.payload;
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

