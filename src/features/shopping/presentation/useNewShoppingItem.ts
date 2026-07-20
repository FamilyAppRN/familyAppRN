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

export function useNewShoppingItem() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const household = useCurrentHousehold();
  const householdId = household?.id;

  const form = useForm<NewItemFormData>({
    resolver: zodResolver(newItemFormSchema),
    defaultValues: { name: '', quantity: 1, unit: 'unit', category: 'other' },
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
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: shoppingQueryKeys.byHousehold(householdId as string),
      });
      router.back();
    },
  });

  return {
    control: form.control,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    isPending: mutation.isPending,
    isValid: form.formState.isValid,
    errorMessage: mutation.error?.message,
    goBack: () => router.back(),
  };
}
