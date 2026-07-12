import { createApiClient } from '@core/network/apiClient';
import { TasksRepository } from '@features/tasks/data/repository/TasksRepository';

let repo: TasksRepository | null = null;

export function getTasksRepository(): TasksRepository {
  if (!repo) {
    repo = new TasksRepository(createApiClient());
  }
  return repo;
}
