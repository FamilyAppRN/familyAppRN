import { PermissionsAndroid, Platform } from 'react-native';
import {
  AuthorizationStatus,
  getInitialNotification,
  getMessaging,
  getToken,
  onNotificationOpenedApp,
  onTokenRefresh,
  requestPermission,
} from '@react-native-firebase/messaging';
import { Logger } from '@core/logger/Logger';

/** Datos que el backend manda en cada aviso (ver PushService del backend). */
export type PushData = Record<string, string>;

/**
 * Pide permiso para mostrar avisos. Android 13+ exige POST_NOTIFICATIONS en
 * tiempo de ejecución; en versiones anteriores ya está concedido.
 */
export async function requestPushPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version < 33) return true;
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    const status = await requestPermission(getMessaging());
    return status === AuthorizationStatus.AUTHORIZED || status === AuthorizationStatus.PROVISIONAL;
  } catch (error) {
    Logger.error('No se pudo pedir permiso de notificaciones', error);
    return false;
  }
}

/** Token FCM de este dispositivo, o null si no se pudo obtener. */
export async function getPushToken(): Promise<string | null> {
  try {
    return await getToken(getMessaging());
  } catch (error) {
    Logger.error('No se pudo obtener el token de notificaciones', error);
    return null;
  }
}

export function onPushTokenRefresh(listener: (token: string) => void): () => void {
  return onTokenRefresh(getMessaging(), listener);
}

/** El aviso que abrió la app desde cerrada, si lo hubo. */
export async function getInitialPushData(): Promise<PushData | null> {
  const message = await getInitialNotification(getMessaging());
  return (message?.data as PushData | undefined) ?? null;
}

/** Avisos tocados con la app en segundo plano. */
export function onPushOpened(listener: (data: PushData) => void): () => void {
  return onNotificationOpenedApp(getMessaging(), (message) => listener((message.data ?? {}) as PushData));
}
