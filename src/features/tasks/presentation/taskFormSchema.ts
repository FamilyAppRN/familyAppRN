import { z } from 'zod';

/** Valores ofrecidos para los puntos de una tarea. */
export const TASK_POINTS = [0, 5, 10, 20, 50] as const;

/** Hora que se propone al agregar hora a una tarea (18:00). */
export const DEFAULT_TASK_TIME = 18 * 60;

// Los mensajes son claves i18n; se traducen al mostrarse.
export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'validation.taskTitleRequired'),
  description: z.string(),
  assigneeId: z.string().nullable(),
  /** Día límite "YYYY-MM-DD" (hora local); null = sin fecha. */
  dueDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  /** Minutos desde medianoche; null = todo el día. Solo con `dueDay`. */
  dueTime: z.number().int().min(1).max(24 * 60 - 1).nullable(),
  /** 0 = sin puntos. Solo en hogares Premium. */
  points: z.number().int().min(0),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
