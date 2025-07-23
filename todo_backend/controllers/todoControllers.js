const Todo = require("../models/todoModels");

const createTodo = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newTodo = new Todo({ title, content });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const updateData = { ...req.body, createdAt: new Date() };
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTodo = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
