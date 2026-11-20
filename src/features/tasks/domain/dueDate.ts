/** "2026-11-12" de una fecha, en la hora local del teléfono. */
export function dayKeyOf(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** "2026-11-12" (+ minutos del día, opcional) → fecha local. */
export function dateFromKey(key: string, minutes: number | null = null): Date {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  if (minutes !== null) date.setMinutes(minutes);
  return date;
}

/** Clave del día de hoy + `days`. */
export function dayKeyFromToday(days: number, now = new Date()): string {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return dayKeyOf(date);
}

/** Minutos desde medianoche; null si es justo medianoche (tarea sin hora). */
export function timeOf(date: Date): number | null {
  const minutes = date.getHours() * 60 + date.getMinutes();
  return minutes === 0 ? null : minutes;
}
