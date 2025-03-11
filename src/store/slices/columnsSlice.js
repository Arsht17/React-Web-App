import { createSlice } from "@reduxjs/toolkit";

export const columnsSlice = createSlice({
  name: "columns",
  initialState: {
    columns: [],
  },
  reducers: {
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
    addColumn: (state, action) => {
      const exists = state.columns.some((c) => c.id === action.payload.id);
      if (!exists) {
        state.columns.push(action.payload);
      }
    },
    editColumn: (state, action) => {
      const index = state.columns.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        // not found
        state.columns[index] = action.payload;
      }
    },
    deleteColumn: (state, action) => {
      state.columns = state.columns.filter((c) => c.id !== action.payload);
    },
  },
});
export const { setColumns, addColumn, editColumn, deleteColumn } =
  columnsSlice.actions;
export default columnsSlice.reducer;
