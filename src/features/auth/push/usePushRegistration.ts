import { useEffect } from 'react';
import * as Device from 'expo-device';

import { getPushToken, onPushTokenRefresh, requestPushPermission } from '@core/push/push';
import { Logger } from '@core/logger/Logger';
import { getAuthRepository } from '@features/auth/data/authFactory';

/**
 * Al entrar a las pestañas: pide permiso para avisos y registra el token de
 * este dispositivo en el backend. Si FCM cambia el token, lo vuelve a
 * registrar. Sin permiso no se registra nada y la app sigue funcionando.
 */
export function usePushRegistration() {
  useEffect(() => {
    let cancelled = false;

    const register = async (token: string) => {
      try {
        await getAuthRepository().registerPushToken(token, Device.modelName ?? undefined);
      } catch (error) {
        Logger.error('No se pudo registrar el token de notificaciones', error);
      }
    };

    void (async () => {
      if (!(await requestPushPermission()) || cancelled) return;
      const token = await getPushToken();
      if (token && !cancelled) await register(token);
    })();

    const unsubscribe = onPushTokenRefresh((token) => void register(token));
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);
}
