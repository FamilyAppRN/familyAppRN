import { AxiosInstance, InternalAxiosRequestConfig, RawAxiosRequestHeaders, AxiosHeaders } from 'axios';
import { normalizeError } from '@core/errors/AppError';
import { sessionStorage } from '@core/session/SessionStorage';
import { Logger } from '@core/logger/Logger';

// Axios no tipa metadata custom; se usa para medir la duración de la request.
type ConfigWithMetadata = InternalAxiosRequestConfig & { metadata?: { startedAt: number } };

export function setupInterceptors(instance: AxiosInstance): void {
  // Request: inyecta el accessToken de la sesión persistida + traza (solo DEV).
  instance.interceptors.request.use(async (config) => {
    // No pisar un Authorization ya puesto por quien llama (ej. /me con token
    // explícito durante el login, antes de que la sesión esté persistida).
    if (!config.headers.Authorization) {
      const token = await sessionStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
