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

  function openModal(board) {
    setIsBoardModalOpen(true);
    setBoardToEdit(board ?? null);
  }
  //Arrow Function - const handleCloseModal = () => setIsOpenEditBoard(false);
  function closeModal() {
    setIsBoardModalOpen(false);
    setBoardToEdit(null);
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
      <div className="left">
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
      </div>
      <div className="right">
        <Header openEditBoardModal={openModal} />
        <Main openEditBoardModal={openModal} />
      </div>
      {isBoardModalOpen && (
        <BoardFormModal close={closeModal} boardToEdit={boardToEdit} />
      )}
    </div>
  );
}

export default App;
