import type { ApiClient } from '@core/network/apiClient';

export class HouseholdApi {
  constructor(private client: ApiClient) {}

  createHousehold(body: { name: string; settings?: { timezone: string; locale: string } }) {
    return this.client.post<unknown>('/api/households', body);
  }

  joinHousehold(body: { inviteCode: string }) {
    return this.client.post<unknown>('/api/households/join', body);
  }
}
