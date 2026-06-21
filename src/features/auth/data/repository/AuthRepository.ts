import type { ApiClient } from '@core/network/apiClient';
import type { StorageService } from '@core/storage/StorageService';
import { AUTH_TOKEN_KEY } from '@core/network/interceptors';
import { AuthApi } from '@features/auth/data/api/AuthApi';
import { authResponseSchema } from '@features/auth/data/schemas/authSchema';
import { AuthMapper } from '@features/auth/data/mappers/AuthMapper';
import type { User } from '@features/auth/domain/models/User';

export class AuthRepository {
  private api: AuthApi;

  constructor(
    client: ApiClient,
    private storage: StorageService,
  ) {
    this.api = new AuthApi(client);
  }

  async login(email: string, password: string): Promise<User> {
    return this.persist(await this.api.login({ email, password }));
  }

  async register(name: string, email: string, password: string): Promise<User> {
    return this.persist(await this.api.register({ name, email, password }));
  }

  async logout(): Promise<void> {
    await this.storage.remove(AUTH_TOKEN_KEY);
  }

  /** Valida con Zod, persiste el token y mapea a dominio. */
  private async persist(raw: unknown): Promise<User> {
    const res = authResponseSchema.parse(raw);
    await this.storage.set(
      AUTH_TOKEN_KEY,
      JSON.stringify({ accessToken: res.access_token, refreshToken: res.refresh_token }),
    );
    return AuthMapper.toDomain(res);
  }
}
