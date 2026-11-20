import { io, type Socket } from 'socket.io-client';
import { create } from 'zustand';

import { sessionStorage } from '@core/session/SessionStorage';
import { Logger } from '@core/logger/Logger';

// Mismo host que la API: el backend sirve API y Socket.IO en un solo puerto.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

interface RealtimeStatus {
  isConnected: boolean;
}

/** Estado de la conexión, para mostrar "En línea" en la cabecera. */
export const useRealtimeStatus = create<RealtimeStatus>(() => ({ isConnected: false }));

let socket: Socket | null = null;

/**
 * Socket único de la app. No conecta solo: lo hace useRealtimeSync al entrar
 * a las pestañas. El token se pide en cada intento, así una reconexión usa el
 * token vigente y no el del primer arranque.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(BASE_URL, {
      autoConnect: false,
      transports: ['websocket'],
      auth: (callback) => {
        void sessionStorage.getAccessToken().then((token) => callback({ token: token ?? '' }));
      },
    });
    socket.on('connect', () => useRealtimeStatus.setState({ isConnected: true }));
    socket.on('disconnect', () => useRealtimeStatus.setState({ isConnected: false }));
    socket.on('connect_error', (error) => {
      useRealtimeStatus.setState({ isConnected: false });
      Logger.debug('[Realtime] No se pudo conectar', error.message);
    });
  }
  return socket;
}

export function disconnectRealtime(): void {
  socket?.disconnect();
  useRealtimeStatus.setState({ isConnected: false });
}
