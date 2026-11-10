import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';

import { getTasksRepository } from '@features/tasks/data/tasksFactory';
import { tasksQueryKeys } from '@features/tasks/data/queryKeys';
import type { Task } from '@features/tasks/data/schemas/tasksSchema';
import { dueDateOf } from '@features/tasks/domain/taskGroups';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Lunes de la semana de `date`. */
function startOfWeek(date: Date): Date {
  const day = startOfDay(date);
  const offset = (day.getDay() + 6) % 7; // lunes = 0
  day.setDate(day.getDate() - offset);
  return day;
}

const dayKey = (date: Date) => startOfDay(date).getTime();

export interface AgendaEntry {
  task: Task;
  due: Date;
  /** false = la fecha no tiene hora (va como "todo el día"). */
  hasTime: boolean;
}

/**
 * Semana con navegación y la agenda del día elegido. Por ahora la agenda son
 * las tareas con fecha del hogar; los eventos propios llegan con la Fase B.
 */
export function useCalendar() {
  const router = useRouter();
  const householdId = useCurrentHousehold()?.id as string;
  const [selected, setSelected] = useState(() => startOfDay(new Date()));
  const weekStart = startOfWeek(selected);

  const query = useQuery({
    queryKey: tasksQueryKeys.byHousehold(householdId),
    queryFn: () => getTasksRepository().listByHousehold(householdId),
    enabled: !!householdId,
  });

  const byDay = useMemo(() => {
    const map = new Map<number, AgendaEntry[]>();
    for (const task of query.data ?? []) {
      const due = dueDateOf(task);
      if (!due) continue;
      const entry = { task, due, hasTime: due.getHours() !== 0 || due.getMinutes() !== 0 };
      const key = dayKey(due);
      map.set(key, [...(map.get(key) ?? []), entry]);
    }
    for (const entries of map.values()) entries.sort((a, b) => a.due.getTime() - b.due.getTime());
    return map;
  }, [query.data]);

  const todayKey = dayKey(new Date());
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart.getTime() + index * DAY_MS);
    const key = dayKey(date);
    return {
      date,
      isToday: key === todayKey,
      isSelected: key === dayKey(selected),
      count: byDay.get(key)?.length ?? 0,
    };
  });

  const moveWeek = (weeks: number) => setSelected(new Date(selected.getTime() + weeks * 7 * DAY_MS));

  return {
    selected,
    isTodaySelected: dayKey(selected) === todayKey,
    week,
    agenda: byDay.get(dayKey(selected)) ?? [],
    isLoading: query.isLoading,
    select: (date: Date) => setSelected(startOfDay(date)),
    previousWeek: () => moveWeek(-1),
    nextWeek: () => moveWeek(1),
    goToToday: () => setSelected(startOfDay(new Date())),
    openTask: (task: Task) => router.push(`/(modals)/task/${task.id}` as Href),
  };
}
