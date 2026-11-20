import { z } from 'zod';

/** Formas verificadas contra el backend (calendar.schemas.ts). */
export const recurrenceSchema = z
  .object({ freq: z.enum(['daily', 'weekly', 'monthly']), until: z.string().nullable().optional() })
  .nullable();

export type Recurrence = z.infer<typeof recurrenceSchema>;
export type RecurrenceFreq = NonNullable<Recurrence>['freq'];

export const calendarEventSchema = z.object({
  id: z.string(),
  household_id: z.string(),
  created_by: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  start_at: z.string(),
  end_at: z.string().nullable().optional(),
  all_day: z.boolean(),
  recurrence: recurrenceSchema.optional(),
  attendees: z.array(z.string()).optional(),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;

/** Una aparición concreta: los repetidos llegan una vez por cada día que tocan. */
export const calendarOccurrenceSchema = calendarEventSchema.extend({
  occurrence_start: z.string(),
  occurrence_end: z.string().nullable().optional(),
});

export type CalendarOccurrence = z.infer<typeof calendarOccurrenceSchema>;

export const occurrencesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(calendarOccurrenceSchema),
});

export const eventResponseSchema = z.object({
  success: z.boolean(),
  data: calendarEventSchema,
});
