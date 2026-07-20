export const shoppingQueryKeys = {
  all: () => ['shopping'] as const,
  byHousehold: (householdId: string) =>
    [...shoppingQueryKeys.all(), 'household', householdId] as const,
};
