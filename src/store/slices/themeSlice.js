import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: { isDarkMode: false },
  reducers: {
    //action + reducer
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});
//themeSlice.actions.toggleTheme(); // create toogleTheme action
