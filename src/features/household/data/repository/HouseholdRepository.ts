import type { ApiClient } from '@core/network/apiClient';
import { HouseholdApi } from '@features/household/data/api/HouseholdApi';
import { householdResponseSchema, type Household } from '@features/household/data/schemas/householdSchema';
import { Logger } from '@core/logger/Logger';

export class HouseholdRepository {
  private api: HouseholdApi;

  constructor(client: ApiClient) {
    this.api = new HouseholdApi(client);
  }

  async createHousehold(name: string): Promise<Household> {
    try {
      const raw = await this.api.createHousehold({ name });
      const parsed = householdResponseSchema.parse(raw);
      return parsed.data;
    } catch (error) {
      Logger.error('Error creating household in repository', error);
      throw error;
    }
  }

  async joinHousehold(inviteCode: string): Promise<Household> {
    try {
      const raw = await this.api.joinHousehold({ inviteCode });
      const parsed = householdResponseSchema.parse(raw);
      return parsed.data;
    } catch (error) {
      Logger.error('Error joining household in repository', error);
      throw error;
    }
  }
}
