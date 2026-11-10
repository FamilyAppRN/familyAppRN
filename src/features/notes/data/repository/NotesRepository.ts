import type { ApiClient } from '@core/network/apiClient';
import { Logger } from '@core/logger/Logger';
import { NotesApi, type NewNoteBody, type UpdateNoteBody } from '@features/notes/data/api/NotesApi';
import { noteResponseSchema, notesResponseSchema, type Note } from '@features/notes/data/schemas/notesSchema';

export class NotesRepository {
  private api: NotesApi;

  constructor(client: ApiClient) {
    this.api = new NotesApi(client);
  }

  async listByHousehold(householdId: string): Promise<Note[]> {
    try {
      return notesResponseSchema.parse(await this.api.listByHousehold(householdId)).data;
    } catch (error) {
      Logger.error('Error listando notas', error);
      throw error;
    }
  }

  async create(householdId: string, body: NewNoteBody): Promise<Note> {
    try {
      return noteResponseSchema.parse(await this.api.create(householdId, body)).data;
    } catch (error) {
      Logger.error('Error creando nota', error);
      throw error;
    }
  }

  async update(householdId: string, noteId: string, body: UpdateNoteBody): Promise<Note> {
    try {
      return noteResponseSchema.parse(await this.api.update(householdId, noteId, body)).data;
    } catch (error) {
      Logger.error('Error editando nota', error);
      throw error;
    }
  }

  async remove(householdId: string, noteId: string): Promise<void> {
    try {
      await this.api.remove(householdId, noteId);
    } catch (error) {
      Logger.error('Error borrando nota', error);
      throw error;
    }
  }
}
