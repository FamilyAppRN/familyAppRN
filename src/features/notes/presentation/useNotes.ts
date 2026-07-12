import { useQuery } from '@tanstack/react-query';

import { getNotesRepository } from '@features/notes/data/notesFactory';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';

export function useNotes() {
  const household = useCurrentHousehold();
  const householdId = household?.id;

  const query = useQuery({
    queryKey: ['notes', householdId],
    queryFn: () => getNotesRepository().listByHousehold(householdId as string),
    enabled: !!householdId,
  });

  return {
    householdName: household?.name,
    notes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
