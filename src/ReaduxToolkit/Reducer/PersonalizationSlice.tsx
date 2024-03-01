import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userPersonalizationData: null,
};

const PersonalizationSlice = createSlice({
  name: "PersonalizationSlice",
  initialState,
  reducers: {
    setUserPersonalizationData: (state, action) => {
      state.userPersonalizationData = action.payload;
    },
  },
});
export const { setUserPersonalizationData } = PersonalizationSlice.actions;

export default PersonalizationSlice.reducer;
