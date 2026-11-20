import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';

import { useAuthStore } from '@features/auth/store/useAuthStore';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { getTasksRepository } from '@features/tasks/data/tasksFactory';
import { tasksQueryKeys } from '@features/tasks/data/queryKeys';
import type { Task } from '@features/tasks/data/schemas/tasksSchema';
import {
  earnedTasks,
  rankKids,
  startOfWeek,
  waitingTasks,
  type PointsPeriod,
} from '@features/tasks/domain/points';

/**
 * Puntos de la familia. La tabla lista solo a los Niños; los adultos suman
 * puntos (se ven en su propia tarjeta) pero no compiten en la tabla.
 * "Esta semana" va del lunes 00:00 (hora del teléfono) a hoy.
 */
export function usePoints() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const household = useCurrentHousehold();
  const householdId = household?.id as string;
  const userId = useAuthStore((s) => s.user?.id);
  const { members, isPremium, isLoading: membersLoading } = useHouseholdMembers();
  const [period, setPeriod] = useState<PointsPeriod>('week');

  // Fijo mientras la pantalla está abierta: si no, la clave cambiaría en cada render.
  const [weekStart] = useState(() => startOfWeek());
  const since = period === 'week' ? weekStart : undefined;

  const pointsQuery = useQuery({
    queryKey: tasksQueryKeys.points(householdId, since ? since.toISOString() : 'total'),
    queryFn: () => getTasksRepository().pointsSummary(householdId, since),
    enabled: !!householdId && isPremium,
  });

  const tasksQuery = useQuery({
    queryKey: tasksQueryKeys.byHousehold(householdId),
    queryFn: () => getTasksRepository().listByHousehold(householdId),
    enabled: !!householdId,
  });

  const verifyMutation = useMutation({
    mutationFn: (task: Task) => getTasksRepository().verify(task.id, true),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: tasksQueryKeys.byHousehold(householdId) });
    },
  });

  const me = members.find((m) => m.id === userId) ?? null;
  const isAdmin = me?.role === 'admin';
  const isKid = me?.role === 'kid';
  const pointsByUser = useMemo(() => pointsQuery.data ?? {}, [pointsQuery.data]);
  const ranking = useMemo(() => rankKids(members, pointsByUser), [members, pointsByUser]);
  const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);

  // Un niño ve lo que ganó él; un adulto, lo que ganaron los niños.
  const kidIds = new Set(ranking.map((entry) => entry.member.id));
  const earned = earnedTasks(tasks, since)
    .filter((task) => (isKid ? task.assignee_id === userId : !!task.assignee_id && kidIds.has(task.assignee_id)))
    .slice(0, 10);

  return {
    householdName: household?.name ?? '',
    isPremium,
    isLoading: membersLoading || (isPremium && pointsQuery.isLoading),
    isError: pointsQuery.isError,
    isRefreshing: pointsQuery.isRefetching,
    refresh: () => {
      void pointsQuery.refetch();
      void tasksQuery.refetch();
    },

    period,
    setPeriod,

    me,
    isKid,
    myPoints: userId ? (pointsByUser[userId] ?? 0) : 0,
    ranking,
    /** Para las barras: el primero llena la barra entera. */
    topPoints: ranking[0]?.points ?? 0,
    earned,
    memberById: (id?: string | null) => members.find((m) => m.id === id) ?? null,

    /** Solo admins: lo que espera su aprobación. */
    pending: isAdmin ? waitingTasks(tasks) : [],
    verify: (task: Task) => verifyMutation.mutate(task),
    verifyingId: verifyMutation.isPending ? verifyMutation.variables?.id : undefined,

    goBack: () => (router.canGoBack() ? router.back() : router.replace('/(main)/tasks' as Href)),
    openTask: (task: Task) => router.push(`/(modals)/task/${task.id}` as Href),
    openPremium: () => router.push('/(modals)/premium' as Href),
  };
}
