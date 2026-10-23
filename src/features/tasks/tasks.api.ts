import { api } from '../../lib/api';
import type { Task, TaskStatus } from '../../types';

export interface TaskFilters {
  status: TaskStatus | '';
  search: string;
}

export async function fetchTasks(filters: TaskFilters): Promise<Task[]> {
  const params: Record<string, string> = {};
  if (filters.status) params.status = filters.status;
  if (filters.search.trim()) params.search = filters.search.trim();
  const response = await api.get<Task[]>('/tasks', { params });
  return response.data;
}

export async function createTask(title: string, description: string): Promise<Task> {
  const response = await api.post<Task>('/tasks', { title: title.trim(), description: description.trim() });
  return response.data;
}

export async function updateTaskStatus(id: Task['id'], status: TaskStatus): Promise<void> {
  await api.patch(`/tasks/${id}/status`, { status });
}

export async function deleteTask(id: Task['id']): Promise<void> {
  await api.delete(`/tasks/${id}`);
}
