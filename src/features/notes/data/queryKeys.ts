export const notesQueryKeys = {
  all: () => ['notes'] as const,
  byHousehold: (householdId: string) => [...notesQueryKeys.all(), 'household', householdId] as const,
};
