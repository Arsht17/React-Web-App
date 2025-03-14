import "./Columns.scss";
import { useState, useEffect } from "react";
import Task from "../Task/Task";

const columnColors = ["#49C4E5", "#8471F2", "#67E2AE"];
const colorMap = new Map();

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

function Column({ column, index }) {
  const [color, setColor] = useState(columnColors[index] || getRandomColor());

  useEffect(() => {
    if (!colorMap.has(column.id)) {
      colorMap.set(column.id, columnColors[index] || getRandomColor());
    }
    setColor(colorMap.get(column.id));
  }, [column.id, index]);

  return (
    <div className="column">
      <div className="column-header">
        <span className="column-circle" style={{ backgroundColor: color }} />
        <h4>
          {column.name} ({column.tasks?.length || 0})
        </h4>
      </div>
      <div className="tasks-container">
        {column.tasks?.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
export default Column;
