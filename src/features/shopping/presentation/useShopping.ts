import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { getHouseholdRepository } from '@features/household/data/householdFactory';
import { shareInvite } from '@features/household/invite/shareInvite';

/** Tras avisar, el botón espera esto antes de dejar avisar otra vez. */
const GOING_SHOPPING_COOLDOWN_MS = 10 * 60 * 1000;

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
  const { t } = useTranslation();
  const { inviteCode, members } = useHouseholdMembers();
  const queryKey = shoppingQueryKeys.byHousehold(householdId as string);

  const query = useQuery({
    queryKey,
    queryFn: () => getShoppingRepository().listByHousehold(householdId as string),
    enabled: !!householdId,
  });

  const lists = useMemo(() => query.data ?? [], [query.data]);

  const allItems = useMemo<ShoppingItemWithList[]>(
    () => lists.flatMap((list) => list.items.map((item) => ({ ...item, listId: list.id }))),
    [lists],
  );

  /** Pendientes agrupados por categoría (sin secciones vacías). */
  const sections = useMemo<CategorySection[]>(() => {
    const pending = allItems.filter((item) => !item.is_completed);
    return SHOPPING_CATEGORIES.map((category) => ({
      category,
      items: pending.filter((item) => normalizeCategory(item.category) === category),
    })).filter((section) => section.items.length > 0);
  }, [allItems]);

  /** Lo ya marcado: va a la sección "En el carrito". */
  const cartItems = useMemo(() => allItems.filter((item) => item.is_completed), [allItems]);

  const totalItems = useMemo(
    () => lists.reduce((count, list) => count + list.items.length, 0),
    [lists],
  );

  const history = useMemo(() => {
    return lists
      .flatMap((list) => list.history ?? [])
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
  }, [lists]);

  const canFinalize = useMemo(() => {
    if (totalItems === 0) return false;
    return lists.every((list) => list.items.every((item) => item.is_completed));
  }, [totalItems, lists]);

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

  const finalizeMutation = useMutation({
    mutationFn: (listId: string) => getShoppingRepository().finalizePurchase(listId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  // "Voy al súper": un aviso por salida, no uno por toque.
  // Se guarda el hogar: al cambiar de hogar el botón vuelve a estar disponible.
  const [goingSent, setGoingSent] = useState<{ householdId: string } | null>(null);
  useEffect(() => {
    if (!goingSent) return;
    const timer = setTimeout(() => setGoingSent(null), GOING_SHOPPING_COOLDOWN_MS);
    return () => clearTimeout(timer);
  }, [goingSent]);

  const goingShoppingMutation = useMutation({
    mutationFn: () => getHouseholdRepository().notifyGoingShopping(householdId as string),
    onSuccess: () => setGoingSent({ householdId: householdId as string }),
  });

  const quickAddMutation = useMutation({
    mutationFn: (item: { name: string; category: ShoppingCategory }) =>
      getShoppingRepository().addItemToDefaultList(householdId as string, {
        name: item.name,
        quantity: 1,
        unit: null,
        category: item.category,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    householdName: household?.name,
    sections,
    cartItems,
    pendingCount: totalItems - cartItems.length,
    history,
    canFinalize,
    totalItems,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching,
    isFinalizing: finalizeMutation.isPending,
    refresh: () => query.refetch(),
    toggleItem: (item: ShoppingItemWithList) =>
      toggleMutation.mutate({
        listId: item.listId,
        itemId: item.id,
        isCompleted: !item.is_completed,
      }),
    goingShopping: () => goingShoppingMutation.mutate(),
    isGoingShoppingPending: goingShoppingMutation.isPending,
    goingShoppingSent: goingSent?.householdId === householdId,
    goingShoppingError: goingShoppingMutation.isError,
    quickAdd: (name: string, category: ShoppingCategory) => quickAddMutation.mutate({ name, category }),
    isQuickAdding: quickAddMutation.isPending,
    inviteCode,
    isAlone: members.length <= 1,
    shareInvite: () => {
      if (!inviteCode) return;
      shareInvite(t, household?.name ?? '', inviteCode);
    },
    finalizePurchase: () => {
      const activeList = lists.find((l) => l.items.length > 0);
      if (activeList) {
        finalizeMutation.mutate(activeList.id);
      }
    },
  };
}
