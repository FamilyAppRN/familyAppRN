import type { ApiClient } from '@core/network/apiClient';
import { HouseholdApi } from '@features/household/data/api/HouseholdApi';
import { householdResponseSchema, type Household } from '@features/household/data/schemas/householdSchema';
import { Logger } from '@core/logger/Logger';

export class HouseholdRepository {
  private api: HouseholdApi;

  constructor(client: ApiClient) {
    this.api = new HouseholdApi(client);
  }

  /** Hogar completo (incluye members[]), para avatares y resolver added_by. */
  async getHousehold(householdId: string): Promise<Household> {
    try {
      const raw = await this.api.getHousehold(householdId);
      return householdResponseSchema.parse(raw).data;
    } catch (error) {
      Logger.error('Error obteniendo el hogar', error);
      throw error;
    }
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

  async renameHousehold(householdId: string, name: string): Promise<Household> {
    try {
      return householdResponseSchema.parse(await this.api.updateHousehold(householdId, { name })).data;
    } catch (error) {
      Logger.error('Error renombrando el hogar', error);
      throw error;
    }
  }

  async sendInvitation(householdId: string, email: string): Promise<void> {
    try {
      await this.api.sendInvitation(householdId, { email });
    } catch (error) {
      Logger.error('Error enviando la invitación por email', error);
      throw error;
    }
  }

  async regenerateInviteCode(householdId: string): Promise<Household> {
    try {
      return householdResponseSchema.parse(await this.api.regenerateInviteCode(householdId)).data;
    } catch (error) {
      Logger.error('Error renovando el código de invitación', error);
      throw error;
    }
  }

  async notifyGoingShopping(householdId: string): Promise<void> {
    try {
      await this.api.goingShopping(householdId);
    } catch (error) {
      Logger.error('Error avisando que vas al súper', error);
      throw error;
    }
  }

  async removeMember(householdId: string, userId: string): Promise<void> {
    try {
      await this.api.removeMember(householdId, userId);
    } catch (error) {
      Logger.error('Error quitando miembro del hogar', error);
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
