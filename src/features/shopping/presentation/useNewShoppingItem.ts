import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getShoppingRepository } from '@features/shopping/data/shoppingFactory';
import { shoppingQueryKeys } from '@features/shopping/data/queryKeys';
import {
  newItemFormSchema,
  type NewItemFormData,
} from '@features/shopping/presentation/newItemFormSchema';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';

/**
 * Agregar productos. La pantalla queda abierta tras cada alta para armar la
 * lista de corrido: se limpia el nombre y la cantidad, y se conservan la
 * categoría y la unidad elegidas.
 */
export function useNewShoppingItem() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const household = useCurrentHousehold();
  const householdId = household?.id;
  const [added, setAdded] = useState<string[]>([]);

  const form = useForm<NewItemFormData>({
    resolver: zodResolver(newItemFormSchema),
    defaultValues: { name: '', quantity: 1, unit: 'unit', category: 'other', isUrgent: false },
    mode: 'onChange', // valida en vivo: habilita/deshabilita el botón
  });

  const mutation = useMutation({
    mutationFn: (data: NewItemFormData) =>
      getShoppingRepository().addItemToDefaultList(householdId as string, {
        name: data.name.trim(),
        quantity: data.quantity,
        // 'unit' = piezas: se manda null para no guardar una unidad falsa.
        unit: data.unit === 'unit' ? null : data.unit,
        category: data.category,
        is_urgent: data.isUrgent,
      }),
    onSuccess: (_list, data) => {
      void queryClient.invalidateQueries({
        queryKey: shoppingQueryKeys.byHousehold(householdId as string),
      });
      setAdded((prev) => [data.name.trim(), ...prev]);
      form.reset({ ...data, name: '', quantity: 1, isUrgent: false });
    },
  });

  return {
    control: form.control,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    isPending: mutation.isPending,
    isValid: form.formState.isValid,
    hasError: mutation.isError,
    added,
    goBack: () => router.back(),
  };
}
