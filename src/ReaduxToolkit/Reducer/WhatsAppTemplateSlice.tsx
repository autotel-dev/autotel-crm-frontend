import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    whatsAppTemplates: [],
    filterWhatsAppTemplates: [],
    loading: false,
    error: null,
    id: null,
    value: "",
    noWhatsAppTemplatesFound: "",
    isConnected: true,
};

const WhatsAppTemplatesSlice = createSlice({
    name: "WhatsAppTemplatesSlice",
    initialState,
    reducers: {
        setWhatsAppTemplatesStart: (state) => {
            state.loading = true;
        },
        setWhatsAppTemplates: (state, action) => {
            state.whatsAppTemplates = action.payload;
            state.error = null;
            state.loading = false;
        },
        setFilterWhatsAppTemplates: (state, action) => {
            state.filterWhatsAppTemplates = action.payload;
            state.error = null;
            state.loading = false;
        },

        setWhatsAppTemplatesEnd: (state) => {
            state.loading = false;
        },
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const {
    setWhatsAppTemplates,
    setFilterWhatsAppTemplates,
    setWhatsAppTemplatesStart,
    setWhatsAppTemplatesEnd,
    setIsConnected
} = WhatsAppTemplatesSlice.actions;

export default WhatsAppTemplatesSlice.reducer;
