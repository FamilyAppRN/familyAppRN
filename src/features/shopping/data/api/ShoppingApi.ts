import type { ApiClient } from '@core/network/apiClient';

export interface NewItemBody {
  name: string;
  quantity: number;
  unit?: string | null;
  category?: string;
}

export class ShoppingApi {
  constructor(private client: ApiClient) {}

  listByHousehold(householdId: string) {
    return this.client.get<unknown>(`/api/shopping/${householdId}`);
  }

  createList(body: { household_id: string; name: string }) {
    return this.client.post<unknown>('/api/shopping', body);
  }

  addItem(listId: string, body: NewItemBody) {
    return this.client.post<unknown>(`/api/shopping/${listId}/items`, body);
  }

  toggleItem(listId: string, itemId: string, body: { is_completed: boolean }) {
    return this.client.patch<unknown>(`/api/shopping/${listId}/items/${itemId}`, body);
  }
}
