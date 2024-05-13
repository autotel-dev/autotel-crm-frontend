import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allComplains: [],
    complainTypesList: [],
    complainStatusTypes: [],
    complainPriorityTypes: [],
    complainRoleSelection: [],
    complainCenterStatistics: [],
    complainCenterRoles: [],
    tableRow: null,
    complainDetails: null,
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
        setComplainPriorityTypes: (state, action) => {
            state.complainPriorityTypes = action.payload;
        },
        setTableRow: (state, action) => {
            state.tableRow = action.payload;
        },
        setComplainDetails: (state, action) => {
            state.complainDetails = action.payload;
        },
        setComplainCenterStatistics: (state, action) => {
            state.complainCenterStatistics = action.payload;
        },
        setComplainCenterRoles: (state, action) => {
            state.complainCenterRoles = action.payload;
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
    setAllComplains, setComplainTypesList, setComplainStatusTypes, setComplainPriorityTypes, setTableRow, setComplainDetails, setComplainCenterStatistics, setComplainCenterRoles, setComplainRoleSelection, setComplainCenterStart, setComplainCenterEnd, setCreateComplainModalData, setNoComplainsFound, setIsConnected
} = ComplainCenterSlice.actions;

export default ComplainCenterSlice.reducer;
