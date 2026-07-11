import { z } from 'zod';

/**
 * Usuario tal como lo devuelve el backend (snake_case en algunos campos).
 * Verificado contra POST /api/auth/register y /api/auth/login reales.
 * Solo id/email/name se garantizan; el resto se marca opcional a la defensiva.
 */
const authUserSchema = z.object({
  id: z.string(),
  firebase_uid: z.string().optional(),
  email: z.email(),
  name: z.string(),
  plan: z.string().optional(),
  plan_expires_at: z.string().nullable().optional(),
  notifications_enabled: z.boolean().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

/**
 * Respuesta de /api/auth/login y /api/auth/register — trae el usuario
 * embebido junto a los tokens (no hace falta llamar a /api/users/me solo
 * para obtenerlo).
 */
export const authResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: authUserSchema,
  }),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

/** Respuesta de /api/users/me — perfil + hogares. */
export const meResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    user: authUserSchema,
    households: z.array(z.any()), // Se puede refinar el schema de household más adelante
  }),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
