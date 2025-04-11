import "./Columns.scss";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { selectTasksByColumn, deleteTask } from "../../store/slices/tasksSlice";
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

  return (
    <div className="column">
      <div className="column-header">
        <span className="column-circle" style={{ backgroundColor: color }} />
        <h4>
          {column.name} ({tasks.length})
        </h4>
      </div>
      <div className="tasks-container">
        {tasks.map((task) => (
          <Task key={task.id} task={task} onClick={setSelectedTask} />
        ))}
      </div>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          opentaskToEdit={(task) => {
            setSelectedTask(null); // close modal
            setTaskToEdit(task); // open AddNewTask
          }}
          openDeleteTaskModal={(task) => {
            setSelectedTask(null); // close modal
            setopenDeleteTaskModal(task); // open Delete modal
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
          onConfirm={(task) => {
            dispatch(
              deleteTask({ boardId, columnId: task.columnId, taskId: task.id })
            );
            Api.deleteTask(boardId, task.columnId, task.id);
          }}
        />
      )}
    </div>
  );
}
export default Columns;
