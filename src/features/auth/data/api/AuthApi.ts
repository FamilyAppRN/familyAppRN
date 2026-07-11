import type { ApiClient } from '@core/network/apiClient';

export class AuthApi {
  constructor(private client: ApiClient) {}

  login(body: { email: string; password: string }) {
    return this.client.post<unknown>('/api/auth/login', body);
  }

  register(body: { name: string; email: string; password: string }) {
    return this.client.post<unknown>('/api/auth/register', body);
  }

  /**
   * Perfil + hogares del usuario. Acepta un accessToken explícito para el
   * flujo de auth (se llama antes de persistir la sesión, cuando el
   * interceptor todavía no tiene token que inyectar).
   */
  getMe(accessToken?: string) {
    const config = accessToken
      ? { headers: { Authorization: `Bearer ${accessToken}` } }
      : undefined;
    return this.client.get<unknown>('/api/users/me', config);
  }
}
