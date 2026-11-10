export const tasksQueryKeys = {
  all: () => ['tasks'] as const,
  byHousehold: (householdId: string) => [...tasksQueryKeys.all(), 'household', householdId] as const,
};
