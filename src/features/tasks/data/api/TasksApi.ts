import type { ApiClient } from '@core/network/apiClient';
import type { TaskStatus } from '@features/tasks/data/schemas/tasksSchema';

export interface NewTaskBody {
  household_id: string;
  title: string;
  description?: string;
  assignee_id?: string;
  /** ISO 8601. */
  due_date?: string;
  /** Solo en hogares Premium. */
  points?: number;
}

/** Campos editables. `null` borra el campo en el backend. */
export interface UpdateTaskBody {
  title?: string;
  description?: string | null;
  due_date?: string | null;
  assignee_id?: string | null;
  points?: number;
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

  /** Admin: aprueba (suma puntos) o devuelve a pendiente una tarea que marcó un niño. */
  verify(taskId: string, approve: boolean) {
    return this.client.post<unknown>(`/api/tasks/${taskId}/verify`, { approve });
  }

  /** Con `from` (ISO), solo lo completado desde esa fecha. */
  pointsSummary(householdId: string, from?: string) {
    return this.client.get<unknown>('/api/tasks/points', {
      params: { household_id: householdId, ...(from ? { from } : {}) },
    });
  }

  remove(taskId: string) {
    return this.client.delete<unknown>(`/api/tasks/${taskId}`);
  }
}
