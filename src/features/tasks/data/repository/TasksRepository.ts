import type { ApiClient } from '@core/network/apiClient';
import { Logger } from '@core/logger/Logger';
import { tasksResponseSchema, type Task } from '@features/tasks/data/schemas/tasksSchema';

export class TasksRepository {
  constructor(private client: ApiClient) {}

  async listByHousehold(householdId: string): Promise<Task[]> {
    try {
      const raw = await this.client.get<unknown>('/api/tasks', {
        params: { household_id: householdId },
      });
      return tasksResponseSchema.parse(raw).data;
    } catch (error) {
      Logger.error('Error listando tareas', error);
      throw error;
    }
  }
}
