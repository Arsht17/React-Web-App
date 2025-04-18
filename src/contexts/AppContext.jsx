import { createContext, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { boardsSlice } from "../store";
import { tasksSlice } from "../store";

export const AppContext = createContext(null);

//everyone can get context
export function AppContextProvider({ children }) {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const dispatch = useDispatch();

  async function createBoard(form) {
    // update server
    const res = await fetch("http://localhost:4000/api/boards", {
      body: JSON.stringify({
        name: form.name,
      }),
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });
    const newBoard = await res.json();
    //update state (ui)
    //setBoards([...boards, newBoard])
    setBoards((prevBoards) => [...prevBoards, newBoard]);
    dispatch(boardsSlice.actions.addBoard(newBoard));
  }

  async function createColumn(boardId, column) {
    const res = await fetch(
      "http://localhost:4000/api/boards/${boardId}/columns",
      {
        body: JSON.stringify(column),
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const newColumn = await res.json();

    setBoards((prevBoards) =>
      prevBoards.map((board) =>
        board.id === boardId
          ? { ...board, columns: [...board.columns, newColumn] }
          : board
      )
    );
    dispatch(
      boardsSlice.actions.editBoard({
        id: boardId,
        columns: [...selectedBoard.columns, newColumn],
      })
    );
  }

  const selectedBoard = boards.find((board) => board.id === selectedBoardId);
  const data = {
    boards,
    selectedBoard,
    selectedBoardId,
    setBoards,
    setSelectedBoardId,
    createBoard,
    createColumn,
    // createTask,
  };

  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
}

//custom hook
export const useAppContext = () => {
  return useContext(AppContext);
};
