import { z } from 'zod';

/** Respuesta de /api/auth/login y /api/auth/register */
export const authTokensSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
});

export type AuthTokensResponse = z.infer<typeof authTokensSchema>;

const meUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  plan: z.string().optional(),
  notifications_enabled: z.boolean().optional(),
});

/** Respuesta de /api/users/me */
export const meResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.object({
    user: meUserSchema,
    households: z.array(z.any()), // Se puede refinar el schema de household más adelante
  }),
});

export type MeResponse = z.infer<typeof meResponseSchema>;
