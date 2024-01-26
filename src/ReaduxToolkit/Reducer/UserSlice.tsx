import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWIwZjkzNTAyZTA0MGE4NzY5ZGZhYzIiLCJyb2xlIjoiU1VQRVJfQURNSU4iLCJpYXQiOjE3MDYxOTI1ODQsImV4cCI6MTcwNjc5NzM4NH0.ObY5QD3vXVnlV392bO6HnhK9o8OeVqkWwVREJSfE6e8",
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
