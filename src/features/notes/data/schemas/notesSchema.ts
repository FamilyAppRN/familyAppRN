import { z } from 'zod';

/** Forma verificada contra el backend (note.schema.ts). */
export const noteSchema = z.object({
  id: z.string(),
  household_id: z.string(),
  author_id: z.string(),
  title: z.string(),
  content: z.string(),
  color: z.string(),
  pinned: z.boolean(),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
});

export type Note = z.infer<typeof noteSchema>;

/** GET /api/notes/:householdId */
export const notesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(noteSchema),
});
