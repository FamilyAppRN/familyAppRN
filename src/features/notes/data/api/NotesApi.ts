import type { ApiClient } from '@core/network/apiClient';

export interface NewNoteBody {
  title: string;
  content: string;
  color?: string;
  pinned?: boolean;
}

export type UpdateNoteBody = Partial<NewNoteBody>;

export class NotesApi {
  constructor(private client: ApiClient) {}

  listByHousehold(householdId: string) {
    return this.client.get<unknown>(`/api/notes/${householdId}`);
  }

  create(householdId: string, body: NewNoteBody) {
    return this.client.post<unknown>(`/api/notes/${householdId}`, body);
  }

  update(householdId: string, noteId: string, body: UpdateNoteBody) {
    return this.client.patch<unknown>(`/api/notes/${householdId}/${noteId}`, body);
  }

  remove(householdId: string, noteId: string) {
    return this.client.delete<unknown>(`/api/notes/${householdId}/${noteId}`);
  }
}
