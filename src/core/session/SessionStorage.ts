import { z } from 'zod';
import { StorageService } from '@core/storage/StorageService';
import { SecureStorageService } from '@core/storage/SecureStorageService';
import { Logger } from '@core/logger/Logger';

// Tokens → almacén seguro (key sin '@', restricción de SecureStore).
const TOKENS_KEY = 'gestia_tokens';
// Perfil no sensible → AsyncStorage.
const PROFILE_KEY = '@gestia_profile';

const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const profileSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  plan: z.string().optional(),
});

const persistedSessionSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: profileSchema,
});

export type PersistedSession = z.infer<typeof persistedSessionSchema>;

/**
 * Guardado de la sesión de auth. Separa lo sensible (tokens → SecureStore) de
 * lo no sensible (perfil → AsyncStorage). Único punto que conoce la forma de
 * la sesión persistida; lo usan el repositorio de auth y el interceptor de red.
 */
export class SessionStorage {
  constructor(
    private secure: SecureStorageService = new SecureStorageService(),
    private storage: StorageService = new StorageService(),
  ) {}

  async save(session: PersistedSession): Promise<void> {
    await Promise.all([
      this.secure.set(
        TOKENS_KEY,
        JSON.stringify({ accessToken: session.accessToken, refreshToken: session.refreshToken }),
      ),
      this.storage.set(PROFILE_KEY, JSON.stringify(session.user)),
    ]);
  }

  /** Sesión completa válida, o null si falta / está corrupta. */
  async load(): Promise<PersistedSession | null> {
    const [rawTokens, rawProfile] = await Promise.all([
      this.secure.get(TOKENS_KEY),
      this.storage.get(PROFILE_KEY),
    ]);
    if (!rawTokens || !rawProfile) return null;
    try {
      const tokens = tokensSchema.parse(JSON.parse(rawTokens));
      const user = profileSchema.parse(JSON.parse(rawProfile));
      return { ...tokens, user };
    } catch (err) {
      Logger.warn('Sesión persistida inválida/corrupta; se descarta', err);
      return null;
    }
  }

  /** Atajo para el interceptor: solo el accessToken (o null). */
  async getAccessToken(): Promise<string | null> {
    const raw = await this.secure.get(TOKENS_KEY);
    if (!raw) return null;
    try {
      return tokensSchema.parse(JSON.parse(raw)).accessToken;
    } catch {
      return null;
    }
  }

  async clear(): Promise<void> {
    await Promise.all([this.secure.remove(TOKENS_KEY), this.storage.remove(PROFILE_KEY)]);
  }
}

/** Singleton — la sesión es global a la app. */
export const sessionStorage = new SessionStorage();
