import { z } from 'zod';

// Los mensajes son claves i18n; se traducen al mostrarse (con useTranslation).
// Login solo exige que el password no esté vacío (las reglas de complejidad
// son cosa de Register, no de inicio de sesión).
export const loginFormSchema = z.object({
  email: z.email('validation.email'),
  password: z.string().min(1, 'validation.passwordRequired'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
