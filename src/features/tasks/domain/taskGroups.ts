import type { Task } from '@features/tasks/data/schemas/tasksSchema';

export type TaskFilter = 'mine' | 'all' | 'done';
export type TaskGroupKey = 'overdue' | 'today' | 'upcoming' | 'noDate' | 'done';

export interface TaskGroup {
  key: TaskGroupKey;
  tasks: Task[];
}

export const isDone = (task: Task) => task.status === 'completed';

/** Fecha límite como Date, o null si no tiene o no se puede leer. */
export function dueDateOf(task: Task): Date | null {
  if (!task.due_date) return null;
  const date = new Date(task.due_date);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Filtra por la pestaña elegida. "Mías" son las asignadas a mí que siguen pendientes. */
export function filterTasks(tasks: Task[], filter: TaskFilter, userId?: string): Task[] {
  if (filter === 'done') return tasks.filter(isDone);
  const pending = tasks.filter((task) => !isDone(task));
  return filter === 'mine' ? pending.filter((task) => task.assignee_id === userId) : pending;
}

/**
 * Agrupa por fecha límite: atrasadas, hoy, próximas y sin fecha. Las hechas
 * van en un solo grupo, las más recientes primero.
 */
export function groupTasks(tasks: Task[], filter: TaskFilter, now = new Date()): TaskGroup[] {
  if (filter === 'done') {
    const done = [...tasks].sort(
      (a, b) => new Date(b.updated_at ?? 0).getTime() - new Date(a.updated_at ?? 0).getTime(),
    );
    return done.length ? [{ key: 'done', tasks: done }] : [];
  }

  const today = startOfDay(now).getTime();
  const tomorrow = today + 24 * 60 * 60 * 1000;
  const buckets: Record<Exclude<TaskGroupKey, 'done'>, Task[]> = {
    overdue: [],
    today: [],
    upcoming: [],
    noDate: [],
  };

  for (const task of tasks) {
    const due = dueDateOf(task);
    if (!due) buckets.noDate.push(task);
    else if (due.getTime() < today) buckets.overdue.push(task);
    else if (due.getTime() < tomorrow) buckets.today.push(task);
    else buckets.upcoming.push(task);
  }

  const byDue = (a: Task, b: Task) => (dueDateOf(a)?.getTime() ?? 0) - (dueDateOf(b)?.getTime() ?? 0);
  return (['overdue', 'today', 'upcoming', 'noDate'] as const)
    .map((key) => ({ key, tasks: buckets[key].sort(byDue) }))
    .filter((group) => group.tasks.length > 0);
}
