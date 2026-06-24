import type { ApiClient } from '@core/network/apiClient';

export class AuthApi {
  constructor(private client: ApiClient) {}

  login(body: { email: string; password: string }) {
    return this.client.post<unknown>('/api/auth/login', body);
  }

  register(body: { name: string; email: string; password: string }) {
    return this.client.post<unknown>('/api/auth/register', body);
  }

  getMe() {
    return this.client.get<unknown>('/api/users/me');
  }
}
