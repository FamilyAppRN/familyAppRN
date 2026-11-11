import { Share } from 'react-native';
import type { TFunction } from 'i18next';

export const inviteLink = (code: string) => `gestia://join?code=${encodeURIComponent(code)}`;

/** Abre el menú de compartir con el código y el enlace que abre la app. */
export function shareInvite(t: TFunction, householdName: string, code: string): void {
  void Share.share({
    message: t('shopping.emptyState.shareMessage', { household: householdName, code, link: inviteLink(code) }),
  });
}
