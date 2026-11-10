import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Avatar } from '@shared/ui/molecules/Avatar';
import { useCurrentHousehold } from '@features/household/useCurrentHousehold';
import { useHouseholdMembers } from '@features/household/useHouseholdMembers';
import { useAuthStore } from '@features/auth/store/useAuthStore';

interface HouseholdHeaderProps {
  /** Acciones propias de la pantalla, a la izquierda del avatar. */
  actions?: ReactNode;
}

/**
 * Cabecera común de las pestañas: nombre del hogar y cuántos miembros tiene,
 * y el avatar del usuario que abre su perfil. El nombre será el selector de
 * hogar cuando exista (U5).
 */
export function HouseholdHeader({ actions }: HouseholdHeaderProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const household = useCurrentHousehold();
  const { members, resolveMember } = useHouseholdMembers();
  const user = useAuthStore((s) => s.user);
  const me = resolveMember(user?.id);

  return (
    <View className="flex-row items-center justify-between gap-3 px-4 pb-1 pt-2">
      <View className="min-h-[44px] flex-1 justify-center">
        <Text accessibilityRole="header" className="text-h2 font-jakarta-bold text-foreground" numberOfLines={1}>
          {household?.name ?? ''}
        </Text>
        {members.length > 0 ? (
          <Text className="text-caption font-sans text-muted">
            {t('householdHeader.members', { count: members.length })}
          </Text>
        ) : null}
      </View>

      <View className="flex-row items-center gap-1">
        {actions}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('householdHeader.profile')}
          onPress={() => router.push('/(modals)/profile' as Href)}
          className="h-11 w-11 items-center justify-center">
          <Avatar
            name={user?.name ?? '?'}
            size={34}
            color={me?.color}
            textColor={me?.textColor}
            bordered={false}
          />
        </Pressable>
      </View>
    </View>
  );
}
