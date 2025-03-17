import "./App.css";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Header } from "./components/Header/Header";
import { Main } from "./components/Main/Main";
import { WaitingView } from "./components/WaitingView/WaitingView";
import { BoardFormModal } from "./components/BoardFormModal/BoardFormModal";
import { useAppContext } from "./contexts/AppContext";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { boardsSlice, themeSlice } from "./store";
import { AddNewTask } from "./components/AddNewTask/AddNewTask";
import { AddNewColumn } from "./components/AddNewColumn/AddNewColumn";

async function getBoards() {
  const res = await fetch("http://localhost:4000/api/boards");
  const body = await res.json();
  return body;
}

//reder app => useEffect=> setState=> render app=>...
function App() {
  const isDarkMode = useSelector((state) => {
    return state?.theme?.isDarkMode;
  });
  const [isLoading, setIsLoading] = useState(false);
  const appContext = useAppContext();
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState(null);
  console.log("boardToEdit", boardToEdit);
  const dispatch = useDispatch();
  const [isAddNewTaskOpen, setIsAddNewTaskOpen] = useState(false);
  const [isAddNewColumnOpen, setIsAddNewColumnOpen] = useState(false);
  const [selectedBoardForColumn, setSelectedBoardForColumn] = useState(null);
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const { setSelectedBoardId } = useAppContext();

  function openModal(board) {
    setIsBoardModalOpen(true);
    setBoardToEdit(board ?? null);
  }
  //Arrow Function - const handleCloseModal = () => setIsOpenEditBoard(false);
  function closeModal() {
    setIsBoardModalOpen(false);
    setBoardToEdit(null);
  }

  function openAddNewTask(columnId, boardId) {
    setIsAddNewTaskOpen(true);
    setSelectedColumnId(columnId);
    setSelectedBoardId(boardId);
  }

  function closeAddNewTask() {
    setIsAddNewTaskOpen(false);
  }
  function openAddNewColumn(selectedBoard) {
    if (!selectedBoard) {
      console.error("Error: selectedBoard is undefined");
      return;
    }
    setIsAddNewColumnOpen(true);
    setSelectedBoardForColumn(selectedBoard);
  }

  function closeAddNewColumn() {
    setIsAddNewColumnOpen(false);
    setSelectedBoardForColumn(null);
  }

  useEffect(() => {
    setIsLoading(true);
    getBoards().then((data) => {
      console.log("data", data);
      //appContext.setBoards?.(data); //save in state
      dispatch(boardsSlice.actions.setBoards(data));
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <WaitingView />;
  }

  return (
    <div className="app">
      <Header openEditBoardModal={openModal} openAddNewTask={openAddNewTask} />
      <div className="content">
        <Sidebar
          onCreateBoard={openModal}
          isDarkMode={isDarkMode}
          setIsDarkMode={() => {
            dispatch(themeSlice.actions.toggleTheme());
            //setIsDarkMode(!isDarkMode);
            //html element to be dark
            document.documentElement.classList.toggle("dark", !isDarkMode);
          }}
        />
        <div className="right">
          <Main openAddNewColumn={openAddNewColumn} />
        </div>
      </div>

      {isBoardModalOpen && (
        <BoardFormModal close={closeModal} boardToEdit={boardToEdit} />
      )}
      {isAddNewTaskOpen && selectedColumnId && selectedBoardId && (
        <AddNewTask
          close={closeAddNewTask}
          columnId={selectedColumnId}
          boardId={selectedBoardId}
        />
      )}
      {isAddNewColumnOpen && selectedBoardForColumn && (
        <AddNewColumn
          onClose={closeAddNewColumn}
          boardId={selectedBoardForColumn?.id}
          selectedBoard={selectedBoardForColumn}
        />
      )}
    </div>
  );
}

export default App;
