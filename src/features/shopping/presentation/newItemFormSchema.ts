import { z } from 'zod';

import { SHOPPING_CATEGORIES, SHOPPING_UNITS } from '@features/shopping/domain/categories';

// Los mensajes son claves i18n; se traducen al mostrarse (con useTranslation).
export const newItemFormSchema = z.object({
  name: z.string().trim().min(1, 'validation.itemNameRequired'),
  quantity: z.number().int().min(1, 'validation.quantityMin'),
  unit: z.enum(SHOPPING_UNITS),
  category: z.enum(SHOPPING_CATEGORIES),
});

export type NewItemFormData = z.infer<typeof newItemFormSchema>;
