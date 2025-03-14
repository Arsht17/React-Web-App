import "./Task.scss";

function Task({ task }) {
  const completedSubtasks =
    task.subtasks?.filter((sub) => sub.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div className="task">
      <h5 className="task-title">{task.name}</h5>
      <p className="task-subtasks">
        {completedSubtasks} of {totalSubtasks} subtasks
      </p>
    </div>
  );
}

export default Task;
