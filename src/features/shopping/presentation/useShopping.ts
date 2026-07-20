import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getShoppingRepository } from '@features/shopping/data/shoppingFactory';
import { shoppingQueryKeys } from '@features/shopping/data/queryKeys';
import type { ShoppingItem, ShoppingList } from '@features/shopping/data/schemas/shoppingSchema';
import {
  SHOPPING_CATEGORIES,
  normalizeCategory,
  type ShoppingCategory,
} from '@features/shopping/domain/categories';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';

/**
 * Ítem con la lista a la que pertenece. La UI agrupa por categoría mezclando
 * ítems de todas las listas del hogar, pero el endpoint de toggle necesita el
 * listId correcto de CADA ítem — no sirve asumir la primera lista.
 */
export interface ShoppingItemWithList extends ShoppingItem {
  listId: string;
}

export interface CategorySection {
  category: ShoppingCategory;
  items: ShoppingItemWithList[];
}

interface ToggleInput {
  listId: string;
  itemId: string;
  isCompleted: boolean;
}

export function useShopping() {
  const household = useCurrentHousehold();
  const householdId = household?.id;
  const queryClient = useQueryClient();
  const queryKey = shoppingQueryKeys.byHousehold(householdId as string);

  const query = useQuery({
    queryKey,
    queryFn: () => getShoppingRepository().listByHousehold(householdId as string),
    enabled: !!householdId,
  });

  const lists = useMemo(() => query.data ?? [], [query.data]);

  /** Ítems de todas las listas, agrupados por categoría (sin secciones vacías). */
  const sections = useMemo<CategorySection[]>(() => {
    const allItems: ShoppingItemWithList[] = lists.flatMap((list) =>
      list.items.map((item) => ({ ...item, listId: list.id })),
    );
    return SHOPPING_CATEGORIES.map((category) => ({
      category,
      items: allItems.filter((item) => normalizeCategory(item.category) === category),
    })).filter((section) => section.items.length > 0);
  }, [lists]);

  const totalItems = useMemo(
    () => lists.reduce((count, list) => count + list.items.length, 0),
    [lists],
  );

  const toggleMutation = useMutation({
    mutationFn: ({ listId, itemId, isCompleted }: ToggleInput) =>
      getShoppingRepository().toggleItem(listId, itemId, isCompleted),
    // Update optimista: el check se siente instantáneo y se revierte solo si
    // el backend falla (docs/UI-UX.md §6).
    onMutate: async ({ itemId, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ShoppingList[]>(queryKey);
      queryClient.setQueryData<ShoppingList[]>(queryKey, (old) =>
        old?.map((list) => ({
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, is_completed: isCompleted } : item,
          ),
        })),
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    householdName: household?.name,
    sections,
    totalItems,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching,
    refresh: () => query.refetch(),
    toggleItem: (item: ShoppingItemWithList) =>
      toggleMutation.mutate({
        listId: item.listId,
        itemId: item.id,
        isCompleted: !item.is_completed,
      }),
  };
}
