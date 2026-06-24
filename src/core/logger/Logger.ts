const isProduction = process.env.NODE_ENV === 'production';

export class Logger {
  /**
   * Formatea un mensaje con el prefijo y hora.
   */
  private static formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  /**
   * Solo en desarrollo: para trazas muy detalladas.
   */
  static debug(message: string, ...args: unknown[]): void {
    if (!isProduction) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  /**
   * Información general del flujo de la aplicación.
   */
  static info(message: string, ...args: unknown[]): void {
    if (!isProduction) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  /**
   * Advertencias sobre comportamientos inesperados pero no críticos.
   */
  static warn(message: string, ...args: unknown[]): void {
    console.warn(this.formatMessage('warn', message), ...args);
  }

  /**
   * Errores críticos. En el futuro, aquí se integrará Crashlytics / Sentry.
   */
  static error(message: string, error?: unknown, ...args: unknown[]): void {
    console.error(this.formatMessage('error', message), error || '', ...args);
    
    // TODO: Integrar Crashlytics/Sentry aquí para el entorno de producción.
  }
}
