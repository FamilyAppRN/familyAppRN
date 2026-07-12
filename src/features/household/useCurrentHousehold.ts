import { useAuthStore } from '@features/auth/store/useAuthStore';

export interface CurrentHousehold {
  id: string;
  name: string;
}

/** Hogar activo del usuario (el primero). Las pantallas del home lo usan para
 * su cabecera y para pedir datos al backend por householdId. */
export function useCurrentHousehold(): CurrentHousehold | undefined {
  return useAuthStore((s) => s.households[0]) as CurrentHousehold | undefined;
}
