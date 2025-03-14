import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./slices/themeSlice";
import { boardsSlice } from "./slices/boardsSlice";
import { columnsSlice } from "./slices/columnsSlice";

export * from "./slices/themeSlice";
export * from "./slices/boardsSlice";
export * from "./slices/columnsSlice";

export const store = configureStore({
  reducer: {
    [themeSlice.name]: themeSlice.reducer,
    [boardsSlice.name]: boardsSlice.reducer,
    [columnsSlice.name]: columnsSlice.reducer,
  }, //slices
});

//slice user - reducer
// slice boards - reducer
//tasks
