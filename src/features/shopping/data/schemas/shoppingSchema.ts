import { z } from 'zod';

/** Formas verificadas contra el backend (shopping.schemas.ts). */
export const shoppingItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  // OPCIONALES A PROPÓSITO: se agregaron a la API después, así que un backend
  // desplegado más viejo no los devuelve. Si fueran requeridos, Zod reventaría
  // la pantalla entera. La UI cae a 'general' (→ "Otros") y sin unidad.
  unit: z.string().nullable().optional(),
  category: z.string().optional(),
  is_completed: z.boolean(),
  added_by: z.string(),
  checked_by: z.string().nullable().optional(),
});

export type ShoppingItem = z.infer<typeof shoppingItemSchema>;

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

/**
 * POST /api/shopping, POST /:listId/items y PATCH /:listId/items/:itemId.
 * Ojo: las mutaciones de ítem devuelven la LISTA COMPLETA, no el ítem.
 */
export const shoppingListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: shoppingListSchema,
});
