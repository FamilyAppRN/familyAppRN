import { getApp } from '@react-native-firebase/app';
import { Logger } from '@core/logger/Logger';

/**
 * Firebase se autoinicializa de forma nativa leyendo google-services.json
 * (Android) / GoogleService-Info.plist (iOS) al arrancar la app — no hace
 * falta llamar a initializeApp(). Esta función solo confirma el arranque.
 */
export function initFirebase(): void {
  const app = getApp();
  Logger.debug(`🔥 Firebase inicializado: ${app.name}`);
}
