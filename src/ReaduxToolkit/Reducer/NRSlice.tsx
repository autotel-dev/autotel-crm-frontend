import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    report: [],
};

const NRSlice = createSlice({
    name: "NRSlice",
    initialState,
    reducers: {
        setNRReport: (state, action) => {
            state.report = action.payload;
        },
    },
});
export const {
    setNRReport
} = NRSlice.actions;

export default NRSlice.reducer;
