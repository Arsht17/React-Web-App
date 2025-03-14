import { configureStore } from "@reduxjs/toolkit";
import { themeSlice } from "./slices/themeSlice";
import { boardsSlice } from "./slices/boardsSlice";
import { columnsSlice } from "./slices/columnsSlice";
import { tasksSlice } from "./slices/tasksSlice";

export * from "./slices/themeSlice";
export * from "./slices/boardsSlice";
export * from "./slices/columnsSlice";
export * from "./slices/tasksSlice";

export const store = configureStore({
  reducer: {
    [themeSlice.name]: themeSlice.reducer,
    [boardsSlice.name]: boardsSlice.reducer,
    [columnsSlice.name]: columnsSlice.reducer,
    [tasksSlice.name]: tasksSlice.reducer,
  }, //slices
});

//slice user - reducer
// slice boards - reducer
//tasks
