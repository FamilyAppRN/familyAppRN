/**
 * Los avisos push usan Firebase nativo, que no existe en react-native-web.
 * En web todo es no-op (mismo patrón que firebaseApp.web.ts).
 */
export type PushData = Record<string, string>;

export async function requestPushPermission(): Promise<boolean> {
  return false;
}

export async function getPushToken(): Promise<string | null> {
  return null;
}

export function onPushTokenRefresh(_listener: (token: string) => void): () => void {
  return () => {};
}

export async function getInitialPushData(): Promise<PushData | null> {
  return null;
}

export function onPushOpened(_listener: (data: PushData) => void): () => void {
  return () => {};
}
