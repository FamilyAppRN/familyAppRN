import type { ApiClient } from '@core/network/apiClient';
import type { StorageService } from '@core/storage/StorageService';
import { AUTH_TOKEN_KEY } from '@core/network/interceptors';
import { AuthApi } from '@features/auth/data/api/AuthApi';
import { authResponseSchema, meResponseSchema } from '@features/auth/data/schemas/authSchema';
import { AuthMapper } from '@features/auth/data/mappers/AuthMapper';
import type { User } from '@features/auth/domain/models/User';
import { Logger } from '@core/logger/Logger';

export class AuthRepository {
  private api: AuthApi;

  constructor(
    client: ApiClient,
    private storage: StorageService,
  ) {
    this.api = new AuthApi(client);
  }

  async login(email: string, password: string): Promise<{ user: User; households: any[] }> {
    return this.processAuthFlow(await this.api.login({ email, password }));
  }

  async register(name: string, email: string, password: string): Promise<{ user: User; households: any[] }> {
    return this.processAuthFlow(await this.api.register({ name, email, password }));
  }

  async logout(): Promise<void> {
    await this.storage.remove(AUTH_TOKEN_KEY);
  }

  /**
   * Login/register devuelven el usuario embebido junto a los tokens (no hace
   * falta esperar a /me para tener el perfil). Igual llamamos a /me después,
   * porque es la única ruta que trae `households` — necesario para decidir
   * a dónde navega el usuario tras autenticarse.
   */
  private async processAuthFlow(raw: unknown): Promise<{ user: User; households: any[] }> {
    try {
      const res = authResponseSchema.parse(raw);

      await this.storage.set(
        AUTH_TOKEN_KEY,
        JSON.stringify({ accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }),
      );

      const rawMe = await this.api.getMe();
      const meRes = meResponseSchema.parse(rawMe);

      return {
        user: AuthMapper.toDomain(res.data.user),
        households: meRes.data.households ?? [],
      };
    } catch (error) {
      Logger.error('Error procesando flujo de autenticación o validación de schemas Zod', error);
      throw error;
    }
  }
}
