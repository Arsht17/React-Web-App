import "./TaskModal.scss";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

function TaskModal({ task, onClose, opentaskToEdit }) {
  const completedSubtasks =
    task.subtasks?.filter((sub) => sub.isCompleted).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div className="TaskModal" onClick={onClose}>
      <div className="TaskModal-wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="Operations">
          <Menu>
            <MenuButton className="ovals">
              <svg
                className="menu-icon"
                width="5"
                height="20"
                viewBox="0 0 5 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="2.30769" cy="2.30769" r="2.30769" fill="#828FA3" />
                <circle cx="2.30769" cy="10.0001" r="2.30769" fill="#828FA3" />
                <circle cx="2.30769" cy="17.6922" r="2.30769" fill="#828FA3" />
              </svg>
            </MenuButton>
            <MenuItems transition className="list">
              <MenuItem className="Operation">
                <span
                  onClick={() => {
                    console.log("edit task");
                    opentaskToEdit(task);
                    onClose();
                  }}
                >
                  Edit Task
                </span>
              </MenuItem>
              <MenuItem className="Operation">
                <span style={{ color: "#eb0707" }}>Delete Task </span>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
        <div className="TaskModal-content" onClick={(e) => e.stopPropagation()}>
          <h3 className="TaskModal-title">{task?.name}</h3>
          <p className="TaskModal-description">{task?.description}</p>
          <p className="TaskModal-Subtasks">
            <strong>Subtasks</strong> ({completedSubtasks} of {totalSubtasks})
          </p>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
