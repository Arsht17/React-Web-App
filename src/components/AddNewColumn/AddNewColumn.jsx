import "./AddNewColumn.scss";
import Button from "../Button/Button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function AddNewColumn({ onClose }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    columns: [],
  });
  function AddNewColumn() {
    setForm((prevForm) => {
      console.log("Adding new column");
      if (prevForm.columns.length >= 3) {
        return prevForm; // Prevent adding mosre
      }
      return {
        ...prevForm,
        columns: [...prevForm.columns, { id: crypto.randomUUID(), name: "" }],
      };
    });
  }
  function CreateNewColumn() {}

  return (
    <div className="AddNewColumnModal" onClick={onClose}>
      <div
        className="AddNewColumnModal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="AddNewColumnModal-close" onClick={onClose}>
          &times;
        </span>
        <h3 className="AddNewColumnModal-title">Add New Column</h3>
        <div className="AddNewColumnModal-actions">
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
