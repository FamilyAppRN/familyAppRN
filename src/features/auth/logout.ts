import { getAuthRepository } from '@features/auth/data/authFactory';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { disconnectRealtime } from '@core/realtime/socket';
import { getPushToken } from '@core/push/push';
import { Logger } from '@core/logger/Logger';

/**
 * Cierra sesión: borra la sesión persistida (tokens en SecureStore + perfil
 * en AsyncStorage) y limpia el estado en memoria. Navegar es responsabilidad
 * de quien lo llama.
 */
export async function logout(): Promise<void> {
  disconnectRealtime();
  // Antes de borrar la sesión (hace falta el token de acceso): que este
  // dispositivo deje de recibir avisos de esta cuenta.
  try {
    const pushToken = await getPushToken();
    if (pushToken) await getAuthRepository().unregisterPushToken(pushToken);
  } catch (error) {
    Logger.error('No se pudo quitar el token de notificaciones', error);
  }
  await getAuthRepository().logout();
  useAuthStore.getState().clearUser();
}
