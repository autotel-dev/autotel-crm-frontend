import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allComplains: [],
    complainTypesList: [],
    complainStatusTypes: [],
    complainRoleSelection: [],
    createComplainModalData: null,
    loading: false,
    error: null,
    noComplainFound: "",
    isConnected: true,
};

const ComplainCenterSlice = createSlice({
    name: "ComplainCenterSlice",
    initialState,
    reducers: {
        setComplainCenterStart: (state) => {
            state.loading = true;
        },
        setAllComplains: (state, action) => {
            state.allComplains = action.payload;
            state.error = null;
            state.loading = false;
        },
        setComplainTypesList: (state, action) => {
            state.complainTypesList = action.payload;

        },
        setComplainStatusTypes: (state, action) => {
            state.complainStatusTypes = action.payload;

        },

        setComplainRoleSelection: (state, action) => {
            state.complainRoleSelection = action.payload;
        },
        setCreateComplainModalData: (state, action) => {
            state.createComplainModalData = action.payload;
            state.error = null;
            state.loading = false;
        },
        setComplainCenterEnd: (state) => {
            state.loading = false;
        },
        setNoComplainsFound: (state, action) => {
            state.noComplainFound = action.payload;
        },
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {
    setAllComplains, setComplainTypesList, setComplainStatusTypes, setComplainRoleSelection, setComplainCenterStart, setComplainCenterEnd, setCreateComplainModalData, setNoComplainsFound, setIsConnected
} = ComplainCenterSlice.actions;

export default ComplainCenterSlice.reducer;
