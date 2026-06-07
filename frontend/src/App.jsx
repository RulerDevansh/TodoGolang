import { useEffect, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://todo-golang-server.vercel.app";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      if (!res.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setTitle("");
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  async function deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task.id !== id));
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Todo App</h1>
        <form onSubmit={addTask} className="form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task"
          />
          <button type="submit">Add</button>
        </form>

        {error && <p className="error">{error}</p>}

        <ul className="list">
          {(tasks || []).map((task) => (
            <li key={task.id} className="list-item">
              <span>{task.title}</span>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
