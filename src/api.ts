import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export type TaskItem = { id: number; description: string; isCompleted: boolean };

export const getTasks = async () => {
  const res = await api.get<TaskItem[]>("/tasks");
  return res.data;
};

export const addTask = async (description: string) => {
  const res = await api.post<TaskItem>("/tasks", { description });
  return res.data;
};

export const toggleTask = async (id: number) => {
  const res = await api.put<TaskItem>(`/tasks/${id}/toggle`);
  return res.data;
};

export const deleteTask = async (id: number) => {
  await api.delete(`/tasks/${id}`);
};
