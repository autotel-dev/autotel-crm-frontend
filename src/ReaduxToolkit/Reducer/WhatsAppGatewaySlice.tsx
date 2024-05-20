import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    whatsAppGatewayData: null,
    isConnected: true,
};

const WhatsAppGatewaySlice = createSlice({
    name: "WhatsAppGatewaySlice",
    initialState,
    reducers: {
        setWhatsAppGatewayData: (state, action) => {
            state.whatsAppGatewayData = action.payload;
        },
        setIsConnected: (state, action) => {
            state.isConnected = action.payload;
        },
    },
});
export const { setWhatsAppGatewayData, setIsConnected } = WhatsAppGatewaySlice.actions;

export default WhatsAppGatewaySlice.reducer;
