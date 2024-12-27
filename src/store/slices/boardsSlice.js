import { createSlice } from "@reduxjs/toolkit";

export const boardsSlice = createSlice({
  name: "boards",
  initialState: {
    boards: [],
    selectedBoardId: "",
  },
  reducers: {
    setBoards: (state, action) => {
      state.boards = action.payload;
    },
    addBoard: (state, action) => {
      state.boards.push(action.payload);
    },
    selectedBoard: (state, action) => {
      state.selectedBoardId = action.payload;
    },
    editBoard: (state, action) => {
      const index = state.boards.findIndex((b) => b.id === action.payload.id);
      if (index === -1) return; // not found
      state.boards[index] = action.payload;
    },
    deleteBoard: (state, action) => {
      const index = state.boards.findIndex((b) => b.id === action.payload);
      if (index === -1) return; // not found
      state.boards.splice(index, 1);
    },
  },
  selectors: {
    selectedBoard: (sliceState, selectedBoardName) => {
      const selectedBoard = sliceState.boards.find(
        (board) => board.name === selectedBoardName
      );
      return selectedBoard;
    },
  },
});
