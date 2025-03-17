import { createSlice, createSelector } from "@reduxjs/toolkit";

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: {},
  },
  reducers: {
    setTasks: (state, action) => {
      const { boardId, columnId, tasks } = action.payload;
      if (!state.tasks[boardId]) {
        state.tasks[boardId] = {};
      }
      state.tasks[boardId][columnId] = tasks;
    },

    addTask: (state, action) => {
      const { boardId, columnId, task } = action.payload;
      if (!state.tasks[boardId]) {
        state.tasks[boardId] = {};
      }
      if (!state.tasks[boardId][columnId]) {
        state.tasks[boardId][columnId] = [];
      }
      state.tasks[boardId][columnId].push(task);
    },

    editTask: (state, action) => {
      const { boardId, columnId, task } = action.payload;
      if (!state.tasks[boardId] || !state.tasks[boardId][columnId]) return;

      const index = state.tasks[boardId][columnId].findIndex(
        (t) => t.id === task.id
      );
      if (index !== -1) {
        state.tasks[boardId][columnId][index] = task;
      }
    },

    deleteTask: (state, action) => {
      const { boardId, columnId, taskId } = action.payload;
      if (!state.tasks[boardId] || !state.tasks[boardId][columnId]) return;

      state.tasks[boardId][columnId] = state.tasks[boardId][columnId].filter(
        (t) => t.id !== taskId
      );
    },
  },
});

export const { setTasks, addTask, editTask, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;

export const selectTasksByColumn = createSelector(
  [
    (state) => state.tasks.tasks,
    (_, boardId) => boardId,
    (_, __, columnId) => columnId,
  ],
  (tasks, boardId, columnId) => tasks[boardId]?.[columnId] || []
);
