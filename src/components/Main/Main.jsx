import { useSelector } from "react-redux";
import { useAppContext } from "../../contexts/AppContext";
import Button from "../Button/Button";
import "./Main.css";
import { boardsSlice } from "../../store";
import { useParams } from "wouter";
import Columns from "../Columns/Columns";

export function Main({ openAddNewColumn }) {
  const appContext = useAppContext();
  //const { selectedBoard } = appContext;

  const params = useParams();
  const selectedBoardName = params?.boardName;

  const selectedBoard = useSelector((state) =>
    boardsSlice.selectors.selectedBoard(state, selectedBoardName)
  );
  const boardName = selectedBoard ? selectedBoard.name : "select board";
  const columns = selectedBoard?.columns || [];
  const isAddColumnDisabled = !selectedBoard;
  const isEmptyState = !columns.length;

  return (
    <div className={`Main`}>
      {/* <h2>{boardName}</h2> */}
      <div className="columns-container">
        {!isEmptyState &&
          columns.map((column, index) => (
            <Columns key={column.id} column={column} index={index} />
          ))}
      </div>
      {isEmptyState && (
        <div className="center">
          <p className="empty-text">
            This board is empty. Create a new column to get started.
          </p>
          <div>
            <Button
              disabled={isAddColumnDisabled}
              color="primary"
              size="lg"
              opacity=""
              onClick={() => {
                openAddNewColumn(selectedBoard);
              }}
            >
              + Add New Column
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
