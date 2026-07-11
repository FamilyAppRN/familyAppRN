import { createApiClient } from '@core/network/apiClient';
import { sessionStorage } from '@core/session/SessionStorage';
import { AuthRepository } from '@features/auth/data/repository/AuthRepository';

let repo: AuthRepository | null = null;

/** Singleton perezoso — toda la "DI" del feature auth. */
export function getAuthRepository(): AuthRepository {
  if (!repo) {
    repo = new AuthRepository(createApiClient(), sessionStorage);
  }
  return repo;
}
