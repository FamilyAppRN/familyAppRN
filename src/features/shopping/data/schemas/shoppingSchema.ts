import { z } from 'zod';

/** Formas verificadas contra el backend (shopping.schemas.ts). */
export const shoppingItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  is_completed: z.boolean(),
  added_by: z.string(),
  checked_by: z.string().nullable().optional(),
});

export const shoppingListSchema = z.object({
  id: z.string(),
  household_id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'archived']),
  items: z.array(shoppingItemSchema),
  created_by: z.string(),
  created_at: z.any().optional(),
});

export type ShoppingList = z.infer<typeof shoppingListSchema>;

/** GET /api/shopping/:householdId */
export const shoppingListsResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.array(shoppingListSchema),
});
