import "./Task.scss";

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

export default Task;
