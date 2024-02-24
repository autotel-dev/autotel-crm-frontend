import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  userData: null,
  serverPermissions: [],
};

const UserSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setServerPermissions: (state, action) => {
      state.serverPermissions = action.payload;
    },
  },
});
export const { setToken, setUserData, setServerPermissions } =
  UserSlice.actions;

export default UserSlice.reducer;
