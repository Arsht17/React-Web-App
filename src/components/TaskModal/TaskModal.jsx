import "./TaskModal.scss";

function TaskModal({ task, onClose }) {
  return (
    <div className="TaskModal" onClick={onClose}>
      <div className="TaskModal-content" onClick={(e) => e.stopPropagation()}>
        <span className="TaskModal-close" onClick={onClose}>
          &times;
        </span>
        <h3 className="TaskModal-title">{task?.name}</h3>
      </div>
    </div>
  );
}

export default TaskModal;
