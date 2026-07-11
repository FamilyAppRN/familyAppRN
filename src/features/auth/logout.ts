import { getAuthRepository } from '@features/auth/data/authFactory';
import { useAuthStore } from '@features/auth/store/useAuthStore';

/**
 * Cierra sesión: borra la sesión persistida (tokens en SecureStore + perfil
 * en AsyncStorage) y limpia el estado en memoria. Navegar es responsabilidad
 * de quien lo llama.
 */
export async function logout(): Promise<void> {
  await getAuthRepository().logout();
  useAuthStore.getState().clearUser();
}
