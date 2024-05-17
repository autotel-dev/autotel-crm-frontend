import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  emailGatewayData: null,
  isConnected: true,
};

const EmailGatewaySlice = createSlice({
  name: "EmailGatewaySlice",
  initialState,
  reducers: {
    setEmailGatewayData: (state, action) => {
      state.emailGatewayData = action.payload;
    },
    setIsConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});
export const { setEmailGatewayData, setIsConnected } =
  EmailGatewaySlice.actions;

export default EmailGatewaySlice.reducer;
