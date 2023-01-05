const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
const initializeBDAndserver = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log(`Server running at http://localhost:3000`);
    });
  } catch (e) {
    console.log(`DB Error:${e.mesaage}`);
    process.exit(1);
  }
};
initializeBDAndserver();

//API 1
// Scenario 1 and Scenario 2 Scenario 4
app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const keys = Object.keys(request.query);
  const value = request.query[keys[0]];
  if (keys[0] != "search_q") {
    const getStatusAllQueries = `SELECT * FROM todo WHERE ${keys[0]} = '${value}'`;
    const getStatus = await db.all(getStatusAllQueries);
    response.send(getStatus);
  } else {
    const getSearchQuery = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'`;
    const getSearch = await db.all(getSearchQuery);
    response.send(getSearch);
  }
});

//Scenario 3
app.get("/todos/", async (request, response) => {
  //   const { status } = request.query;
  const keys = Object.keys(request.query);
  const value = request.query[keys[0]];
  const value1 = request.query[keys[1]];

  const getStatusQuery = `SELECT * FROM todo WHERE ${keys[0]} = '${value} AND ${keys[1]} = '${value1}'`;
  const getStatusDT = await db.all(getStatusQuery);
  response.send(getStatusDT);
});

//API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoIdQuery = `SELECT * FROM todo WHERE id = ${todoId}`;
  const getId = await db.get(getTodoIdQuery);
  response.send(getId);
});

//API 3
app.post("/todos/", async (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status } = todoDetails;

  const createTodoQuery = `
    INSERT INTO todo(id,todo,priority,status)
    VALUES(
        ${id},
        '${todo}',
        '${priority}',
        '${status}'
    );`;
  const dbResponse = await db.run(createTodoQuery);
  console.log(dbResponse.lastID);
  response.send("Todo Successfully Added");
});

//API 4
//Scenario 1 and Scenario 2  and Scenario 3
app.put("/todos/:todoId", async (request, response) => {
  const { todoId } = request.params;
  const updateDetails = request.body;
  //   const { status } = updateDetails;
  const KEY = Object.keys(updateDetails);
  const VALUE = updateDetails[KEY[0]];
  updateTodoQuery = `UPDATE todo SET
      ${KEY[0]} = '${VALUE}'
      WHERE id = ${todoId}`;
  const getDt = await db.run(updateTodoQuery);

  if (KEY[0] === "status") {
    response.send("Status Updated");
  } else if (KEY[0] === "priority") {
    response.send("Priority Updated");
  } else if (KEY[0] === "todo") {
    response.send("Todo Updated");
  }
});

//API
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `DELETE FROM todo WHERE id = ${todoId}`;
  const deleteTodo = await db.run(deleteTodoQuery);
  response.send(`Todo Deleted`);
});
module.exports = app;
