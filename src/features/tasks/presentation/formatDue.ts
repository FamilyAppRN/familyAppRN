import type { TFunction } from 'i18next';

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const hasTime = (date: Date) => date.getHours() !== 0 || date.getMinutes() !== 0;

/** "Hoy, 20:00", "Mañana", "mar 10 nov" o "Venció lun 9 nov". */
export function formatDue(due: Date, t: TFunction, locale: string, now = new Date()): string {
  const time = due.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const date = due.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' });
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  if (sameDay(due, now)) return hasTime(due) ? t('tasks.due.todayAt', { time }) : t('tasks.due.today');
  if (due < now) return t('tasks.due.overdue', { date });
  if (sameDay(due, tomorrow)) return hasTime(due) ? `${t('tasks.due.tomorrow')}, ${time}` : t('tasks.due.tomorrow');
  return hasTime(due) ? `${date}, ${time}` : date;
}
