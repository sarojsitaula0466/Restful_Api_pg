const express = require("express");
const app = express();
const pool = require("./db");
app.use(express.json());

// get all todos
app.get("/todos", async (req, res) => {
  const allTodos = await pool.query("SELECT * FROM todo");
  res.json(allTodos.rows);
});

// get a single todo

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id=$1", [id]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// Update table
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params; // WHERE
    const { description } = req.body; // SET
    const updateTodo = await pool.query(
      "UPDATE todo SET description=$1 WHERE todo_id=$2",
      [description, id]
    );
    res.json("todo is updated");
  } catch (error) {
    console.log(error.message);
  }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id=$1", [
      id,
    ]);
    res.json("Todo successfully deleted");
  } catch (error) {
    console.log(error.message);
  }
});

// Create todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(newTodo);
  } catch (error) {
    console.log(error.message);
  }
});
app.listen(5000, () => {
  console.log("server running on port 5000");
});
