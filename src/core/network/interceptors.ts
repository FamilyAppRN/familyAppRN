import { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeError } from '@core/errors/AppError';
import { Logger } from '@core/logger/Logger';

/** Clave única donde se persiste el token de sesión. */
export const AUTH_TOKEN_KEY = '@auth_token';

export function setupInterceptors(instance: AxiosInstance): void {
  // Request: inyecta el accessToken si existe.
  instance.interceptors.request.use(async (config) => {
    Logger.debug(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    
    const raw = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (raw) {
      try {
        const { accessToken } = JSON.parse(raw) as { accessToken?: string };
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (err) {
        Logger.warn('El token de sesión estaba corrupto en AsyncStorage', err);
      }
    }
    return config;
  });

  // Response: normaliza cualquier error a AppError antes de propagarlo.
  instance.interceptors.response.use(
    (response) => {
      Logger.debug(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
      return response;
    },
    (error) => {
      Logger.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error);
      return Promise.reject(normalizeError(error));
    },
  );
}
