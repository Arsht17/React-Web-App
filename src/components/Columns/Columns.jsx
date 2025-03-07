import "./Columns.scss";

const columnColors = ["#49C4E5", "#8471F2", "#67E2AE"];
function getRandomColor() {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return randomColor;
}

function Column({ column, index }) {
  const color =
    index < columnColors.length
      ? columnColors[index] // Use predefined color for first 3 columns
      : getRandomColor(); // Assign random color for others

  return (
    <div className="column">
      <div className="column-header">
        <span className="column-circle" style={{ backgroundColor: color }} />
        <h4>
          {column.name} ({column.tasks?.length || 0})
        </h4>
      </div>
      {/* (tasks) */}
    </div>
  );
}
export default Column;
