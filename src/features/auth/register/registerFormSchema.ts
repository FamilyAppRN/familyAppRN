import { z } from 'zod';

// Reglas: más de 5 caracteres, una mayúscula, un número y un símbolo.
// Mismo mensaje para las 4 (se muestra una sola vez bajo el campo); el detalle
// visual condición-por-condición vive en <PasswordStrengthMeter>.
const passwordSchema = z
  .string()
  .min(1, 'validation.passwordRequired')
  .refine((val) => val.length > 5, 'validation.passwordRequirements')
  .refine((val) => /[0-9]/.test(val), 'validation.passwordRequirements')
  .refine((val) => /[A-Z]/.test(val), 'validation.passwordRequirements')
  .refine((val) => /[^A-Za-z0-9]/.test(val), 'validation.passwordRequirements');

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
