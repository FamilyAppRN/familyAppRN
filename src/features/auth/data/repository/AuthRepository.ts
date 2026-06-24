import type { ApiClient } from '@core/network/apiClient';
import type { StorageService } from '@core/storage/StorageService';
import { AUTH_TOKEN_KEY } from '@core/network/interceptors';
import { AuthApi } from '@features/auth/data/api/AuthApi';
import { authTokensSchema, meResponseSchema } from '@features/auth/data/schemas/authSchema';
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
    const rawTokens = await this.api.login({ email, password });
    return this.processAuthFlow(rawTokens);
  }

  async register(name: string, email: string, password: string): Promise<{ user: User; households: any[] }> {
    const rawTokens = await this.api.register({ name, email, password });
    return this.processAuthFlow(rawTokens);
  }

  async logout(): Promise<void> {
    await this.storage.remove(AUTH_TOKEN_KEY);
  }

  /** Valida tokens, persiste, y busca el perfil de usuario. */
  private async processAuthFlow(rawTokens: unknown): Promise<{ user: User; households: any[] }> {
    try {
      // 1. Validar tokens devueltos por login/registro
      const tokensRes = authTokensSchema.parse(rawTokens);
      
      // 2. Persistir los tokens para que el interceptor los empiece a usar
      await this.storage.set(
        AUTH_TOKEN_KEY,
        JSON.stringify({
          accessToken: tokensRes.data.accessToken,
          refreshToken: tokensRes.data.refreshToken,
        }),
      );
      
      // 3. Obtener el perfil real de usuario desde el endpoint protegido
      const rawMe = await this.api.getMe();
      const meRes = meResponseSchema.parse(rawMe);
      
      // 4. Mapear al modelo de dominio
      return {
        user: AuthMapper.toDomain(meRes),
        households: meRes.data.households || [],
      };
    } catch (error) {
      Logger.error('Error procesando flujo de autenticación o validación de schemas Zod', error);
      throw error;
    }
  }
}
