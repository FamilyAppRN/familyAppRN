import { createApiClient } from '@core/network/apiClient';
import { ShoppingRepository } from '@features/shopping/data/repository/ShoppingRepository';

let repo: ShoppingRepository | null = null;

export function getShoppingRepository(): ShoppingRepository {
  if (!repo) {
    repo = new ShoppingRepository(createApiClient());
  }
  return repo;
}
