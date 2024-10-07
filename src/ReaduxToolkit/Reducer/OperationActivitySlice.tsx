import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    activities: [],
    customers: [],
    installers: [],
    activitiy: null,
    loading: true,
};

const ActivitiesSlice = createSlice({
    name: "ActivitiesSlice",
    initialState,
    reducers: {

        setActivities: (state, action) => {
            state.activities = action.payload;
        },
        setCustomers: (state, action) => {
            state.customers = action.payload;
        },
        setInstallers: (state, action) => {
            state.installers = action.payload;
        },
        setActivity: (state, action) => {
            state.activitiy = action.payload;
        },
        setActivityLoading: (state, action) => {
            state.loading = action.payload;
        },

    },
});
export const {
    setActivities,
    setCustomers,
    setInstallers,
    setActivity,
    setActivityLoading

} = ActivitiesSlice.actions;

export default ActivitiesSlice.reducer;
