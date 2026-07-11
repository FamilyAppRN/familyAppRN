import { z } from 'zod';
import { isValidPassword } from '@features/auth/register/passwordRules';

// Reglas alineadas 1:1 con el backend (ver passwordRules.ts). Un solo mensaje
// consolidado bajo el campo; el detalle por condición vive en el medidor.
const passwordSchema = z
  .string()
  .min(1, 'validation.passwordRequired')
  .refine(isValidPassword, 'validation.passwordRequirements');

export const registerFormSchema = z
  .object({
    name: z.string().min(1, 'validation.nameRequired'),
    email: z.email('validation.email'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'validation.confirmPasswordRequired'),
    terms: z.boolean().refine((v) => v === true, 'validation.termsRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'validation.passwordMismatch',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
