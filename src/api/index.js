async function request({ method = "GET", body, param } = {}) {
  console.log("body : ", body);
  console.log("method : ", method);
  // update server
  const res = await fetch(
    `http://localhost:4000/api/boards${param ? `/${param}` : ""}`,
    {
      headers: {
        "content-type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      method: method,
    }
  );
  const data = await res.json();
  return data;
}
// Boards API
export const Api = {
  getBoards() {
    return request();
  },
  createBoard(board) {
    return request({
      method: "POST",
      body: { board },
    });
  },
  deleteBoard(id) {
    return request({
      method: "DELETE",
      param: id,
    });
  },
  editBoard(board) {
    return request({
      method: "PUT",
      body: { board },
    });
  },

  // Columns API
  getColumns(boardId) {
    return request({
      method: "GET",
      param: `${boardId}/columns`,
    });
  },
  createColumn(boardId, column) {
    return request({
      method: "POST",
      body: { column },
      param: `${boardId}/columns`,
    });
  },
  deleteColumn(boardId, columnId) {
    return request({
      method: "DELETE",
      param: `${boardId}/columns/${columnId}`,
    });
  },
  editColumn(boardId, column) {
    return request({
      method: "PUT",
      body: { column },
      param: `${boardId}/columns/${column.id}`,
    });
  },

  // Tasks API
  getTasks(columnId) {
    return request({
      method: "GET",
      param: `columns/${columnId}/tasks`,
    });
  },
  createTask(columnId, task) {
    return request({
      method: "POST",
      body: { task },
      param: `columns/${columnId}/tasks`,
    });
  },
  deleteTask(columnId, taskId) {
    return request({
      method: "DELETE",
      param: `columns/${columnId}/tasks/${taskId}`,
    });
  },
  editTask(columnId, task) {
    return request({
      method: "PUT",
      body: { task },
      param: `columns/${columnId}/tasks/${task.id}`,
    });
  },
};
