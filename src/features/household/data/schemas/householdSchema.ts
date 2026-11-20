import { z } from 'zod';

export const householdMemberSchema = z.object({
  user_id: z.string(),
  role: z.union([z.literal('admin'), z.literal('member'), z.literal('kid')]),
  display_name: z.string(),
  joined_at: z.any().optional(),
});

export const householdSchema = z.object({
  id: z.string(),
  name: z.string(),
  admin_id: z.string(),
  members: z.array(householdMemberSchema),
  invite_code: z.string(),
  /** Premium del hogar (lo decide el plan de su dueño). */
  is_premium: z.boolean().optional(),
  settings: z.object({
    timezone: z.string(),
    locale: z.string(),
  }).optional(),
  created_at: z.any().optional(),
  updated_at: z.any().optional(),
});

export type Household = z.infer<typeof householdSchema>;

export const householdResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: householdSchema,
});

export type HouseholdResponse = z.infer<typeof householdResponseSchema>;
