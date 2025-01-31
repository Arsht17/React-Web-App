import { useAppContext } from "../../contexts/AppContext";
import { boardsSlice } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import "./BoardFormModal.css";
import { useState } from "react";
import Button from "../Button/Button";
import { Api } from "../../api";

export function BoardFormModal({ close, boardToEdit }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState(
    boardToEdit
      ? { ...boardToEdit }
      : {
          name: "",
          columns: [],
        }
  );

  function editBoardName(newName) {
    setForm({
      ...form,
      name: newName,
    });
  }

  function addNewColumn() {
    setForm({
      ...form,
      columns: [
        ...form.columns,
        { id: crypto.randomUUID(), name: "", tasks: [] },
      ],
    });
  }

  function removeColumn(id) {
    setForm({
      ...form,
      columns: form.columns.filter((column) => column.id != id),
    });
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
    console.log("boardToEdit : ", boardToEdit);
    if (boardToEdit) {
      const _board = await Api.editBoard(form);
      console.log("_board : ", _board);
      dispatch(boardsSlice.actions.editBoard(_board));
    } else {
      const _board = await Api.createBoard(form);
      console.log("_board : ", _board);
      dispatch(boardsSlice.actions.addBoard(_board));
    }
    close?.();
  }

  const title = boardToEdit ? "Edit Board" : "Add new Board";
  const actionButton = boardToEdit ? "Save Changes" : "Create new Board";

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
        className="EditBoardModal-content"
      >
        <span className="EditBoardModal-close" onClick={close}>
          &times;
        </span>
        <div className="EditBoardModal-title"> {title}</div>
        <div className="">
          <label htmlFor="">board name:</label>
          <input
            type="text"
            onChange={(e) => editBoardName(e.target.value)}
            defaultValue={form?.name}
          />
        </div>
        <div className="">
          <label htmlFor="">boards columns</label>
          {form.columns?.map((column) => {
            return (
              <div key={column.id} className="">
                <input
                  onChange={(event) => {
                    editColumn(event.target.value, column.id);
                  }}
                  defaultValue={column.name}
                  type="text"
                />
                <button onClick={() => removeColumn(column.id)}>X</button>
              </div>
            );
          })}
        </div>
        <div className="column-btn">
          <Button
            color="secondary"
            size="sm"
            width="scope_3"
            onClick={addNewColumn}
            shadow="null"
            opacity="null"
          >
            + Add New Column
          </Button>
        </div>
        <div className="save-btn">
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
  );
}
