import axios from 'axios';

/**
 * Error de dominio normalizado. Todo lo que sale de la capa de red se
 * convierte en un AppError para que features/UI no dependan de axios.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function normalizeError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as { message?: string; code?: string } | undefined;
    return new AppError(
      data?.message ?? error.message ?? 'Error de red',
      status,
      data?.code,
      error,
    );
  }
  if (error instanceof AppError) return error;
  if (error instanceof Error) return new AppError(error.message, undefined, undefined, error);
  return new AppError('Error desconocido', undefined, undefined, error);
}
