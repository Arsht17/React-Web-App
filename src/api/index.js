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
};
