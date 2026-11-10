import type { SessionHousehold } from '@features/auth/store/useAuthStore';

/**
 * Límites por plan, iguales a reglas-para-unirse-familias.md. El backend
 * todavía no los aplica (Fase B); la app los usa para orientar al usuario.
 */
export const PLAN_LIMITS = {
  free: { ownedHouseholds: 1, totalHouseholds: 2, membersPerHousehold: 4 },
  premium: { ownedHouseholds: 10, totalHouseholds: Infinity, membersPerHousehold: 15 },
} as const;

export type Plan = keyof typeof PLAN_LIMITS;

export const planOf = (plan?: string): Plan => (plan === 'premium' ? 'premium' : 'free');

export function canCreateHousehold(plan: Plan, households: SessionHousehold[]): boolean {
  const owned = households.filter((h) => h.is_owner).length;
  return owned < PLAN_LIMITS[plan].ownedHouseholds;
}

export function canJoinHousehold(plan: Plan, households: SessionHousehold[]): boolean {
  return households.length < PLAN_LIMITS[plan].totalHouseholds;
}
