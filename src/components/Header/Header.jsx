import Button from "../Button/Button";
import "./Header.scss";
import { useLocation, useParams } from "wouter";
import { Api } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { boardsSlice } from "../../store";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import { DeleteBoardModal } from "../DeleteBoardModal/DeleteBoardModal";
import { useState } from "react";

export function Header({ openEditBoardModal, openAddNewTask }) {
  const [location, setLocation] = useLocation();
  const params = useParams();
  const dispatch = useDispatch();
  const selectedBoardName = params?.boardName;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const selectedBoard = useSelector((state) =>
    boardsSlice.selectors.selectedBoard(state, selectedBoardName)
  );

  async function deleteBoard() {
    if (!selectedBoard) return;
    const deleteBoard = await Api.deleteBoard(selectedBoard.id); //update server
    console.log("deleteBoard", deleteBoard);
    dispatch(boardsSlice.actions.deleteBoard(selectedBoard.id)); //update client
    setLocation("/"); // update
    setIsDeleteModalOpen(false);
  }

  const isAddTaskDisabled =
    !selectedBoard ||
    !selectedBoard.columns ||
    selectedBoard.columns.length === 0;
  return (
    <>
      <div className="Header">
        <p className="kanban">
          <svg
            className="kanban-logo"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="6" height="25" rx="2" fill="#635FC7" />
            <rect
              opacity="0.75"
              x="9"
              width="6"
              height="25"
              rx="2"
              fill="#635FC7"
            />
            <rect
              opacity="0.5"
              x="18"
              width="6"
              height="25"
              rx="2"
              fill="#635FC7"
            />
          </svg>
          KanBan
          <span className="line"></span>
        </p>
        <p className="title"> Platform Launch</p>
        <div className="add">
          <Button
            disabled={isAddTaskDisabled}
            color="primary"
            size="lg"
            shadow="null"
            width="scope_2"
            opacity="0"
            onClick={() => {
              if (selectedBoard && selectedBoard.columns.length > 0) {
                const firstColumnId = selectedBoard.columns[0].id; // Get the first column
                openAddNewTask(firstColumnId, selectedBoard.id); // Pass IDs
              } else {
                console.error("No columns available to add tasks.");
              }
            }}
          >
            + Add New Task
          </Button>
        </div>
        <div className="actions">
          <Menu>
            <MenuButton className="dots">
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
            <MenuItems transition anchor="bottom end" className="menuItems">
              <MenuItem className="menuItem">
                <span
                  onClick={() => {
                    console.log("edit board");
                    openEditBoardModal(selectedBoard);
                  }}
                  className=""
                  style={{ color: "#828fa3" }}
                >
                  <PencilIcon style={{ width: "24px", height: "24px" }} />
                  Edit Board
                </span>
              </MenuItem>
              <MenuItem className="menuItem">
                <span
                  onClick={() => {
                    console.log("delete board");
                    setIsDeleteModalOpen(true);
                  }}
                  className=""
                  style={{ color: "red" }}
                >
                  <TrashIcon style={{ width: "24px", height: "24px" }} />
                  Delete Board
                </span>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteBoardModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={deleteBoard}
          boardName={selectedBoard?.name}
        />
      )}
    </>
  );
}
