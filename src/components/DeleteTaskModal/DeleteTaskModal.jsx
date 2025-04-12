import "./DeleteTaskModal.scss";
import Button from "../Button/Button";

export function DeleteTaskModal({ task, onClose, onConfirm }) {
  return (
    <div className="DeleteTaskModal">
      <div
        className="DeleteTaskModal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="DeleteTaskModal-title">Delete this Task?</h3>
        <p>
          Are you sure you want to delete the <strong>‘{task?.name}’</strong>
          and its
          <br /> subtask? This action cannot be reversed
        </p>
        <div className="DeleteTaskModal-actions">
          <Button
            color="destructive"
            size="sm"
            width="px_200"
            shadow="null"
            opacity="0"
            onClick={() => {
              onConfirm?.(task); // You can pass the task to delete
              onClose();
            }}
          >
            Delete
          </Button>
          <Button
            color="secondary"
            size="sm"
            width="px_200"
            shadow="null"
            opacity="null"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
