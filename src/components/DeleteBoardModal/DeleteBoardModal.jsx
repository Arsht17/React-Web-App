import "./DeleteBoardModal.scss";
import Button from "../Button/Button";

export function DeleteBoardModal({ isOpen, onClose, onConfirm, boardName }) {
  if (!isOpen) return null;

  return (
    <div className="DeleteBoardModal">
      <div
        className="DeleteBoardModal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="DeleteBoardModal-title">Delete this board?</h3>
        <p>
          Are you sure you want to delete the '<strong>{boardName}</strong>'
          board? This <br /> action will remove all columns and tasks and cannot
          be reversed.
        </p>
        <div className="DeleteBoardModal-actions">
          <Button
            color="destructive"
            size="sm"
            width="px_200"
            shadow="null"
            opacity="0"
            onClick={onConfirm}
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
