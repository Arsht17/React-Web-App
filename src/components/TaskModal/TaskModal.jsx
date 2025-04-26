import "./TaskModal.scss";
import { useDispatch, useSelector } from "react-redux";
import { Api } from "../../api";
import { tasksSlice } from "../../store";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useState, useEffect } from "react";

function TaskModal({ task, onClose, opentaskToEdit, openDeleteTaskModal }) {
  const dispatch = useDispatch();

  // grab the full board so we can list its columns
  const boardId = task.boardId;
  const selectedBoard = useSelector((s) =>
    s.boards.boards.find((b) => b.id === boardId)
  );
  const boardColumns = selectedBoard?.columns || [];

  //  existing localTask logic
  const [localTask, setLocalTask] = useState(() => normalize(task));

  // re-normalize & reset localTask:
  useEffect(() => {
    setLocalTask(normalize(task));
  }, [task.id]);

  // helper to give every subtask an isCompleted boolean
  function normalize(task) {
    return {
      ...task,
      subtasks: (task.subtasks || []).map((sub) => ({
        ...sub,
        // if sub.isCompleted is already true/false keep it,
        // otherwise default to false:
        isCompleted:
          typeof sub.isCompleted === "boolean" ? sub.isCompleted : false,
      })),
    };
  }

  // form holds the current columnId
  const [form, setForm] = useState({ columnId: task.columnId });
  useEffect(() => {
    setForm({ columnId: task.columnId });
  }, [task.columnId]);

  const completedSubtasks =
    localTask.subtasks?.filter((sub) => sub.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  // toggle subtasks
  const toogleSubtask = async (subtaskId) => {
    const updatedsubtask = localTask.subtasks.map((sub) =>
      sub.id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
    );

    const updatedTask = {
      ...localTask,
      subtasks: updatedsubtask,
    };

    // Update local state instantly
    setLocalTask(updatedTask);
    // Send to backend
    await Api.editTask(updatedTask.boardId, updatedTask.columnId, updatedTask);
    // Update redux store
    dispatch(
      tasksSlice.actions.editTask({
        boardId: updatedTask.boardId,
        columnId: updatedTask.columnId,
        task: updatedTask,
      })
    );
  };

  //move the task into another column
  const moveTaskTo = async (newColumnId) => {
    if (newColumnId === form.columnId) return;
    const oldColumnId = form.columnId;
    const updatedTask = { ...localTask, columnId: newColumnId };

    // instant UI
    setLocalTask(updatedTask);
    setForm({ columnId: newColumnId });

    // server deletes from old column, creates in new
    await Api.deleteTask(boardId, oldColumnId, updatedTask.id);
    await Api.createTask(boardId, newColumnId, updatedTask);

    // Redux removed from old, added to new
    dispatch(
      tasksSlice.actions.deleteTask({
        boardId,
        columnId: oldColumnId,
        taskId: updatedTask.id,
      })
    );
    dispatch(
      tasksSlice.actions.addTask({
        boardId,
        columnId: newColumnId,
        task: updatedTask,
      })
    );
  };

  return (
    <div className="TaskModal" onClick={onClose}>
      <div className="TaskModal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="Operations">
          <Menu>
            <MenuButton className="ovals">
              <svg
                className="menu-icon"
                width="5"
                height="20"
                viewBox="0 0 5 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="2.30769" cy="2.30769" r="2.30769" fill="#828FA3" />
                <circle cx="2.30769" cy="10.0001" r="2.30769" fill="#828FA3" />
                <circle cx="2.30769" cy="17.6922" r="2.30769" fill="#828FA3" />
              </svg>
            </MenuButton>
            <MenuItems transition className="list">
              <MenuItem className="Operation">
                <span
                  onClick={() => {
                    console.log("edit task");
                    opentaskToEdit(task);
                    onClose();
                  }}
                >
                  Edit Task
                </span>
              </MenuItem>
              <MenuItem className="Operation">
                <span
                  onClick={() => {
                    console.log("delete task");
                    openDeleteTaskModal(task);
                    onClose();
                  }}
                  style={{ color: "#eb0707" }}
                >
                  Delete Task{" "}
                </span>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
        <div className="TaskModal-content" onClick={(e) => e.stopPropagation()}>
          <h3 className="TaskModal-title">{task?.name}</h3>
          <p className="TaskModal-description">{task?.description}</p>
          <p className="TaskModal-Subtasks">
            <strong>Subtasks</strong> ({completedSubtasks} of {totalSubtasks})
          </p>
          <div className="Subtasks-list">
            {localTask.subtasks?.map((subtask) => (
              <div
                key={subtask.id}
                className={`subTask-item ${
                  subtask.isCompleted ? "completed" : ""
                }`}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={subtask.isCompleted}
                    onChange={() => toogleSubtask(subtask.id)}
                  />
                  <span className="subtask-text">{subtask.name}</span>
                </label>
              </div>
            ))}
          </div>
          <p className="TaskModal-status">Current Status</p>
          <div className="drop-Down">
            <Menu>
              <MenuButton className="Chevron-btn">
                {boardColumns.find((col) => col.id === form.columnId)?.name ||
                  "Select Column"}
                <ChevronDownIcon className="Chevron-icon" />
              </MenuButton>
              <MenuItems transition anchor="bottom end" className="Items">
                {boardColumns.map((col) => (
                  <MenuItem
                    key={col.id}
                    className="Item"
                    onClick={() => moveTaskTo(col.id)}
                  >
                    <span>{col.name}</span>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
