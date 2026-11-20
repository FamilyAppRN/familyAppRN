export const calendarQueryKeys = {
  all: () => ['calendar'] as const,
  byHousehold: (householdId: string) => [...calendarQueryKeys.all(), 'household', householdId] as const,
  range: (householdId: string, from: string, to: string) =>
    [...calendarQueryKeys.byHousehold(householdId), from, to] as const,
};
