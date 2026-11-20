import type { Note } from '@features/notes/data/schemas/notesSchema';

/**
 * Colores de nota. El backend guarda el hex tal cual (campo `color`), así que
 * estos valores son datos, no estilos: la UI los usa como fondo de la tarjeta.
 */
export const NOTE_COLORS = [
  { key: 'white', value: '#FFFFFF' },
  { key: 'amber', value: '#FFF3DC' },
  { key: 'green', value: '#DCEFE2' },
  { key: 'blue', value: '#E3EAF5' },
  { key: 'coral', value: '#FFE6DA' },
] as const;

export type NoteColorKey = (typeof NOTE_COLORS)[number]['key'];

export const DEFAULT_NOTE_COLOR = NOTE_COLORS[0].value;

/** Límites del backend (notes.schemas.ts). */
export const NOTE_TITLE_MAX = 100;
export const NOTE_CONTENT_MAX = 2000;

/**
 * Nota rápida desde la barra de abajo: la primera línea es el título y el
 * texto completo es el contenido (el backend exige ambos).
 */
export function quickNoteFromText(text: string): { title: string; content: string } | null {
  const content = text.trim().slice(0, NOTE_CONTENT_MAX);
  if (!content) return null;
  const firstLine = content.split('\n')[0].trim();
  return { title: firstLine.slice(0, NOTE_TITLE_MAX), content };
}

/** El cuerpo solo se muestra si agrega algo al título. */
export function noteBody(note: Note): string | null {
  const body = note.content.trim();
  return body === note.title.trim() ? null : body;
}

/** Fijadas primero; dentro de cada grupo, la más reciente arriba. */
export function sortNotes(notes: Note[]): { pinned: Note[]; others: Note[] } {
  const byRecent = (a: Note, b: Note) =>
    new Date(b.updated_at ?? b.created_at ?? 0).getTime() - new Date(a.updated_at ?? a.created_at ?? 0).getTime();
  return {
    pinned: notes.filter((n) => n.pinned).sort(byRecent),
    others: notes.filter((n) => !n.pinned).sort(byRecent),
  };
}

/** Misma regla que el backend: el autor o un admin del hogar. */
export function canEditNote(note: Note, userId: string | undefined, isAdmin: boolean): boolean {
  return !!userId && (note.author_id === userId || isAdmin);
}
