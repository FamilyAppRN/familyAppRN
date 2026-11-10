/**
 * El backend guarda `category` como string libre. Acá se fija el conjunto que
 * la UI ofrece y agrupa: se persiste la CLAVE (estable entre idiomas) y solo
 * se traduce al mostrar (`shopping.categories.<clave>`).
 */
export const SHOPPING_CATEGORIES = ['vegetables', 'dairy', 'meat', 'cleaning', 'other'] as const;

export type ShoppingCategory = (typeof SHOPPING_CATEGORIES)[number];

/** Ítems anteriores a esta feature llegan con 'general' (o sin categoría). */
export const CATEGORY_FALLBACK: ShoppingCategory = 'other';

export function normalizeCategory(raw?: string | null): ShoppingCategory {
  return SHOPPING_CATEGORIES.includes(raw as ShoppingCategory)
    ? (raw as ShoppingCategory)
    : CATEGORY_FALLBACK;
}

/**
 * Atajos del estado vacío: lo que casi todas las casas compran. El nombre se
 * traduce al agregarlo (`shopping.quickAdd.<clave>`).
 */
export const QUICK_ADD_ITEMS: { key: string; category: ShoppingCategory }[] = [
  { key: 'milk', category: 'dairy' },
  { key: 'bread', category: 'other' },
  { key: 'eggs', category: 'dairy' },
  { key: 'fruit', category: 'vegetables' },
  { key: 'toiletPaper', category: 'cleaning' },
];

/** Unidades ofrecidas. `unit` = piezas (se omite al mostrar). */
export const SHOPPING_UNITS = ['unit', 'kg', 'g', 'l', 'ml'] as const;

export type ShoppingUnit = (typeof SHOPPING_UNITS)[number];
