import express from "express";
import cors from "cors";
const app = express();

app.use(cors({}));
app.use(express.json({}));

// Task { name(string), description(string) status(todo | doing | done), subTasks([{id, name }]) }
// Column {id(string), name(string), tasks: []}
// Board {id(string), name(string), columns(Columns[])}

const boards = [
  {
    id: "1",
    name: "developers",
    columns: [{ id: 1, name: "to do" }],
  },
  {
    id: "2",
    name: "products",
    columns: [],
  },
  {
    id: "3",
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
  const newBoard = { ...board, id };
  boards.push(newBoard); // update db
  res.json(newBoard);
});

app.listen(4000, () => {
  console.log("server run on port:", 4000);
});
