import { z } from 'zod';

// Los mensajes son claves i18n; se traducen al mostrarse (con useTranslation).
export const registerFormSchema = z.object({
  name: z.string().min(1, 'validation.nameRequired'),
  email: z.email('validation.email'),
  password: z.string().min(8, 'validation.passwordMin'),
  terms: z.boolean().refine((v) => v === true, 'validation.termsRequired'),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
