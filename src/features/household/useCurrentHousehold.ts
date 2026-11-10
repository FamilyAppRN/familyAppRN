import { selectActiveHousehold, useAuthStore, type SessionHousehold } from '@features/auth/store/useAuthStore';

export type CurrentHousehold = SessionHousehold;

/**
 * Hogar activo: el elegido en el selector o, si no hay, el primero. Todas las
 * pestañas piden sus datos con este id, así que cambiarlo recarga la app.
 */
export function useCurrentHousehold(): CurrentHousehold | undefined {
  return useAuthStore(selectActiveHousehold);
}
