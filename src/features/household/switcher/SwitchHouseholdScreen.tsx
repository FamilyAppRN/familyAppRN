import type { ComponentType } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, House, Plus, UserPlus, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { avatarColors, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useSwitchHousehold } from '@features/household/switcher/useSwitchHousehold';

interface ActionRowProps {
  Icon: ComponentType<{ size?: number; color?: string }>;
  title: string;
  subtitle?: string;
  locked: boolean;
  onPress: () => void;
}

function ActionRow({ Icon, title, subtitle, locked, onPress }: ActionRowProps) {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className="min-h-[56px] flex-row items-center gap-3 py-2 active:opacity-70">
      <View className="h-9 w-9 items-center justify-center rounded-full bg-surface-2">
        <Icon size={18} color={semanticColors[scheme].textPrimary} />
      </View>
      <View className="flex-1">
        <Text className="text-body font-jakarta-semibold text-foreground">{title}</Text>
        {subtitle ? <Text className="text-caption font-sans text-muted">{subtitle}</Text> : null}
      </View>
      {locked ? (
        <View className="rounded-badge bg-accent-soft px-2.5 py-1">
          <Text className="text-caption font-jakarta-bold text-foreground">{t('switcher.premium')}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export function SwitchHouseholdScreen() {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const switcher = useSwitchHousehold();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        <View className="flex-row items-center justify-between px-5 pb-2 pt-2">
          <Text accessibilityRole="header" className="text-h2 font-jakarta-bold text-foreground">
            {t('switcher.title')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('switcher.close')}
            onPress={switcher.close}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface-2">
            <X size={18} color={semanticColors[scheme].textPrimary} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24, gap: 16 }}>
          <View accessibilityRole="radiogroup" className="gap-2">
            {switcher.households.map((household, index) => {
              const active = household.id === switcher.activeId;
              const tone = avatarColors[index % avatarColors.length];
              const details = [
                household.members_count !== undefined ? t('householdHeader.members', { count: household.members_count }) : null,
                household.role ? t(household.role === 'admin' ? 'household.members.admin' : 'household.members.member') : null,
              ]
                .filter(Boolean)
                .join(' · ');
              return (
                <Pressable
                  key={household.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  onPress={() => switcher.select(household.id)}
                  className={`flex-row items-center gap-3 rounded-card p-3.5 active:opacity-80 ${
                    active ? 'border-[1.5px] border-brand-600 bg-chip' : 'border border-line bg-surface'
                  }`}>
                  <View className="h-11 w-11 items-center justify-center rounded-[14px]" style={{ backgroundColor: tone.bg }}>
                    <House size={22} color={tone.fg} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-body font-jakarta-bold text-foreground" numberOfLines={1}>
                      {household.name}
                    </Text>
                    {details ? <Text className="text-caption font-sans text-muted">{details}</Text> : null}
                  </View>
                  {active ? <Check size={20} color={semanticColors[scheme].emphasis} strokeWidth={2.6} /> : null}
                </Pressable>
              );
            })}
          </View>

          <View className="border-t border-line pt-2">
            <ActionRow
              Icon={Plus}
              title={t('switcher.create')}
              subtitle={switcher.canCreate ? undefined : t('switcher.createLimit')}
              locked={!switcher.canCreate}
              onPress={() => switcher.addHousehold(switcher.canCreate)}
            />
            <ActionRow
              Icon={UserPlus}
              title={t('switcher.join')}
              subtitle={switcher.canJoin ? undefined : t('switcher.joinLimit')}
              locked={!switcher.canJoin}
              onPress={() => switcher.addHousehold(switcher.canJoin)}
            />
          </View>

          {switcher.isLimited ? (
            <Pressable
              accessibilityRole="button"
              onPress={switcher.openPremium}
              className="h-[52px] items-center justify-center rounded-button bg-accent-500 active:opacity-90">
              <Text className="text-button font-jakarta-bold text-neutral-950">{t('switcher.seePremium')}</Text>
            </Pressable>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
