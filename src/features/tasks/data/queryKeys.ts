export const tasksQueryKeys = {
  all: () => ['tasks'] as const,
  byHousehold: (householdId: string) => [...tasksQueryKeys.all(), 'household', householdId] as const,
  /** 'total', o el inicio de la semana en ISO para "esta semana". */
  points: (householdId: string, period: string = 'total') =>
    [...tasksQueryKeys.byHousehold(householdId), 'points', period] as const,
};
