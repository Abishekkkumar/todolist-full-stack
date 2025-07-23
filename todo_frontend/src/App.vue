<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const todos = ref([]);
const newTodoTitle = ref("");
const editingTodo = ref(null);
const editingTitle = ref("");
const apiResponse = ref("");
const apiUrl = "http://192.168.1.16:8000/todos";

async function fetchTodos() {
  try {
    const response = await axios.get(`${apiUrl}/get`);
    todos.value = response.data;
    apiResponse.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

async function addTodo() {
  if (!newTodoTitle.value.trim()) return;
  try {
    const response = await axios.post(`${apiUrl}/create`, {
      title: newTodoTitle.value,
      content: "No description", // Assuming content is optional and can be empty
      completed: false,
    });
    newTodoTitle.value = "";
    await fetchTodos();
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

function startEdit(todo) {
  editingTodo.value = todo;
  editingTitle.value = todo.title;
}

async function updateTodo(todo) {
  if (!editingTitle.value.trim()) return;
  try {
    await axios.put(`${apiUrl}/update/${todo._id}`, {
      title: editingTitle.value,
    });
    editingTodo.value = null;
    editingTitle.value = "";
    await fetchTodos();
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

async function deleteTodo(todo) {
  try {
    console.log("Deleting todo with ID:", todo._id);
    await axios.delete(`${apiUrl}/delete/${todo._id}`);
    await fetchTodos();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}
async function toggleCompleted(todo) {
    try {
        await axios.put(`${apiUrl}/update/${todo._id}`, {
            completed: !todo.completed,
        });
        await fetchTodos();
    } catch (error) {
        console.error("Error toggling completed:", error);
    }
}

onMounted(() => {
  fetchTodos();
});
</script>

<template>
  <div class="todo-app">
    <h1>TODO List</h1>
    <form @submit.prevent="addTodo">
      <input v-model="newTodoTitle" placeholder="Add new todo" />
      <button type="submit">Add</button>
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo._id">
        <template v-if="editingTodo && editingTodo._id === todo._id">
          <input v-model="editingTitle" />
          <button @click="updateTodo(todo)">Save</button>
          <button @click="editingTodo = null">Cancel</button>
        </template>
        <template v-else>
            <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleCompleted(todo)"
            title="Mark as completed"
          />
          <span class="todo-title">{{ todo.title }}</span>
          <button @click="startEdit(todo)">Edit</button>
          <button @click="deleteTodo(todo)">Delete</button>
        </template>
      </li>
    </ul>
    <div></div>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 420px;
  margin: 48px auto;
  padding: 28px 24px;
  background: #181818;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  color: #f3f3f3;
  font-family: "Segoe UI", Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 1px;
}

form {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

input {
  padding: 8px 12px;
  margin-right: 8px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #222;
  color: #f3f3f3;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
input:focus {
  border-color: #4f8cff;
}

button {
  padding: 7px 14px;
  margin-right: 4px;
  border: none;
  border-radius: 6px;
  background: #4f8cff;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
button:last-child {
  margin-right: 0;
}
button:hover {
  background: #357ae8;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin: 12px 0;
  display: flex;
  align-items: center;
  background: #232323;
  border-radius: 6px;
  padding: 8px 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  justify-content: space-between;
}

li input {
  flex: 1;
  margin-right: 8px;
}

li > .todo-title {
  flex: 1 1 auto;
  margin-right: 8px;
  word-break: break-word;
  text-align: left;
  min-width: 0;
}

li .todo-actions {
  display: flex;
  gap: 4px;
}

@media (max-width: 500px) {
  .todo-app {
    max-width: 98vw;
    padding: 16px 6px;
  }
  h1 {
    font-size: 1.3rem;
  }
}
</style>
