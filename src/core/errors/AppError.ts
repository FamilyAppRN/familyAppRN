import axios from 'axios';
import { z } from 'zod';

/**
 * Envelope estándar de error del backend (ver API_INTEGRATION_GUIDE.md §2):
 * { success:false, error: { code, message, category, status, details, traceId }, message }
 */
const apiErrorEnvelopeSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    category: z.string().optional(),
    status: z.number().optional(),
    details: z.record(z.string(), z.unknown()).optional(),
    traceId: z.string().optional(),
  }),
  message: z.string().optional(),
});

export interface AppErrorOptions {
  status?: number;
  code?: string;
  category?: string;
  details?: Record<string, unknown>;
  traceId?: string;
  cause?: unknown;
}

/**
 * Error de dominio normalizado. Todo lo que sale de la capa de red se
 * convierte en un AppError para que features/UI no dependan de axios.
 */
export class AppError extends Error {
  readonly status?: number;
  readonly code?: string;
  /** Categoría del backend: AUTHENTICATION | VALIDATION | AUTHORIZATION | etc. */
  readonly category?: string;
  /** Detalle por campo en errores de validación, ej: { email: "Email inválido" }. */
  readonly details?: Record<string, unknown>;
  /** Id de traza del backend — útil para reportar soporte/logs. */
  readonly traceId?: string;
  readonly cause?: unknown;

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';
    this.status = options.status;
    this.code = options.code;
    this.category = options.category;
    this.details = options.details;
    this.traceId = options.traceId;
    this.cause = options.cause;
  }
}

export function normalizeError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const parsed = apiErrorEnvelopeSchema.safeParse(error.response?.data);

    if (parsed.success) {
      const { error: apiError } = parsed.data;
      return new AppError(apiError.message, {
        status: apiError.status ?? status,
        code: apiError.code,
        category: apiError.category,
        details: apiError.details,
        traceId: apiError.traceId,
        cause: error,
      });
    }

    return new AppError(error.message ?? 'Error de red', { status, cause: error });
  }
  if (error instanceof AppError) return error;
  if (error instanceof Error) return new AppError(error.message, { cause: error });
  return new AppError('Error desconocido', { cause: error });
}
