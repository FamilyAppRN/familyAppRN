import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';

import { getTasksRepository } from '@features/tasks/data/tasksFactory';
import { tasksQueryKeys } from '@features/tasks/data/queryKeys';
import type { Task } from '@features/tasks/data/schemas/tasksSchema';
import { dueDateOf } from '@features/tasks/domain/taskGroups';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { householdQueryKeys } from '@features/household/data/queryKeys';
import { planLimitCode } from '@features/household/domain/planErrors';
import { getCalendarRepository } from '@features/calendar/data/calendarFactory';
import { calendarQueryKeys } from '@features/calendar/data/queryKeys';
import type { CalendarOccurrence } from '@features/calendar/data/schemas/calendarSchema';

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Lunes de la semana de `date`. */
function startOfWeek(date: Date): Date {
  const day = startOfDay(date);
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7)); // lunes = 0
  return day;
}

const dayKey = (date: Date) => startOfDay(date).getTime();
const hasTime = (date: Date) => date.getHours() !== 0 || date.getMinutes() !== 0;

/** Lo que muestra la agenda de un día: eventos y tareas con fecha, juntos. */
export type AgendaEntry =
  | { kind: 'event'; key: string; occurrence: CalendarOccurrence; start: Date; end: Date | null; allDay: boolean }
  | { kind: 'task'; key: string; task: Task; start: Date; allDay: boolean };

/** "Todo el día" primero; después por hora. */
const byTime = (a: AgendaEntry, b: AgendaEntry) =>
  Number(b.allDay) - Number(a.allDay) || a.start.getTime() - b.start.getTime();

/**
 * Semana con navegación y la agenda del día elegido. Los eventos son Premium
 * del hogar; sin Premium la agenda muestra solo las tareas con fecha.
 */
export function useCalendar() {
  const router = useRouter();
  const householdId = useCurrentHousehold()?.id as string;
  const queryClient = useQueryClient();
  const { isPremium: householdIsPremium } = useHouseholdMembers();
  const [selected, setSelected] = useState(() => startOfDay(new Date()));
  const weekStart = startOfWeek(selected);
  const weekEnd = new Date(weekStart.getTime() + 7 * DAY_MS);

  const tasksQuery = useQuery({
    queryKey: tasksQueryKeys.byHousehold(householdId),
    queryFn: () => getTasksRepository().listByHousehold(householdId),
    enabled: !!householdId,
  });

  const eventsQuery = useQuery({
    queryKey: calendarQueryKeys.range(householdId, weekStart.toISOString(), weekEnd.toISOString()),
    queryFn: () => getCalendarRepository().list(householdId, weekStart, weekEnd),
    enabled: !!householdId && householdIsPremium,
  });

  // Si el plan bajó a gratis con la app abierta, el dato del hogar quedó viejo:
  // el backend responde PLAN_REQUIRED y la pantalla pasa a la versión gratis.
  const lostPremium = planLimitCode(eventsQuery.error) === 'PLAN_REQUIRED';
  const isPremium = householdIsPremium && !lostPremium;
  useEffect(() => {
    if (lostPremium) void queryClient.invalidateQueries({ queryKey: householdQueryKeys.details(householdId) });
  }, [lostPremium, queryClient, householdId]);

  const byDay = useMemo(() => {
    const map = new Map<number, AgendaEntry[]>();
    const add = (date: Date, entry: AgendaEntry) => {
      const key = dayKey(date);
      map.set(key, [...(map.get(key) ?? []), entry]);
    };

    for (const task of tasksQuery.data ?? []) {
      const due = dueDateOf(task);
      if (due) add(due, { kind: 'task', key: `task-${task.id}`, task, start: due, allDay: !hasTime(due) });
    }
    for (const occurrence of isPremium ? (eventsQuery.data ?? []) : []) {
      const start = new Date(occurrence.occurrence_start);
      const end = occurrence.occurrence_end ? new Date(occurrence.occurrence_end) : null;
      add(start, {
        kind: 'event',
        key: `event-${occurrence.id}-${occurrence.occurrence_start}`,
        occurrence,
        start,
        end,
        allDay: occurrence.all_day,
      });
    }
    for (const entries of map.values()) entries.sort(byTime);
    return map;
  }, [tasksQuery.data, eventsQuery.data, isPremium]);

  const todayKey = dayKey(new Date());
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart.getTime() + index * DAY_MS);
    const key = dayKey(date);
    return { date, isToday: key === todayKey, isSelected: key === dayKey(selected), count: byDay.get(key)?.length ?? 0 };
  });

  const moveWeek = (weeks: number) => setSelected(new Date(selected.getTime() + weeks * 7 * DAY_MS));
  const selectedDate = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;

  return {
    selected,
    isTodaySelected: dayKey(selected) === todayKey,
    week,
    agenda: byDay.get(dayKey(selected)) ?? [],
    isLoading: tasksQuery.isLoading || (isPremium && eventsQuery.isLoading),
    isPremium,
    select: (date: Date) => setSelected(startOfDay(date)),
    previousWeek: () => moveWeek(-1),
    nextWeek: () => moveWeek(1),
    goToToday: () => setSelected(startOfDay(new Date())),
    openTask: (task: Task) => router.push(`/(modals)/task/${task.id}` as Href),
    openEvent: (occurrence: CalendarOccurrence) => router.push(`/(modals)/event/${occurrence.id}` as Href),
    newEvent: () => router.push(`/(modals)/event/new?date=${selectedDate}` as Href),
    openPremium: () => router.push('/(modals)/premium' as Href),
  };
}
