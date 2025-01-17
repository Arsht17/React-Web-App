import { useState } from "react";
import "./AddNewTask.css";

export function AddNewTask({ close }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  // Derived state for validation
  const isValidTitle = !!form.title.length;
  const isValidDescription = !!form.description.length;
  const hasQ = !!form.description.includes("?");

  console.log("form", form);

  function createTask() {
    console.log("create task");
    close?.(); // Close the modal after task creation, if the close function is provided
  }

  return (
    <div onClick={() => close?.()} className="AddNewTask">
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
            <label htmlFor="title">Title</label>
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
                background: hasQ ? "red" : undefined,
              }}
              htmlFor="description"
            >
              Description
            </label>
            <input
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
          <button disabled={!isValidTitle || !isValidDescription}>
            create task
          </button>
        </form>
      </div>
    </div>
  );
}
