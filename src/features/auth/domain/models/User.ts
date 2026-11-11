export interface User {
  id: string;
  email: string;
  name: string;
  /** Plan de suscripción del backend (ej. 'free'). */
  plan?: string;
  /** Recibir avisos push. El backend lo activa por defecto. */
  notificationsEnabled?: boolean;
  avatarUrl?: string;
}
