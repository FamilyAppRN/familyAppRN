import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getSocket } from '@core/realtime/socket';
import { Logger } from '@core/logger/Logger';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { getHouseholdRepository } from '@features/household/data/householdFactory';
import { householdQueryKeys } from '@features/household/data/queryKeys';
import { shoppingQueryKeys } from '@features/shopping/data/queryKeys';
import { tasksQueryKeys } from '@features/tasks/data/queryKeys';
import { notesQueryKeys } from '@features/notes/data/queryKeys';

type Scope = 'shopping' | 'tasks' | 'notes' | 'household';

interface HouseholdUpdatedEvent {
  householdId: string;
  scope: Scope;
  by: string;
}

interface MemberRemovedEvent {
  householdId: string;
  userId: string;
}

function keysFor(scope: Scope, householdId: string): QueryKey[] {
  switch (scope) {
    case 'shopping':
      return [shoppingQueryKeys.byHousehold(householdId)];
    case 'tasks':
      return [tasksQueryKeys.byHousehold(householdId)];
    case 'notes':
      return [notesQueryKeys.byHousehold(householdId)];
    case 'household':
      return [householdQueryKeys.details(householdId)];
  }
}

const ALL_SCOPES: Scope[] = ['shopping', 'tasks', 'notes', 'household'];

/**
 * Mantiene la app al día con lo que hace el resto de la familia. Se monta una
 * vez en el layout de las pestañas: conecta el socket, entra a la sala del
 * hogar activo (y cambia de sala al cambiar de hogar) y, ante cada aviso,
 * recarga solo la parte que cambió. Al volver de segundo plano reconecta y
 * recarga todo el hogar, por si se perdió algún aviso.
 */
export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const householdId = useCurrentHousehold()?.id;
  const userId = useAuthStore((s) => s.user?.id);

  // Conexión y avisos: una sola vez mientras se está dentro de las pestañas.
  useEffect(() => {
    const socket = getSocket();
    socket.connect();

    const onUpdated = (event: HouseholdUpdatedEvent) => {
      for (const queryKey of keysFor(event.scope, event.householdId)) {
        void queryClient.invalidateQueries({ queryKey });
      }
      // Un cambio de nombre también vive en la sesión (cabecera y selector).
      if (event.scope === 'household') {
        getHouseholdRepository()
          .getHousehold(event.householdId)
          .then((household) => useAuthStore.getState().renameHousehold(household.id, household.name))
          .catch((error) => Logger.debug('[Realtime] No se pudo refrescar el hogar', error));
      }
    };

    const onMemberRemoved = (event: MemberRemovedEvent) => {
      if (event.userId !== useAuthStore.getState().user?.id) return;
      useAuthStore.getState().removeHousehold(event.householdId);
      if (useAuthStore.getState().households.length === 0) {
        router.replace('/(auth)/household-onboarding');
      }
    };

    socket.on('household:updated', onUpdated);
    socket.on('household:member-removed', onMemberRemoved);

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      if (!socket.connected) socket.connect();
      const activeId = useAuthStore.getState().activeHouseholdId ?? useAuthStore.getState().households[0]?.id;
      if (activeId) {
        for (const scope of ALL_SCOPES) {
          for (const queryKey of keysFor(scope, activeId)) void queryClient.invalidateQueries({ queryKey });
        }
      }
    });

    return () => {
      socket.off('household:updated', onUpdated);
      socket.off('household:member-removed', onMemberRemoved);
      appStateSubscription.remove();
      socket.disconnect();
    };
  }, [queryClient, router]);

  // Sala del hogar activo: entra al conectar (y en cada reconexión) y sale al cambiar.
  useEffect(() => {
    if (!householdId || !userId) return;
    const socket = getSocket();
    const join = () =>
      socket.emit('join:household', householdId, (response: { ok: boolean; error?: string }) => {
        if (!response?.ok) Logger.debug('[Realtime] No se pudo entrar a la sala', response?.error);
      });

    if (socket.connected) join();
    socket.on('connect', join);

    return () => {
      socket.off('connect', join);
      socket.emit('leave:household', householdId);
    };
  }, [householdId, userId]);
}
