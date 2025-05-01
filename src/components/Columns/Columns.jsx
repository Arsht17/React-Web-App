import "./Columns.scss";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  selectTasksByColumn,
  deleteTask,
  addTask,
} from "../../store/slices/tasksSlice";
import { AddNewTask } from "../AddNewTask/AddNewTask";
import { DeleteTaskModal } from "../DeleteTaskModal/DeleteTaskModal";
import TaskModal from "../TaskModal/TaskModal";
import Task from "../Task/Task";
import { Api } from "../../api";

const columnColors = ["#49C4E5", "#8471F2", "#67E2AE"];
const colorMap = new Map();

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function Columns({ column, index, boardId }) {
  const dispatch = useDispatch();
  const [color, setColor] = useState(columnColors[index] || getRandomColor());
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [openDeleteTaskModal, setopenDeleteTaskModal] = useState(null);

  useEffect(() => {
    if (!colorMap.has(column.id)) {
      colorMap.set(column.id, columnColors[index] || getRandomColor());
    }
    setColor(colorMap.get(column.id));
  }, [column.id, index]);

  //Fetch tasks
  const tasks = useSelector((state) =>
    selectTasksByColumn(state, boardId, column.id)
  );
  const allTasks = useSelector((state) => state.tasks.tasks);

  async function deleteTaskHandler(task) {
    if (!task?.columnId) {
      console.error("Missing columnId in task:", task);
      return;
    }

    try {
      await Api.deleteTask(boardId, task.columnId, task.id); // Server
      dispatch(
        deleteTask({ boardId, columnId: task.columnId, taskId: task.id })
      ); // Redux
      console.log("Task deleted:", task);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setopenDeleteTaskModal(null); // Close modal after action
    }
  }

  return (
    <div className="column">
      <div className="column-header">
        <span className="column-circle" style={{ backgroundColor: color }} />
        <h4>
          {column.name} ({tasks.length})
        </h4>
      </div>
      <div
        className="tasks-container"
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
          const data = JSON.parse(e.dataTransfer.getData("application/json"));
          if (!data || !data.taskId || data.fromColumnId === column.id) return;

          try {
            // get task to move
            const taskToMove = allTasks?.[boardId]?.[data.fromColumnId]?.find(
              (t) => t.id === data.taskId
            );
            if (!taskToMove) return console.error("Task not found");

            //  Delete from old column
            await Api.deleteTask(boardId, data.fromColumnId, data.taskId);
            dispatch(
              deleteTask({
                boardId,
                columnId: data.fromColumnId,
                taskId: data.taskId,
              })
            );

            //  Add to new column
            const NewTask = { ...taskToMove, columnId: column.id };
            const created = await Api.createTask(boardId, column.id, NewTask);
            dispatch(addTask({ boardId, columnId: column.id, task: created }));
          } catch (err) {
            console.error("Failed to move task", err);
          }
        }}
      >
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            columnId={column.id}
            onClick={setSelectedTask}
          />
        ))}
      </div>
      {selectedTask && (
        <TaskModal
          task={{ ...selectedTask, columnId: column.id, boardId }}
          onClose={() => setSelectedTask(null)}
          opentaskToEdit={(task) => {
            setSelectedTask(null); // close modal
            setTaskToEdit(task); // open AddNewTask
          }}
          openDeleteTaskModal={(task) => {
            setSelectedTask(null); // close modal
            setopenDeleteTaskModal({ ...task, columnId: column.id }); // open Delete modal
          }}
        />
      )}
      {taskToEdit && (
        <AddNewTask
          taskToEdit={taskToEdit}
          boardId={boardId}
          close={() => setTaskToEdit(null)}
        />
      )}
      {openDeleteTaskModal && (
        <DeleteTaskModal
          task={openDeleteTaskModal}
          onClose={() => setopenDeleteTaskModal(null)}
          onConfirm={deleteTaskHandler}
        />
      )}
    </div>
  );
}
export default Columns;
