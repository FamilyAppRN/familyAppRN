import type { ApiClient } from '@core/network/apiClient';

export class HouseholdApi {
  constructor(private client: ApiClient) {}

  /** Hogar completo CON members[]. El summary de /me no los trae. */
  getHousehold(householdId: string) {
    return this.client.get<unknown>(`/api/households/${householdId}`);
  }

  createHousehold(body: { name: string; settings?: { timezone: string; locale: string } }) {
    return this.client.post<unknown>('/api/households', body);
  }

  joinHousehold(body: { inviteCode: string }) {
    return this.client.post<unknown>('/api/households/join', body);
  }

  /** Solo admin. */
  updateHousehold(householdId: string, body: { name: string }) {
    return this.client.patch<unknown>(`/api/households/${householdId}`, body);
  }

  /** Solo admin. Manda el código por email. */
  sendInvitation(householdId: string, body: { email: string }) {
    return this.client.post<unknown>(`/api/households/${householdId}/invitations`, body);
  }

  /** Solo admin. El código anterior deja de servir. */
  regenerateInviteCode(householdId: string) {
    return this.client.post<unknown>(`/api/households/${householdId}/invite-code/regenerate`);
  }

  /** Avisa al resto del hogar que vas al supermercado. */
  goingShopping(householdId: string) {
    return this.client.post<unknown>(`/api/households/${householdId}/going-shopping`);
  }

  /** Un admin quita a otro miembro, o el propio usuario sale del hogar. */
  removeMember(householdId: string, userId: string) {
    return this.client.delete<unknown>(`/api/households/${householdId}/members/${userId}`);
  }
}
