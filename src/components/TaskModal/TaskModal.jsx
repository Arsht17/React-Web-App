import "./TaskModal.scss";
import { useDispatch } from "react-redux";
import { Api } from "../../api";
import { tasksSlice } from "../../store";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState, useEffect } from "react";

function TaskModal({ task, onClose, opentaskToEdit, openDeleteTaskModal }) {
  const dispatch = useDispatch();
  const [localTask, setLocalTask] = useState(task);

  const completedSubtasks =
    localTask.subtasks?.filter((sub) => sub.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  useEffect(() => {
    if (!localTask) {
      setLocalTask(task);
    }
  }, []);

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
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
