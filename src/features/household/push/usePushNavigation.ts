import { useEffect } from 'react';
import { useRouter, type Href } from 'expo-router';

import { getInitialPushData, onPushOpened, type PushData } from '@core/push/push';
import { useAuthStore } from '@features/auth/store/useAuthStore';

/** Pantalla que abre cada tipo de aviso (tipos del PushService del backend). */
export function routeForPush(data: PushData): Href | null {
  switch (data.type) {
    case 'task_assigned':
    case 'task_reminder':
      return data.taskId ? (`/(modals)/task/${data.taskId}` as Href) : ('/tasks' as Href);
    case 'urgent_item':
    case 'going_shopping':
      return '/shopping' as Href;
    case 'member_joined':
      return '/household' as Href;
    default:
      return null;
  }
}

/**
 * Al tocar un aviso (con la app cerrada o en segundo plano) abre su pantalla.
 * Si el aviso es de otro hogar, primero activa ese hogar para que la
 * pantalla muestre los datos correctos.
 */
export function usePushNavigation() {
  const router = useRouter();

  useEffect(() => {
    const open = (data: PushData) => {
      const target = routeForPush(data);
      if (!target) return;
      const { households, setActiveHousehold } = useAuthStore.getState();
      if (data.householdId && households.some((h) => h.id === data.householdId)) {
        setActiveHousehold(data.householdId);
      }
      router.push(target);
    };

    void getInitialPushData().then((data) => {
      if (data) open(data);
    });
    return onPushOpened(open);
  }, [router]);
}
