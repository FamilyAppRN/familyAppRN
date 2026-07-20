import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { palette } from '@shared/theme/tokens';
import { getHouseholdRepository } from '@features/household/data/householdFactory';
import { householdQueryKeys } from '@features/household/data/queryKeys';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';

/** Colores de avatar por miembro (verde/coral de marca, alternados). */
const MEMBER_COLORS = [
  palette.brand[500],
  palette.accent[500],
  palette.brand[700],
  palette.accent[600],
] as const;

export interface ResolvedMember {
  id: string;
  name: string;
  initials: string;
  color: string;
}

function toInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase();
}

/**
 * Miembros del hogar actual. El summary de /api/users/me solo trae
 * `members_count`, así que hace falta pedir el hogar completo para tener
 * nombres con los que resolver `added_by` de cada ítem.
 */
export function useHouseholdMembers() {
  const household = useCurrentHousehold();
  const householdId = household?.id;

  const query = useQuery({
    queryKey: householdQueryKeys.details(householdId as string),
    queryFn: () => getHouseholdRepository().getHousehold(householdId as string),
    enabled: !!householdId,
  });

  const members: ResolvedMember[] = (query.data?.members ?? []).map((m, index) => ({
    id: m.user_id,
    name: m.display_name,
    initials: toInitials(m.display_name),
    color: MEMBER_COLORS[index % MEMBER_COLORS.length],
  }));

  /** Resuelve el id de usuario de un ítem al miembro; null si ya no pertenece. */
  const resolveMember = useCallback(
    (userId?: string | null): ResolvedMember | null =>
      (userId && members.find((m) => m.id === userId)) || null,
    // members se re-deriva en cada render; la dependencia real es la data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query.data],
  );

  return { members, resolveMember, isLoading: query.isLoading };
}
