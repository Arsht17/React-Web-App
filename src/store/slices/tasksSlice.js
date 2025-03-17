import { createSlice } from "@reduxjs/toolkit";

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: {},
  },
  reducers: {
    setTasks: (state, action) => {
      const { columnId, tasks } = action.payload;
      state.tasks[columnId] = tasks;
    },
    addTask: (state, action) => {
      const { columnId, task } = action.payload;
      if (!state.tasks[columnId]) {
        state.tasks[columnId] = [];
      }
      state.tasks[columnId].push(task);
    },

    editTask: (state, action) => {
      const { columnId, task } = action.payload;
      if (!state.tasks[columnId]) return;

      const index = state.tasks[columnId].findIndex((t) => t.id === task.id);
      if (index !== -1) {
        state.tasks[columnId][index] = task;
      }
    },
    deleteTask: (state, action) => {
      const { columnId, taskId } = action.payload;
      if (!state.tasks[columnId]) return;

      state.tasks[columnId] = state.tasks[columnId].filter(
        (t) => t.id !== taskId
      );
    },
  },
});

export const { setTasks, addTask, editTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
