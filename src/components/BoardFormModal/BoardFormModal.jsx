import { useAppContext } from "../../contexts/AppContext";
import { boardsSlice } from "../../store";
import { columnsSlice } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import "./BoardFormModal.scss";
import { useState } from "react";
import Button from "../Button/Button";
import { Api } from "../../api";

export function BoardFormModal({ close, boardToEdit }) {
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

  const [form, setForm] = useState(
    boardToEdit
      ? { ...boardToEdit }
      : {
          name: "",
          columns: [],
        }
  );

  function editBoardName(newName) {
    const trimmed = newName.slice(0, 20); //hard limit
    setForm({
      ...form,
      name: trimmed,
    });
    setError(trimmed.trim() === "");
  }

  function addNewColumn() {
    setForm((prevForm) => {
      const hasEmptyColumn = prevForm.columns.some(
        (column) => column.name.trim() === ""
      );
      if (hasEmptyColumn) {
        console.log(" Empty column exists");
        return {
          ...prevForm,
          columns: prevForm.columns.map((column) => ({
            ...column,
            isError: column.name.trim() === "",
          })),
        };
      }
      if (prevForm.columns.length >= 3) {
        return prevForm; // Prevent adding mosre
      }
      return {
        ...prevForm,
        columns: [...prevForm.columns, { id: crypto.randomUUID(), name: "" }],
      };
    });
    console.log("Adding column");
  }

  function removeColumn(id) {
    setForm({
      ...form,
      columns: form.columns.filter((column) => column.id != id),
    });
  }
  function handleColumnChange(id, newName) {
    setForm((prevForm) => ({
      ...prevForm,
      columns: prevForm.columns.map((column) =>
        column.id === id
          ? { ...column, name: newName, isError: newName.trim() === "" }
          : column
      ),
    }));
  }

  function editColumn(newName, id) {
    setForm({
      ...form,
      columns: form.columns.map((column) => {
        if (column.id == id) {
          return { ...column, name: newName };
        }
        return column;
      }),
    });
  }

  async function save() {
    if (form.name.trim() === "") {
      setError(true); // Show error message
      return;
    }
    console.log("boardToEdit:", boardToEdit);

    let _board;

    if (boardToEdit) {
      _board = await Api.editBoard(form);
      dispatch(boardsSlice.actions.editBoard(_board));
    } else {
      _board = await Api.createBoard(form); // Create board first
      dispatch(boardsSlice.actions.addBoard(_board));
    }

    // Ensure the board ID exists
    if (_board.id) {
      for (const column of form.columns) {
        if (column.name.trim() !== "") {
          const newColumn = await Api.createColumn(_board.id, column);
          dispatch(columnsSlice.actions.addColumn(newColumn));
        }
      }
    }

    close?.();
  }
  const title = boardToEdit ? "Edit Board" : "Add new Board";
  const actionButton = boardToEdit ? "Save Changes" : "Create new Board";
  const nameLabel = boardToEdit ? "Board Name" : "Name";
  const columnsLabel = boardToEdit ? "Board Columns" : " Columns";

  //const appContext = useAppContext();
  //const { selectedBoard } = appContext;
  //const selectedBoard = useSelector(boardsSlice.selectors.selectedBoard);

  const boards = useSelector((state) => state.boards.boards);
  const selectedBoardId = useSelector((state) => state.boards.selectedBoardId);
  const selectedBoard = boards.find((board) => board.id === selectedBoardId);

  console.log("form", form);
  return (
    <div onClick={() => close?.()} className="EditBoardModal">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="EditBoardModal-content"
          style={{
            height: `${
              481 +
              Math.max(0, (form.columns.length - 3) * 50) +
              (error ? 32 : 0)
            }px`,
          }}
        >
          <span className="EditBoardModal-close" onClick={close}>
            &times;
          </span>
          <h3 className="EditBoardModal-title"> {title}</h3>
          <div className="name-field">
            <label htmlFor="board-name">{nameLabel}</label>
            <input
              id="board-name"
              type="text"
              placeholder="e.g. Web Design"
              onChange={(e) => {
                const value = e.target.value.slice(0, 20); // limit to 20 characters
                editBoardName(value);
              }}
              value={form?.name}
              maxLength={20}
              style={{
                borderColor: error ? "red" : "#ccc",
              }}
            />
            <small
              style={{ color: "#888", fontSize: "12px", marginTop: "4px" }}
            >
              {form.name.length}/20 characters
            </small>
            {error && <p className="error-message">Board Name is required</p>}
          </div>
          <div className="columns-list">
            <label htmlFor="columns-name">{columnsLabel}</label>
            {form.columns?.map((column) => {
              return (
                <div
                  id="columns-name"
                  key={column.id}
                  className="column-items"
                  style={{
                    borderColor: column.isError ? "red" : "#ccc",
                  }}
                >
                  <input
                    placeholder="Enter column name"
                    onChange={(event) => {
                      const value = event.target.value.slice(0, 20); // limit to 20 characters
                      editColumn(value, column.id);
                      handleColumnChange(column.id, value);
                    }}
                    defaultValue={column.name}
                    type="text"
                    maxLength={20}
                    className={column.isError ? "error" : ""}
                  />
                  {column.isError && (
                    <span className="error-message">Can’t be empty</span>
                  )}
                  <button
                    className="remove"
                    onClick={() => removeColumn(column.id)}
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
          <div className="EditBoardModal-actions">
            <Button
              color="secondary"
              size="sm"
              width="scope_3"
              onClick={addNewColumn}
              shadow="null"
              opacity="null"
              disabled={form.columns.length >= 3}
            >
              + Add New Column
            </Button>
            <Button
              color="primary"
              size="sm"
              width="scope_3"
              onClick={save}
              shadow="null"
              opacity="null"
            >
              {actionButton}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
