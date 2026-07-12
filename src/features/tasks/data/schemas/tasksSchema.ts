import { z } from 'zod';

/** Formas verificadas contra el backend (tasks.schemas.ts). */
export const taskStatusSchema = z.enum(['pending', 'in_progress', 'completed']);

export const taskSchema = z.object({
  id: z.string(),
  household_id: z.string(),
  creator_id: z.string(),
  assignee_id: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: taskStatusSchema,
  due_date: z.any().nullable().optional(),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
});

export type Task = z.infer<typeof taskSchema>;

/** GET /api/tasks?household_id=... */
export const tasksResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(taskSchema),
});
