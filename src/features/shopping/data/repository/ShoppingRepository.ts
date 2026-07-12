import type { ApiClient } from '@core/network/apiClient';
import { Logger } from '@core/logger/Logger';
import {
  shoppingListsResponseSchema,
  type ShoppingList,
} from '@features/shopping/data/schemas/shoppingSchema';

export class ShoppingRepository {
  constructor(private client: ApiClient) {}

  async listByHousehold(householdId: string): Promise<ShoppingList[]> {
    try {
      const raw = await this.client.get<unknown>(`/api/shopping/${householdId}`);
      return shoppingListsResponseSchema.parse(raw).data;
    } catch (error) {
      Logger.error('Error listando compras', error);
      throw error;
    }
  }
}
