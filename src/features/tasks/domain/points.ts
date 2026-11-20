import type { Task } from '@features/tasks/data/schemas/tasksSchema';

export type PointsPeriod = 'week' | 'total';

/** Lunes 00:00 de la semana de `now`, en la hora local del teléfono. */
export function startOfWeek(now = new Date()): Date {
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
}

const completedAt = (task: Task) => (task.completed_at ? new Date(task.completed_at) : null);

/**
 * Tareas que dieron puntos en el período (aprobadas), las más recientes
 * primero. Solo las que tienen fecha de completada: las viejas sin ella no
 * se pueden ubicar en una semana.
 */
export function earnedTasks(tasks: Task[], since?: Date): Task[] {
  return tasks
    .filter((task) => task.status === 'completed' && (task.points ?? 0) > 0 && completedAt(task))
    .filter((task) => !since || completedAt(task)!.getTime() >= since.getTime())
    .sort((a, b) => completedAt(b)!.getTime() - completedAt(a)!.getTime());
}

/** Tareas con puntos que un niño marcó y esperan a un admin. */
export const waitingTasks = (tasks: Task[]) => tasks.filter((task) => task.status === 'waiting_verification');

export interface RankedKid<M> {
  member: M;
  points: number;
  position: number;
}

/**
 * Tabla de los niños: de más a menos puntos; empates por nombre y con la
 * misma posición. Los adultos suman puntos pero no se listan aquí.
 */
export function rankKids<M extends { id: string; name: string; role: string }>(
  members: M[],
  pointsByUser: Record<string, number>,
): RankedKid<M>[] {
  const sorted = members
    .filter((member) => member.role === 'kid')
    .map((member) => ({ member, points: pointsByUser[member.id] ?? 0 }))
    .sort((a, b) => b.points - a.points || a.member.name.localeCompare(b.member.name));

  let lastPoints = Number.NaN;
  let lastPosition = 0;
  return sorted.map((entry, index) => {
    const position = entry.points === lastPoints ? lastPosition : index + 1;
    lastPoints = entry.points;
    lastPosition = position;
    return { ...entry, position };
  });
}
