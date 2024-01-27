import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
};

const UserSlice = createSlice({
  name: "UserSlice",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});
export const { setToken } = UserSlice.actions;

export default UserSlice.reducer;
