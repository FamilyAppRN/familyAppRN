import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getTasksRepository } from '@features/tasks/data/tasksFactory';
import { tasksQueryKeys } from '@features/tasks/data/queryKeys';
import type { Task } from '@features/tasks/data/schemas/tasksSchema';
import { dueDateOf } from '@features/tasks/domain/taskGroups';
import { taskFormSchema, type TaskFormData, type TaskWhen } from '@features/tasks/presentation/taskFormSchema';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useAuthStore } from '@features/auth/store/useAuthStore';

function dayOffset(days: number): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date;
}

function whenOf(task: Task): TaskWhen {
  const due = dueDateOf(task);
  if (!due) return 'none';
  const day = new Date(due);
  day.setHours(0, 0, 0, 0);
  if (day.getTime() === dayOffset(0).getTime()) return 'today';
  if (day.getTime() === dayOffset(1).getTime()) return 'tomorrow';
  return 'keep';
}

/** ISO de la fecha elegida; undefined = no tocar la fecha al editar. */
function dueDateFor(when: TaskWhen): string | null | undefined {
  if (when === 'today') return dayOffset(0).toISOString();
  if (when === 'tomorrow') return dayOffset(1).toISOString();
  if (when === 'none') return null;
  return undefined;
}

/** Formulario de tarea. Con `taskId` edita esa tarea; sin él, crea una nueva. */
export function useTaskForm(taskId?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const household = useCurrentHousehold();
  const householdId = household?.id as string;
  const userId = useAuthStore((s) => s.user?.id);
  const { members } = useHouseholdMembers();
  const queryKey = tasksQueryKeys.byHousehold(householdId);

  const editing = taskId
    ? queryClient.getQueryData<Task[]>(queryKey)?.find((task) => task.id === taskId)
    : undefined;

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: { title: '', description: '', assigneeId: userId ?? null, when: 'today' },
    mode: 'onChange',
  });

  // Rellena el formulario una vez con la tarea a editar.
  useEffect(() => {
    if (editing) {
      form.reset({
        title: editing.title,
        description: editing.description ?? '',
        assigneeId: editing.assignee_id ?? null,
        when: whenOf(editing),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing?.id]);

  const mutation = useMutation({
    mutationFn: (data: TaskFormData) => {
      const dueDate = dueDateFor(data.when);
      const description = data.description.trim();
      if (taskId) {
        return getTasksRepository().update(taskId, {
          title: data.title.trim(),
          description: description || null,
          assignee_id: data.assigneeId,
          ...(dueDate !== undefined ? { due_date: dueDate } : {}),
        });
      }
      return getTasksRepository().create({
        household_id: householdId,
        title: data.title.trim(),
        ...(description ? { description } : {}),
        ...(data.assigneeId ? { assignee_id: data.assigneeId } : {}),
        ...(dueDate ? { due_date: dueDate } : {}),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      router.back();
    },
  });

  return {
    isEditing: !!taskId,
    keepDate: editing ? dueDateOf(editing) : null,
    members,
    userId,
    control: form.control,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    isPending: mutation.isPending,
    isValid: form.formState.isValid,
    hasError: mutation.isError,
    goBack: () => router.back(),
  };
}
