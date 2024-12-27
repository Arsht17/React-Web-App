import { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { boardsSlice } from "../../store";
import { Link } from "wouter";
import { useParams } from "wouter";

export function Sidebar(props) {
  const { setIsDarkMode } = props;
  const [text, setText] = useState("");

  const params = useParams();
  const selectedBoardName = params?.boardName;

  const boards = useSelector((state) => state.boards?.boards ?? []);
  const dispatch = useDispatch();
  const appContext = useAppContext();
  const { createBoard } = appContext;
  //const selectedBoardId = useSelector((state) => state.boards.selectedBoardId);

  //derived state
  const totalBoards = boards.length;
  return (
    <div className={`Sidebar`}>
      <p className="kanban">KanBan</p>
      {/* <input onChange={(e) => setText(e.target.value)} type="text" /> */}
      <div className="new-board">
        <h3 style={{ letterSpacing: "2.4px" }}>ALL BOARDS({totalBoards})</h3>
        {boards.map((board) => {
          const isSelected = board.name == selectedBoardName;
          return (
            <div
              key={board.id}
              onClick={() => {
                //   //setSelectedBoardId(board.id);
                dispatch(boardsSlice.actions.selectedBoard(board.id));
              }}
              style={{
                background: isSelected ? "#635FC7" : "transparent",
                color: isSelected ? "white" : "inherit",
              }}
              className="board"
            >
              <Link href={`/${board.name}`}>{board.name}</Link>
            </div>
          );
        })}
        <button
          className="createnewboard"
          onClick={() => {
            //createBoard({ name: text });
            props.onCreateBoard?.();
          }}
        >
          + Create New Board
        </button>
      </div>
      <label className="switch">
        <input
          onChange={(event) => {
            setIsDarkMode(event.target.checked);
          }}
          type="checkbox"
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}
