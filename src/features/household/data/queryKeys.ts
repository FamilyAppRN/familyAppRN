export const householdQueryKeys = {
  all: () => ['household'] as const,
  details: (id: string) => [...householdQueryKeys.all(), 'detail', id] as const,
};
