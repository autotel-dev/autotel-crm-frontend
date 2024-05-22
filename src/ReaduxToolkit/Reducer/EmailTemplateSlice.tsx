import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    emailTemplates: [],
    filterEmailTemplates: [],
    loading: false,
    error: null,
    id: null,
    value: "",
    noEmailTemplatesFound: "",
    isConnected: true,
};

const EmailTemplatesSlice = createSlice({
    name: "EmailTemplatesSlice",
    initialState,
    reducers: {
        setEmailTemplatesStart: (state) => {
            state.loading = true;
        },
        setEmailTemplates: (state, action) => {
            state.emailTemplates = action.payload;
            state.error = null;
            state.loading = false;
        },
        setFilterEmailTemplates: (state, action) => {
            state.filterEmailTemplates = action.payload;
            state.error = null;
            state.loading = false;
        },

        setEmailTemplatesEnd: (state) => {
            state.loading = false;
        },
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {
    setEmailTemplates,
    setFilterEmailTemplates,
    setEmailTemplatesStart,
    setEmailTemplatesEnd,
    setIsConnected
} = EmailTemplatesSlice.actions;

export default EmailTemplatesSlice.reducer;
