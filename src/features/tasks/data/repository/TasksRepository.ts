import type { ApiClient } from '@core/network/apiClient';
import { Logger } from '@core/logger/Logger';
import { TasksApi, type NewTaskBody, type UpdateTaskBody } from '@features/tasks/data/api/TasksApi';
import {
  taskResponseSchema,
  tasksResponseSchema,
  type Task,
  type TaskStatus,
} from '@features/tasks/data/schemas/tasksSchema';

export class TasksRepository {
  private api: TasksApi;

  constructor(client: ApiClient) {
    this.api = new TasksApi(client);
  }

  async listByHousehold(householdId: string): Promise<Task[]> {
    try {
      return tasksResponseSchema.parse(await this.api.listByHousehold(householdId)).data;
    } catch (error) {
      Logger.error('Error listando tareas', error);
      throw error;
    }
  }

  async create(body: NewTaskBody): Promise<Task> {
    try {
      return taskResponseSchema.parse(await this.api.create(body)).data;
    } catch (error) {
      Logger.error('Error creando tarea', error);
      throw error;
    }
  }

  async update(taskId: string, body: UpdateTaskBody): Promise<Task> {
    try {
      return taskResponseSchema.parse(await this.api.update(taskId, body)).data;
    } catch (error) {
      Logger.error('Error editando tarea', error);
      throw error;
    }
  }

  async setStatus(taskId: string, status: TaskStatus): Promise<Task> {
    try {
      return taskResponseSchema.parse(await this.api.updateStatus(taskId, status)).data;
    } catch (error) {
      Logger.error('Error cambiando estado de tarea', error);
      throw error;
    }
  }

  async remove(taskId: string): Promise<void> {
    try {
      await this.api.remove(taskId);
    } catch (error) {
      Logger.error('Error borrando tarea', error);
      throw error;
    }
  }
}
