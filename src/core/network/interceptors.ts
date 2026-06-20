import { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeError } from '@core/errors/AppError';

/** Clave única donde se persiste el token de sesión. */
export const AUTH_TOKEN_KEY = '@auth_token';

export function setupInterceptors(instance: AxiosInstance): void {
  // Request: inyecta el accessToken si existe.
  instance.interceptors.request.use(async (config) => {
    const raw = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (raw) {
      try {
        const { accessToken } = JSON.parse(raw) as { accessToken?: string };
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch {
        // token corrupto: lo ignoramos, la request sale sin auth.
      }
    }
    return config;
  });

  // Response: normaliza cualquier error a AppError antes de propagarlo.
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeError(error)),
  );
}
