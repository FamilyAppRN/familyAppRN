import { useQuery } from '@tanstack/react-query';

import { getShoppingRepository } from '@features/shopping/data/shoppingFactory';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';

export function useShopping() {
  const household = useCurrentHousehold();
  const householdId = household?.id;

  const query = useQuery({
    queryKey: ['shopping', householdId],
    queryFn: () => getShoppingRepository().listByHousehold(householdId as string),
    enabled: !!householdId,
  });

  return {
    householdName: household?.name,
    lists: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
