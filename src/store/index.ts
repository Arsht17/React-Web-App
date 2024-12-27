import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./slices/themeSlice";
import { boardsSlice } from "./slices/boardsSlice";

export * from "./slices/themeSlice";
export * from "./slices/boardsSlice";
export const store = configureStore({
  reducer: {
    [themeSlice.name]: themeSlice.reducer,
    [boardsSlice.name]: boardsSlice.reducer,
  }, //slices
});

//slice user - reducer
// slice boards - reducer
//tasks
