import { create } from 'zustand';

import { INVITE_CODE_LENGTH } from '@features/household/domain/inviteCode';

interface PendingInviteState {
  /** Código llegado por enlace, esperando a que haya sesión para usarse. */
  code: string | null;
  setCode: (code: string | null) => void;
  /** Lo devuelve y lo borra: cada enlace se usa una sola vez. */
  take: () => string | null;
}

export const usePendingInvite = create<PendingInviteState>((set, get) => ({
  code: null,
  setCode: (code) => set({ code }),
  take: () => {
    const code = get().code;
    set({ code: null });
    return code;
  },
}));

/** Normaliza lo que venga en el enlace; null si no parece un código. */
export function parseInviteCode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  return code.length === INVITE_CODE_LENGTH ? code : null;
}
