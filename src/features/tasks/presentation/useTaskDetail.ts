import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';

import { getTasksRepository } from '@features/tasks/data/tasksFactory';
import { tasksQueryKeys } from '@features/tasks/data/queryKeys';
import type { Task } from '@features/tasks/data/schemas/tasksSchema';
import { dueDateOf, isDone } from '@features/tasks/domain/taskGroups';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useAuthStore } from '@features/auth/store/useAuthStore';

export function useTaskDetail(taskId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const householdId = useCurrentHousehold()?.id as string;
  const { members, resolveMember } = useHouseholdMembers();
  const userId = useAuthStore((s) => s.user?.id);
  const isAdmin = members.find((m) => m.id === userId)?.role === 'admin';
  const queryKey = tasksQueryKeys.byHousehold(householdId);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Comparte la query de la lista: si se abre directo (deep link) la carga igual.
  const query = useQuery({
    queryKey,
    queryFn: () => getTasksRepository().listByHousehold(householdId),
    enabled: !!householdId,
  });

  const task = query.data?.find((t) => t.id === taskId);

  const statusMutation = useMutation({
    mutationFn: (current: Task) => getTasksRepository().setStatus(current.id, isDone(current) ? 'pending' : 'completed'),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  });

  const verifyMutation = useMutation({
    mutationFn: (approve: boolean) => getTasksRepository().verify(taskId, approve),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => getTasksRepository().remove(taskId),
    onSuccess: () => {
      queryClient.setQueryData<Task[]>(queryKey, (old) => old?.filter((t) => t.id !== taskId));
      router.back();
    },
  });

  return {
    task,
    isLoading: query.isLoading,
    done: task ? isDone(task) : false,
    dueDate: task ? dueDateOf(task) : null,
    assignee: resolveMember(task?.assignee_id),
    creator: resolveMember(task?.creator_id),
    toggleDone: () => task && statusMutation.mutate(task),
    waiting: task?.status === 'waiting_verification',
    points: task?.points ?? 0,
    canVerify: isAdmin && task?.status === 'waiting_verification',
    approve: () => verifyMutation.mutate(true),
    sendBack: () => verifyMutation.mutate(false),
    isVerifying: verifyMutation.isPending,
    verifyError: verifyMutation.isError,
    isTogglingDone: statusMutation.isPending,
    edit: () => router.push(`/(modals)/new-task?id=${taskId}` as Href),
    confirmingDelete,
    askDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    confirmDelete: () => deleteMutation.mutate(),
    isDeleting: deleteMutation.isPending,
    goBack: () => router.back(),
  };
}
