import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';

import { getTasksRepository } from '@features/tasks/data/tasksFactory';
import { tasksQueryKeys } from '@features/tasks/data/queryKeys';
import type { Task } from '@features/tasks/data/schemas/tasksSchema';
import { dueDateOf } from '@features/tasks/domain/taskGroups';
import { taskFormSchema, type TaskFormData } from '@features/tasks/presentation/taskFormSchema';
import { dateFromKey, dayKeyFromToday, dayKeyOf, timeOf } from '@features/tasks/domain/dueDate';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useAuthStore } from '@features/auth/store/useAuthStore';

/** ISO de la fecha límite elegida (día + hora opcional); null = sin fecha. */
function dueDateFor(data: TaskFormData): string | null {
  if (!data.dueDay) return null;
  return dateFromKey(data.dueDay, data.dueTime).toISOString();
}

/** Formulario de tarea. Con `taskId` edita esa tarea; sin él, crea una nueva. */
export function useTaskForm(taskId?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const household = useCurrentHousehold();
  const householdId = household?.id as string;
  const userId = useAuthStore((s) => s.user?.id);
  const { members, isPremium } = useHouseholdMembers();
  const queryKey = tasksQueryKeys.byHousehold(householdId);

  const editing = taskId
    ? queryClient.getQueryData<Task[]>(queryKey)?.find((task) => task.id === taskId)
    : undefined;

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: userId ?? null,
      dueDay: dayKeyFromToday(0),
      dueTime: null,
      points: 0,
    },
    mode: 'onChange',
  });

  // Rellena el formulario una vez con la tarea a editar.
  useEffect(() => {
    if (editing) {
      const due = dueDateOf(editing);
      form.reset({
        title: editing.title,
        description: editing.description ?? '',
        assigneeId: editing.assignee_id ?? null,
        dueDay: due ? dayKeyOf(due) : null,
        dueTime: due ? timeOf(due) : null,
        points: editing.points ?? 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.id]);

  const mutation = useMutation({
    mutationFn: (data: TaskFormData) => {
      const dueDate = dueDateFor(data);
      const originalDue = editing ? (dueDateOf(editing)?.toISOString() ?? null) : null;
      const description = data.description.trim();
      if (taskId) {
        return getTasksRepository().update(taskId, {
          title: data.title.trim(),
          description: description || null,
          assignee_id: data.assigneeId,
          // Sin Premium no se tocan: el backend rechazaría puntos > 0.
          ...(isPremium ? { points: data.points } : {}),
          // Solo si cambió: el backend reinicia el recordatorio al recibir una fecha.
          ...(dueDate !== originalDue ? { due_date: dueDate } : {}),
        });
      }
      return getTasksRepository().create({
        household_id: householdId,
        title: data.title.trim(),
        ...(description ? { description } : {}),
        ...(data.assigneeId ? { assignee_id: data.assigneeId } : {}),
        ...(dueDate ? { due_date: dueDate } : {}),
        ...(isPremium && data.points > 0 ? { points: data.points } : {}),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      router.back();
    },
  });

  return {
    isEditing: !!taskId,
    members,
    userId,
    isPremium,
    openPremium: () => router.push('/(modals)/premium' as Href),
    control: form.control,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    isPending: mutation.isPending,
    isValid: form.formState.isValid,
    hasError: mutation.isError,
    goBack: () => router.back(),
  };
}
