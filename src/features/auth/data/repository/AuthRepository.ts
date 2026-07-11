import type { ApiClient } from '@core/network/apiClient';
import type { SessionStorage } from '@core/session/SessionStorage';
import { AppError } from '@core/errors/AppError';
import { AuthApi } from '@features/auth/data/api/AuthApi';
import {
  authResponseSchema,
  meResponseSchema,
  type HouseholdSummary,
} from '@features/auth/data/schemas/authSchema';
import { AuthMapper } from '@features/auth/data/mappers/AuthMapper';
import type { User } from '@features/auth/domain/models/User';

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface AuthOutcome {
  user: User;
  households: HouseholdSummary[];
}

/**
 * Acceso a datos de auth + persistencia de la sesión (capa de datos). El hook
 * solo llama login/register; aquí se autentica, se trae /me y se persiste la
 * sesión (tokens en SecureStore + perfil en AsyncStorage, vía SessionStorage).
 */
export class AuthRepository {
  private api: AuthApi;

  constructor(
    client: ApiClient,
    private session: SessionStorage,
  ) {
    this.api = new AuthApi(client);
  }

  async login(email: string, password: string): Promise<AuthOutcome> {
    return this.completeAuth(this.toAuthResult(await this.api.login({ email, password })));
  }

  async register(name: string, email: string, password: string): Promise<AuthOutcome> {
    return this.completeAuth(this.toAuthResult(await this.api.register({ name, email, password })));
  }

  /** Cierra sesión: borra la sesión persistida (tokens + perfil). */
  async logout(): Promise<void> {
    await this.session.clear();
  }

  /**
   * Restaura la sesión al abrir la app: lee la sesión guardada localmente y,
   * si existe, valida el accessToken contra el backend trayendo /me (mismo
   * middleware que valida el token vía Firebase Admin, y de paso trae
   * households — evita una llamada aparte a /auth/session).
   *
   * Devuelve null si no había sesión guardada. Si el backend confirma que el
   * token ya no es válido (401), borra la sesión persistida; ante errores de
   * red/servidor NO la borra (podría ser una falla transitoria — se
   * reintentará la próxima vez que se abra la app).
   */
  async restoreSession(): Promise<AuthOutcome | null> {
    const session = await this.session.load();
    if (!session) return null;

    try {
      const meRes = meResponseSchema.parse(await this.api.getMe(session.accessToken));
      return {
        user: AuthMapper.toDomain(meRes.data.user),
        households: meRes.data.households,
      };
    } catch (error) {
      if (error instanceof AppError && error.status === 401) {
        await this.session.clear();
      }
      return null;
    }
  }

  /**
   * Trae hogares vía /me (con token explícito, aún no persistido) y, solo si
   * todo salió bien, persiste la sesión — así no queda un token guardado de
   * una autenticación a medias.
   */
  private async completeAuth(auth: AuthResult): Promise<AuthOutcome> {
    const meRes = meResponseSchema.parse(await this.api.getMe(auth.accessToken));

    await this.session.save({
      accessToken: auth.accessToken,
      refreshToken: auth.refreshToken,
      user: {
        id: auth.user.id,
        email: auth.user.email,
        name: auth.user.name,
        plan: auth.user.plan,
      },
    });

    return { user: auth.user, households: meRes.data.households };
  }

  private toAuthResult(raw: unknown): AuthResult {
    const res = authResponseSchema.parse(raw);
    return {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      user: AuthMapper.toDomain(res.data.user),
    };
  }
}
