import React, { useEffect, useState } from "react";
import { getTasks, addTask, toggleTask, deleteTask, TaskItem } from "./api";

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newDesc, setNewDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const t = await getTasks(); setTasks(t); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newDesc.trim()) return;
    const created = await addTask(newDesc.trim());
    setTasks(prev => [...prev, created]);
    setNewDesc("");
  };

  const handleToggle = async (id: number) => {
    const updated = await toggleTask(id);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div className="add">
        <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="New task" />
        <button onClick={handleAdd}>Add</button>
      </div>
      {loading ? <p>Loading...</p> : null}
      <ul className="task-list">
        {tasks.map(t => (
          <li key={t.id} className={t.isCompleted ? "completed" : ""}>
            <input type="checkbox" checked={t.isCompleted} onChange={() => handleToggle(t.id)} />
            <span className="desc">{t.description}</span>
            <button className="del" onClick={() => handleDelete(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
