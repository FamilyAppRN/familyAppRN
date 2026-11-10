import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getTasksRepository } from '@features/tasks/data/tasksFactory';
import { tasksQueryKeys } from '@features/tasks/data/queryKeys';
import type { Task } from '@features/tasks/data/schemas/tasksSchema';
import { filterTasks, groupTasks, isDone, type TaskFilter } from '@features/tasks/domain/taskGroups';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useAuthStore } from '@features/auth/store/useAuthStore';

export function useTasks() {
  const household = useCurrentHousehold();
  const householdId = household?.id;
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const queryKey = tasksQueryKeys.byHousehold(householdId as string);
  const [filter, setFilter] = useState<TaskFilter>('mine');

  const query = useQuery({
    queryKey,
    queryFn: () => getTasksRepository().listByHousehold(householdId as string),
    enabled: !!householdId,
  });

  const tasks = useMemo(() => query.data ?? [], [query.data]);

  const counts = useMemo(
    () => ({
      mine: filterTasks(tasks, 'mine', userId).length,
      all: filterTasks(tasks, 'all', userId).length,
      done: filterTasks(tasks, 'done', userId).length,
    }),
    [tasks, userId],
  );

  const groups = useMemo(
    () => groupTasks(filterTasks(tasks, filter, userId), filter),
    [tasks, filter, userId],
  );

  const toggleMutation = useMutation({
    mutationFn: (task: Task) =>
      getTasksRepository().setStatus(task.id, isDone(task) ? 'pending' : 'completed'),
    // Optimista: el check responde al instante y vuelve atrás si el backend falla.
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Task[]>(queryKey);
      queryClient.setQueryData<Task[]>(queryKey, (old) =>
        old?.map((t) =>
          t.id === task.id
            ? { ...t, status: isDone(task) ? 'pending' : 'completed', updated_at: new Date().toISOString() }
            : t,
        ),
      );
      return { previous };
    },
    onError: (_error, _task, context) => {
      if (context?.previous) queryClient.setQueryData(queryKey, context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    householdName: household?.name,
    userId,
    filter,
    setFilter,
    counts,
    groups,

    isEmpty: tasks.length === 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isRefreshing: query.isRefetching,
    refresh: () => query.refetch(),
    toggleDone: (task: Task) => toggleMutation.mutate(task),
  };
}
