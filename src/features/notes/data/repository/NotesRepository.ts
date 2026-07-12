import type { ApiClient } from '@core/network/apiClient';
import { Logger } from '@core/logger/Logger';
import { notesResponseSchema, type Note } from '@features/notes/data/schemas/notesSchema';

export class NotesRepository {
  constructor(private client: ApiClient) {}

  async listByHousehold(householdId: string): Promise<Note[]> {
    try {
      const raw = await this.client.get<unknown>(`/api/notes/${householdId}`);
      return notesResponseSchema.parse(raw).data;
    } catch (error) {
      Logger.error('Error listando notas', error);
      throw error;
    }
  }
}
