import { createApiClient } from '@core/network/apiClient';
import { StorageService } from '@core/storage/StorageService';
import { AuthRepository } from '@features/auth/data/repository/AuthRepository';

let repo: AuthRepository | null = null;

/** Singleton perezoso — toda la "DI" del feature auth. */
export function getAuthRepository(): AuthRepository {
  if (!repo) {
    repo = new AuthRepository(createApiClient(), new StorageService());
  }
  return repo;
}
