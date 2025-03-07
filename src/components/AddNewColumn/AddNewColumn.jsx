import "./AddNewColumn.scss";
import Button from "../Button/Button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { columnsSlice } from "../../store";
import { Api } from "../../api";

export function AddNewColumn({ onClose, boardId }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    columns: [{ id: crypto.randomUUID(), name: "", isError: false }], // Start with one column
  });

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

  function AddNewColumn() {
    setForm((prevForm) => {
      console.log("Adding column");
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
        columns: [
          ...prevForm.columns,
          { id: crypto.randomUUID(), name: "", isError: false },
        ],
      };
    });
  }
  function removeColumn(id) {
    setForm({
      ...form,
      columns: form.columns.filter((column) => column.id != id),
    });
    console.log("removed column");
  }

  async function CreateNewColumn() {
    if (!boardId) {
      console.error("Error: boardId is undefined");
      return;
    }

    const hasEmptyColumn = form.columns.some(
      (column) => column.name.trim() === ""
    );
    if (hasEmptyColumn) {
      setForm((prevForm) => ({
        ...prevForm,
        columns: prevForm.columns.map((column) => ({
          ...column,
          isError: column.name.trim() === "",
        })),
      }));
      return;
    }

    try {
      const newColumns = [];
      for (const column of form.columns) {
        if (column.name.trim() !== "") {
          const newColumn = await Api.createColumn(boardId, column);
          dispatch(columnsSlice.actions.addColumn(newColumn));
        }
      }
      dispatch(
        boardsSlice.actions.editBoard({
          id: boardId,
          columns: [...selectedBoard.columns, ...newColumns],
        })
      );
      console.log("Creating new column");
      onClose?.();
    } catch (error) {
      console.error("Error creating columns:", error);
    }
  }

  return (
    <div className="AddNewColumnModal" onClick={onClose}>
      <div
        className="AddNewColumnModal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          height: `${380 + Math.max(0, (form.columns.length - 2) * 40)}px`,
        }}
      >
        <span className="AddNewColumnModal-close" onClick={onClose}>
          &times;
        </span>
        <h3 className="AddNewColumnModal-title">Add New Column</h3>
        <div className="Columns-list">
          <label htmlFor="">Columns</label>
          {form.columns?.map((column) => {
            return (
              <div
                key={column.id}
                className="column-items"
                style={{
                  borderColor: column.isError ? "red" : "#ccc",
                }}
              >
                <input
                  type="text"
                  placeholder="Enter column name"
                  value={column.name}
                  onChange={(e) =>
                    handleColumnChange(column.id, e.target.value)
                  }
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
        <div
          className="AddNewColumnModal-actions"
          style={{
            marginTop: `${24 + Math.max(0, (form.columns.length - 2) * 12)}px`,
          }}
        >
          <Button
            color="secondary"
            size="sm"
            width="scope_3"
            shadow="null"
            opacity="0"
            onClick={AddNewColumn}
          >
            + Add new Column
          </Button>
          <Button
            color="primary"
            size="sm"
            width="scope_3"
            shadow="null"
            opacity="0"
            onClick={CreateNewColumn}
          >
            Create new Column
          </Button>
        </div>
      </div>
    </div>
  );
}
