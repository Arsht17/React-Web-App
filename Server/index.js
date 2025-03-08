import express from "express";
import cors from "cors";
import crypto from "crypto";
const app = express();

app.use(cors({}));
app.use(express.json({}));

// Task { name(string), description(string) status(todo | doing | done), subTasks([{id, name }]) }
// Column {id(string), name(string), tasks: []}
// Board {id(string), name(string), columns(Columns[])}

const boards = [
  {
    id: crypto.randomUUID(),
    name: "developers",
    columns: [{ id: 1, name: "To Do" }],
  },
  {
    id: crypto.randomUUID(),
    name: "products",
    columns: [],
  },
  {
    id: crypto.randomUUID(),
    name: "designers",
    columns: [],
  },
];

// return all boards
app.get("/api/boards", (req, res) => {
  setTimeout(() => {
    // load from db
    res.json(boards);
  }, 2000);
});

// delete board
app.delete("/api/boards/:id", (req, res) => {
  const { id } = req.params;
  const existsBoardIndex = boards.findIndex((b) => b.id === id);
  // update db
  if (existsBoardIndex !== -1) {
    const [deletedBoard] = boards.splice(existsBoardIndex, 1);
    return res.json(deletedBoard);
  }
  res.status(400).json({ message: "not found" });
});

// edit board
app.put("/api/boards", (req, res) => {
  const { board } = req.body;
  const existsBoardIndex = boards.findIndex((b) => b.id === board.id);
  // update db
  if (existsBoardIndex !== -1) {
    boards[existsBoardIndex] = board;
  }
  res.json(board);
});

//  create board
app.post("/api/boards", (req, res) => {
  const { board } = req.body;
  const id = crypto.randomUUID();
  const newBoard = { ...board, id, columns: board.columns || [] };
  boards.push(newBoard); // update db
  res.json(newBoard);
});

// Create a new column inside a board
app.post("/api/boards/:boardId/columns", (req, res) => {
  const { boardId } = req.params;
  const { column } = req.body;
  // Find the board by ID
  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }
  // Generate column ID
  const newColumn = { id: crypto.randomUUID(), ...column, tasks: [] }; // Ensure tasks array exists
  board.columns.push(newColumn);
  res.json(newColumn); // Return created column
});

app.listen(4000, () => {
  console.log("server run on port:", 4000);
});
