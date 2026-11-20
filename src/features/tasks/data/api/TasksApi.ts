import type { ApiClient } from '@core/network/apiClient';
import type { TaskStatus } from '@features/tasks/data/schemas/tasksSchema';

export interface NewTaskBody {
  household_id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  /** ISO 8601. */
  due_date?: string;
}

/** Campos editables. `null` borra el campo en el backend. */
export interface UpdateTaskBody {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  assignee_id?: string | null;
}

export class TasksApi {
  constructor(private client: ApiClient) {}

  listByHousehold(householdId: string) {
    return this.client.get<unknown>('/api/tasks', { params: { household_id: householdId } });
  }

  create(body: NewTaskBody) {
    return this.client.post<unknown>('/api/tasks', body);
  }

  update(taskId: string, body: UpdateTaskBody) {
    return this.client.patch<unknown>(`/api/tasks/${taskId}`, body);
  }

  updateStatus(taskId: string, status: TaskStatus) {
    return this.client.patch<unknown>(`/api/tasks/${taskId}/status`, { status });
  }

  remove(taskId: string) {
    return this.client.delete<unknown>(`/api/tasks/${taskId}`);
  }
}
