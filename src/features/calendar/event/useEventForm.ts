import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getCalendarRepository } from '@features/calendar/data/calendarFactory';
import { calendarQueryKeys } from '@features/calendar/data/queryKeys';
import type { CalendarOccurrence, RecurrenceFreq } from '@features/calendar/data/schemas/calendarSchema';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useAuthStore } from '@features/auth/store/useAuthStore';

export const NEW_EVENT_ID = 'new';
export const DURATIONS = [30, 60, 120, 180] as const;
export type Repeat = 'none' | RecurrenceFreq;
export const REPEATS: Repeat[] = ['none', 'daily', 'weekly', 'monthly'];

const STEP_MINUTES = 15;
const DAY_MINUTES = 24 * 60;

/** "2026-11-12" → fecha local a medianoche (o hoy si no se puede leer). */
function parseDay(value?: string): Date {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Crear o editar un evento. Editar un evento repetido cambia toda la serie.
 * Borrarlo, igual que en el backend: quien lo creó o un admin.
 */
export function useEventForm(eventId: string, dayParam?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const householdId = useCurrentHousehold()?.id as string;
  const userId = useAuthStore((s) => s.user?.id);
  const { members } = useHouseholdMembers();
  const isNew = eventId === NEW_EVENT_ID;

  // No hay GET de un evento: se toma de los rangos ya cargados en el calendario.
  const existing = isNew
    ? undefined
    : queryClient
        .getQueriesData<CalendarOccurrence[]>({ queryKey: calendarQueryKeys.byHousehold(householdId) })
        .flatMap(([, data]) => data ?? [])
        .find((occurrence) => occurrence.id === eventId);

  // Editando: el día en que empieza la serie. Nuevo: el día elegido en el calendario.
  const [day, setDay] = useState(() => {
    if (!existing) return parseDay(dayParam);
    const start = new Date(existing.start_at);
    start.setHours(0, 0, 0, 0);
    return start;
  });
  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [allDay, setAllDay] = useState(existing?.all_day ?? false);
  const [startMinutes, setStartMinutes] = useState(() => {
    if (!existing) return 9 * 60;
    const start = new Date(existing.start_at);
    return start.getHours() * 60 + start.getMinutes();
  });
  const [duration, setDuration] = useState<number>(() => {
    if (!existing?.end_at) return 60;
    return Math.round((new Date(existing.end_at).getTime() - new Date(existing.start_at).getTime()) / 60000) || 60;
  });
  const [repeat, setRepeat] = useState<Repeat>(existing?.recurrence?.freq ?? 'none');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isAdmin = members.find((m) => m.id === userId)?.role === 'admin';
  const canEdit = isNew || (!!existing && (existing.created_by === userId || isAdmin));

  const invalidate = () => queryClient.invalidateQueries({ queryKey: calendarQueryKeys.byHousehold(householdId) });

  const saveMutation = useMutation({
    mutationFn: () => {
      const start = new Date(day);
      if (!allDay) start.setMinutes(startMinutes);
      const body = {
        title: title.trim(),
        description: description.trim() || null,
        start_at: start.toISOString(),
        end_at: allDay ? null : new Date(start.getTime() + duration * 60000).toISOString(),
        all_day: allDay,
        recurrence: repeat === 'none' ? null : { freq: repeat, until: null },
      };
      return isNew ? getCalendarRepository().create(householdId, body) : getCalendarRepository().update(eventId, body);
    },
    onSuccess: () => {
      void invalidate();
      router.back();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => getCalendarRepository().remove(eventId),
    onSuccess: () => {
      void invalidate();
      router.back();
    },
  });

  const shiftStart = (steps: number) =>
    setStartMinutes((current) => (current + steps * STEP_MINUTES + DAY_MINUTES) % DAY_MINUTES);

  const minutesOf = (date: Date) => date.getHours() * 60 + date.getMinutes();
  const at = (minutes: number) => new Date(new Date(day).setMinutes(minutes));
  const endMinutes = (startMinutes + duration) % DAY_MINUTES;

  return {
    isNew,
    notFound: !isNew && !existing,
    canEdit,
    day,
    /** Cambia el día del evento (o el de inicio de la serie). */
    setDay: (picked: Date) => {
      const next = new Date(picked);
      next.setHours(0, 0, 0, 0);
      setDay(next);
    },
    title,
    setTitle,
    description,
    setDescription,
    allDay,
    setAllDay,
    startLabel: at(startMinutes),
    /** Hora elegida en el selector; la duración se mantiene. */
    setStart: (picked: Date) => setStartMinutes(minutesOf(picked)),
    endLabel: at(endMinutes),
    /** Si la hora de fin es anterior a la de inicio, el evento termina al día siguiente. */
    endsNextDay: startMinutes + duration >= DAY_MINUTES,
    setEnd: (picked: Date) => setDuration((minutesOf(picked) - startMinutes + DAY_MINUTES) % DAY_MINUTES || DAY_MINUTES),
    earlier: () => shiftStart(-1),
    later: () => shiftStart(1),
    duration,
    setDuration,
    repeat,
    setRepeat,
    canSave: canEdit && title.trim().length > 0 && !saveMutation.isPending,
    save: () => saveMutation.mutate(),
    isSaving: saveMutation.isPending,
    saveError: saveMutation.isError,
    confirmingDelete,
    askDelete: () => setConfirmingDelete(true),
    cancelDelete: () => setConfirmingDelete(false),
    confirmDelete: () => deleteMutation.mutate(),
    isDeleting: deleteMutation.isPending,
    goBack: () => router.back(),
  };
}
