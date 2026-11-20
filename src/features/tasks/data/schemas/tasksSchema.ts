import { z } from 'zod';

/** Formas verificadas contra el backend (tasks.schemas.ts). */
export const taskStatusSchema = z.enum(['pending', 'in_progress', 'waiting_verification', 'completed']);

export const taskSchema = z.object({
  id: z.string(),
  household_id: z.string(),
  creator_id: z.string(),
  assignee_id: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: taskStatusSchema,
  due_date: z.any().nullable().optional(),
  /** Puntos al completarla (Premium). */
  points: z.number().optional(),
  completed_at: z.any().nullable().optional(),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;

/** GET /api/tasks?household_id=... */
export const tasksResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(taskSchema),
});

/** GET /api/tasks/points */
export const pointsSummaryResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.object({ user_id: z.string(), points: z.number() })),
});

/** POST /api/tasks, PATCH /api/tasks/:id y /:id/status */
export const taskResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: taskSchema,
});
