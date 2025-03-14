import { createSlice } from "@reduxjs/toolkit";

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      const { columnId, task } = action.payload;
      const column = state.tasks.find((c) => c.id === columnId);
      if (column) {
        column.tasks.push(task);
      }
    },
    editTask: (state, action) => {
      const { columnId, task } = action.payload;
      const column = state.tasks.find((c) => c.id === columnId);
      if (column) {
        const index = column.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          column.tasks[index] = task;
        }
      }
    },
    deleteTask: (state, action) => {
      const { columnId, taskId } = action.payload;
      const column = state.tasks.find((c) => c.id === columnId);
      if (column) {
        column.tasks = column.tasks.filter((t) => t.id !== taskId);
      }
    },
  },
});

export const { setTasks, addTask, editTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
