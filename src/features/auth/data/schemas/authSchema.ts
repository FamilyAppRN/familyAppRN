import { z } from 'zod';

const authUserSchema = z.object({
  user_id: z.string(),
  email_address: z.email(),
  first_name: z.string(),
  last_name: z.string(),
  avatar_url: z.string().nullable(),
});

/** Respuesta de /auth/login y /auth/register (el schema reemplaza al DTO). */
export const authResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user: authUserSchema,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
