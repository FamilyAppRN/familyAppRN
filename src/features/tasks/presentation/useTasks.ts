import { useQuery } from '@tanstack/react-query';

import { getTasksRepository } from '@features/tasks/data/tasksFactory';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';

export function useTasks() {
  const household = useCurrentHousehold();
  const householdId = household?.id;

  const query = useQuery({
    queryKey: ['tasks', householdId],
    queryFn: () => getTasksRepository().listByHousehold(householdId as string),
    enabled: !!householdId,
  });

  return {
    householdName: household?.name,
    tasks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
