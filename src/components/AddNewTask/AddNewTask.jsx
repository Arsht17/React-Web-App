import { useState } from "react";
import "./AddNewTask.scss";
import Button from "../Button/Button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useDispatch, useSelector } from "react-redux";
import { tasksSlice } from "../../store";
import { Api } from "../../api";

const placeholderTexts = [
  "e.g. Drink coffee & smile",
  "e.g. Write project notes",
  "e.g. Review tasks",
  "e.g. Organize workspace",
  "e.g. Plan tomorrow’s work",
  "e.g. Take a short walk",
];

export function AddNewTask({ close, taskToEdit, columnId, boardId }) {
  const dispatch = useDispatch();
  const selectedBoard = useSelector((state) =>
    state.boards.boards.find((b) => b.id === boardId)
  );

  const [form, setForm] = useState(
    taskToEdit
      ? {
          ...taskToEdit, // Load existing task
          subtasks: taskToEdit.subtasks.map((subtask) => ({
            ...subtask,
            isError: false, // Ensure error is handled
          })),
        }
      : {
          title: "",
          description: "",
          status: "Todo", // Default status
          columnId: columnId, // Ensure task is linked to a column
          subtasks: [
            { id: crypto.randomUUID(), name: "", isError: false },
            { id: crypto.randomUUID(), name: "", isError: false },
          ],
        }
  );

  const [error, setErrors] = useState({ title: false, description: false });

  // Derived state for validation
  const isValidTitle = !!form.title.length;
  const isValidDescription = !!form.description.length;
  const hasQInDescription = form.description.includes("?");
  const hasQInTitle = form.title.includes("?");
  const Header = taskToEdit ? "Edit Task" : "Add New Task";
  const actionButton = taskToEdit ? "Save Changes" : "Create Task";

  console.log("form", form);

  async function createTask() {
    if (!columnId || !selectedBoard || !selectedBoard.id) {
      console.error("Error: columnId or boardId is undefined");
      return;
    }

    const newErrors = {
      title: form.title.trim() === "",
      description: form.description.trim() === "",
    };

    setErrors(newErrors); // Update error state

    if (newErrors.title || newErrors.description) {
      return; // Stop if there are errors
    }

    const newTask = {
      name: form.title,
      description: form.description,
      status: form.status,
      subtasks: form.subtasks,
    };
    try {
      // Create task via API and get the created task
      const createdTask = await Api.createTask(boardId, columnId, newTask);

      // Dispatch action with the task returned from the API
      dispatch(
        tasksSlice.actions.addTask({ boardId, columnId, task: createdTask })
      );

      console.log("Task created:", createdTask);
      close?.();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  }

  function editSubTask(id, newName) {
    setForm((prevForm) => ({
      ...prevForm,
      subtasks: prevForm.subtasks.map((subtask) =>
        subtask.id === id
          ? { ...subtask, name: newName, isError: newName.trim() === "" }
          : subtask
      ),
    }));
  }

  function addNewSubtask() {
    console.log("Adding new subtask");
    setForm((prevForm) => {
      const hasEmptySubtask = prevForm.subtasks.some(
        (subtask) => subtask.name.trim() === ""
      );

      if (hasEmptySubtask) {
        return {
          ...prevForm,
          subtasks: prevForm.subtasks.map((subtask) => ({
            ...subtask,
            isError: subtask.name.trim() === "", // Set error if empty
          })),
        };
      }
      if (prevForm.subtasks.length >= 6) {
        return prevForm; // Prevent adding more
      }

      // Get placeholder from array
      const nextPlaceholder =
        placeholderTexts[prevForm.subtasks.length % placeholderTexts.length];

      return {
        ...prevForm,
        subtasks: [
          ...prevForm.subtasks,
          {
            id: crypto.randomUUID(),
            name: "",
            isError: false,
            placeholder: nextPlaceholder,
          },
        ],
      };
    });
  }

  function removeTask(id) {
    setForm((prevForm) => {
      const updatedSubtasks = prevForm.subtasks.filter(
        (subtask) => subtask.id !== id
      );
      return {
        ...prevForm,
        subtasks: updatedSubtasks,
      };
    });
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          close?.();
        }
      }}
      className="AddNewTask"
    >
      <div
        onClick={(e) => {
          e.stopPropagation(); // Prevent click event from propagating to the parent div
        }}
        className="AddNewTask-content"
        style={{
          height: `${
            675 +
            Math.max(0, (form.subtasks.length - 2) * 50) +
            (error.title ? 35 : 0) +
            (error.description ? 35 : 0)
          }px`,
        }}
      >
        <span className="AddNewTask-close" onClick={close}>
          &times;
        </span>
        <h2 className="AddNewTask-title">{Header}</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault(); // Prevent form submission
            event.stopPropagation(); //Prevent event bubbling
            createTask();
          }}
        >
          <div className="title-field">
            <label
              style={{
                color: hasQInTitle ? "red" : undefined,
              }}
              htmlFor="title"
            >
              Title
            </label>
            <input
              value={form.title}
              onChange={(event) => {
                setForm({
                  ...form, // Copy current form
                  title: event.target.value, // Override
                });
                if (event.target.value.trim() !== "") {
                  setErrors((prev) => ({ ...prev, title: false }));
                }
              }}
              type="text"
              placeholder="e.g. Take coffee break"
              id="title"
              className={error.title ? "error" : ""}
            />
            {error.title && <p className="error-message">Title is required</p>}
          </div>
          <div className="description-field">
            <label
              style={{
                color: hasQInDescription ? "red" : undefined,
              }}
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) => {
                setForm({
                  ...form, // Copy current form
                  description: event.target.value, // Override
                });
                if (event.target.value.trim() !== "") {
                  setErrors((prev) => ({ ...prev, description: false }));
                }
              }}
              type="text"
              placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
              id="description"
              className={error.description ? "error" : ""}
            />
            {error.description && (
              <p className="error-message">Description is required</p>
            )}
          </div>
          <div className="Subtasks">
            <label htmlFor="">Subtasks</label>
            <div className="subtask-list">
              {form.subtasks &&
                form.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="subtask-item"
                    style={{
                      borderColor: subtask.isError ? "red" : "#ccc",
                    }}
                  >
                    <input
                      type="text"
                      value={subtask.name}
                      placeholder={
                        subtask.placeholder || "e.g. Drink coffee & smile"
                      }
                      onChange={(e) => editSubTask(subtask.id, e.target.value)}
                      className={subtask.isError ? "error" : ""}
                    />
                    {subtask.isError && (
                      <span className="error-message">Can’t be empty</span>
                    )}
                    <button onClick={() => removeTask(subtask.id)}>X</button>
                  </div>
                ))}
            </div>
            <div
              className="Subtask-btn"
              style={{
                marginTop: `${12 + Math.max(0, form.subtasks.length - 2)}px`,
              }}
            >
              <Button
                color="secondary"
                size="sm"
                width="scope_3"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addNewSubtask();
                }}
                disabled={form.subtasks.length >= 6}
                shadow="null"
                opacity="null"
              >
                + Add New Subtask
              </Button>
            </div>
          </div>
          <div
            className="status"
            style={{
              top: `${
                500 +
                Math.max(0, (form.subtasks.length - 2) * 55) +
                (error.title ? 35 : 0) +
                (error.description ? 35 : 0)
              }px`,
            }}
          >
            <label htmlFor="status">Status</label>
            <div className="dropDown">
              <Menu>
                <MenuButton className="Chevron-btn">
                  {form.status}
                  <ChevronDownIcon className="Chevron-icon" />
                </MenuButton>
                <MenuItems transition anchor="bottom end" className="Items">
                  <MenuItem
                    className="Item"
                    onClick={() => setForm({ ...form, status: "Todo" })}
                  >
                    <span>Todo</span>
                  </MenuItem>
                  <MenuItem
                    className="Item"
                    onClick={() => setForm({ ...form, status: "Doing" })}
                  >
                    <span>Doing</span>
                  </MenuItem>
                  <MenuItem
                    className="Item"
                    onClick={() => setForm({ ...form, status: "Done" })}
                  >
                    <span>Done</span>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
          <div className="createTask-btn">
            <Button
              color="primary"
              size="sm"
              width="scope_3"
              shadow="null"
              opacity="null"
              onClick={createTask}
            >
              {actionButton}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
