/**
 * Validación de contraseña alineada 1:1 con el backend
 * (family-backend/src/shared/domain/constants.ts).
 *
 * Fuente única para el schema de Zod (validez) y el <PasswordStrengthMeter>
 * (hint visual). Si el backend cambia el regex, se ajusta aquí una sola vez.
 */

// Idéntico a PASSWORD_REGEX del backend: mínimo 8, minúscula, mayúscula,
// número y un símbolo de @$!%*?& — y NADA fuera de ese conjunto.
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function isValidPassword(value: string): boolean {
  return PASSWORD_REGEX.test(value);
}

// Reglas positivas para el medidor de fortaleza (score 0-5). Son un hint de
// UX; la validez real la decide PASSWORD_REGEX arriba.
export const PASSWORD_RULES: ReadonlyArray<(value: string) => boolean> = [
  (v) => v.length >= 8,
  (v) => /[a-z]/.test(v),
  (v) => /[A-Z]/.test(v),
  (v) => /\d/.test(v),
  (v) => /[@$!%*?&]/.test(v),
];

export const PASSWORD_RULES_COUNT = PASSWORD_RULES.length;

export function passwordScore(value: string): number {
  return PASSWORD_RULES.reduce((score, rule) => score + (rule(value) ? 1 : 0), 0);
}
