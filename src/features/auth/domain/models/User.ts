export interface User {
  id: string;
  email: string;
  name: string;
  /** Plan de suscripción del backend (ej. 'free'). */
  plan?: string;
  avatarUrl?: string;
}
