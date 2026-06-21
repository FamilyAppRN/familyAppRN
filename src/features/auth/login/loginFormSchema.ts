import { z } from 'zod';

// Los mensajes son claves i18n; se traducen al mostrarse (con useTranslation).
export const loginFormSchema = z.object({
  email: z.email('validation.email'),
  password: z.string().min(8, 'validation.passwordMin'),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
