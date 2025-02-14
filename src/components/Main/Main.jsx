import { useSelector } from "react-redux";
import { useAppContext } from "../../contexts/AppContext";
import Button from "../Button/Button";
import "./Main.css";
import { boardsSlice } from "../../store";
import { useParams } from "wouter";

export function Main({ openEditBoardModal }) {
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
      <h2>{boardName}</h2>
      <div>
        {!isEmptyState &&
          columns.map((column) => {
            return <div key={column.id}>{column.name}</div>;
          })}
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
              // onClick={() => {
              //   openAddNewColumnModal(selectedBoard);
              // }}
            >
              + Add New Column
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
