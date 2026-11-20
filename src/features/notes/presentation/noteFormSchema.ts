import { z } from 'zod';

import { NOTE_CONTENT_MAX, NOTE_TITLE_MAX } from '@features/notes/domain/notes';

// Los mensajes son claves i18n; se traducen al mostrarse.
export const noteFormSchema = z.object({
  title: z.string().trim().min(1, 'validation.noteTitleRequired').max(NOTE_TITLE_MAX),
  content: z.string().trim().min(1, 'validation.noteContentRequired').max(NOTE_CONTENT_MAX),
  color: z.string(),
  pinned: z.boolean(),
});

export type NoteFormData = z.infer<typeof noteFormSchema>;
