const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require("../controllers/todoControllers");

const express = require("express");
const route = express.Router();

route.get("/get", getTodos);
route.post("/create", createTodo);
route.put("/update/:id", updateTodo);
route.delete("/delete/:id", deleteTodo);

module.exports = route;
