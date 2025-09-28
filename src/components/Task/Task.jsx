import "./Task.scss";

import PropTypes from "prop-types";

function Task({ task, columnId, onClick }) {
  const completedSubtasks =
    task.subtasks?.filter((sub) => sub.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div
      className="task"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({ taskId: task.id, fromColumnId: columnId })
        );
      }}
      onClick={() => onClick?.(task)}
    >
      <h5 className="task-title">{task.name}</h5>
      <p className="task-subtasks">
        {completedSubtasks} of {totalSubtasks} subtasks
      </p>
    </div>
  );
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    subtasks: PropTypes.arrayOf(
      PropTypes.shape({
        isCompleted: PropTypes.bool,
      })
    ),
  }).isRequired,
  columnId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
};

export default Task;
