import { createApiClient } from '@core/network/apiClient';
import { NotesRepository } from '@features/notes/data/repository/NotesRepository';

let repo: NotesRepository | null = null;

export function getNotesRepository(): NotesRepository {
  if (!repo) {
    repo = new NotesRepository(createApiClient());
  }
  return repo;
}
