import { AppError } from '@core/errors/AppError';

/** Códigos del backend cuando el plan no alcanza (ver planPolicy del backend). */
export const PLAN_LIMIT_CODES = [
  'LIMIT_REACHED_CREATE_HOUSEHOLD',
  'LIMIT_REACHED_JOIN_HOUSEHOLD',
  'HOUSEHOLD_FULL',
  'PLAN_REQUIRED',
] as const;

export type PlanLimitCode = (typeof PLAN_LIMIT_CODES)[number];

/** El código si el error es por el plan; null si es otro error. */
export function planLimitCode(error: unknown): PlanLimitCode | null {
  const code = error instanceof AppError ? error.code : undefined;
  return (PLAN_LIMIT_CODES as readonly string[]).includes(code ?? '') ? (code as PlanLimitCode) : null;
}
