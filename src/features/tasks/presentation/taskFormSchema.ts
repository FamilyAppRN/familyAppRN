import { z } from 'zod';

/** "keep" conserva una fecha que no es hoy ni mañana al editar. */
export const TASK_WHEN = ['today', 'tomorrow', 'none', 'keep'] as const;
export type TaskWhen = (typeof TASK_WHEN)[number];

// Los mensajes son claves i18n; se traducen al mostrarse.
export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'validation.taskTitleRequired'),
  description: z.string(),
  assigneeId: z.string().nullable(),
  when: z.enum(TASK_WHEN),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
