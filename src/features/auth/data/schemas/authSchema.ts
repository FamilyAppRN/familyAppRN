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

/**
 * Resumen de hogar que devuelve /api/users/me (NO es el household completo;
 * ese vive en el feature household). Forma tomada de HouseholdSummarySchema
 * del backend (family-backend/.../household.schemas.ts).
 */
export const householdSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['admin', 'member']),
  is_owner: z.boolean(),
  invite_code: z.string().nullable().optional(),
  members_count: z.number(),
});

export type HouseholdSummary = z.infer<typeof householdSummarySchema>;

/** Respuesta de /api/users/me — perfil + hogares (resumen). */
export const meResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    user: authUserSchema,
    households: z.array(householdSummarySchema),
  }),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
