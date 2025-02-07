import { useState } from "react";
import "./AddNewTask.scss";
import Button from "../Button/Button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

export function AddNewTask({ close }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Todo", // Default status
    subtasks: [], // Ensure subtasks is initialized
  });

  // Derived state for validation
  const isValidTitle = !!form.title.length;
  const isValidDescription = !!form.description.length;
  const hasQInDescription = form.description.includes("?");
  const hasQInTitle = form.title.includes("?");

  console.log("form", form);

  function createTask() {
    console.log("create task");
    close?.(); // Close the modal after task creation, if the close function is provided
  }
  function addNewSubtask() {
    setForm((prevForm) => {
      console.log("Adding new subtask");
      return {
        ...prevForm,
        subtasks: [...prevForm.subtasks, { id: crypto.randomUUID(), name: "" }],
      };
    });
  }
  function removeTask(id) {
    setForm((prevForm) => ({
      ...prevForm,
      subtasks: prevForm.subtasks.filter((subtask) => subtask.id !== id),
    }));
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
      >
        <span className="AddNewTask-close" onClick={close}>
          &times;
        </span>
        <h2 className="AddNewTask-title">Add New Task</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault(); // Prevent form submission
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
              }}
              type="text"
              placeholder="e.g. Take coffee break"
              id="title"
            />
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
              }}
              type="text"
              placeholder="e.g. It’s always good to take a break."
              id="description"
            />
          </div>
          <div className="Subtasks">
            <label htmlFor="">Subtasks</label>
            <div className="subtask-list">
              {form.subtasks &&
                form.subtasks.map((subtask) => (
                  <div key={subtask.id} className="subtask-item">
                    <input
                      type="text"
                      value={subtask.name}
                      placeholder="e.g. Make coffee."
                      onChange={(e) => {
                        setForm((prevForm) => ({
                          ...prevForm,
                          subtasks: prevForm.subtasks.map((s) =>
                            s.id === subtask.id
                              ? { ...s, name: e.target.value }
                              : s
                          ),
                        }));
                      }}
                    />
                    <button onClick={() => removeTask(subtask.id)}>X</button>
                  </div>
                ))}
            </div>
            <div className="Subtask-btn">
              <Button
                color="secondary"
                size="sm"
                width="scope_3"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addNewSubtask();
                }}
                shadow="null"
                opacity="null"
              >
                + Add New Subtask
              </Button>
            </div>
          </div>
          <div className="status">
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
              disabled={!isValidTitle || !isValidDescription}
              color="primary"
              size="sm"
              width="scope_3"
              shadow="null"
              opacity="null"
            >
              Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
