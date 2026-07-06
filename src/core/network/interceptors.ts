import { AxiosInstance, InternalAxiosRequestConfig, RawAxiosRequestHeaders, AxiosHeaders } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeError } from '@core/errors/AppError';
import { Logger } from '@core/logger/Logger';

/** Clave única donde se persiste el token de sesión. */
export const AUTH_TOKEN_KEY = '@auth_token';

// Axios no tipa metadata custom; se usa para medir la duración de la request.
type ConfigWithMetadata = InternalAxiosRequestConfig & { metadata?: { startedAt: number } };

export function setupInterceptors(instance: AxiosInstance): void {
  // Request: inyecta el accessToken si existe + traza completa (solo DEV, vía Logger).
  instance.interceptors.request.use(async (config) => {
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

    (config as ConfigWithMetadata).metadata = { startedAt: Date.now() };
    Logger.debug(`➡️ [API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      body: config.data,
      headers: redactHeaders(config.headers),
    });

    return config;
  });

  // Response: traza completa (solo DEV) + normaliza cualquier error a AppError.
  instance.interceptors.response.use(
    (response) => {
      Logger.debug(
        `⬅️ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url} — ${response.status} (${getDuration(response.config as ConfigWithMetadata)}ms)`,
        response.data,
      );
      return response;
    },
    (error) => {
      Logger.error(
        `⬅️ [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} — ${error.response?.status ?? 'sin respuesta'} (${getDuration(error.config as ConfigWithMetadata)}ms)`,
        error.response?.data ?? error.message,
      );
      return Promise.reject(normalizeError(error));
    },
  );
}

function getDuration(config?: ConfigWithMetadata): number | string {
  return config?.metadata ? Date.now() - config.metadata.startedAt : '?';
}

/** Copia los headers ocultando el token del Authorization antes de loguear. */
function redactHeaders(headers: RawAxiosRequestHeaders | AxiosHeaders): Record<string, unknown> {
  const plain: Record<string, unknown> = { ...headers };
  if (plain.Authorization) plain.Authorization = 'Bearer ***';
  return plain;
}
