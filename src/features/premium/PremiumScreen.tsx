import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Clock, Crown, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { palette, semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { usePremium, type BillingPeriod } from '@features/premium/usePremium';

const FEATURES = ['homes', 'members', 'calendar', 'points'] as const;
const PERIODS: BillingPeriod[] = ['yearly', 'monthly'];

export function PremiumScreen() {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const premium = usePremium();
  const emphasis = semanticColors[scheme].emphasis;

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top', 'bottom']}>
        <View className="flex-row justify-end px-4 pt-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('premium.close')}
            onPress={premium.close}
            className="h-11 w-11 items-center justify-center rounded-full bg-surface-2">
            <X size={18} color={semanticColors[scheme].textPrimary} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingBottom: 16, gap: 20 }}>
          <View className="gap-2.5">
            <View className="flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-button bg-accent-soft">
                <Crown size={16} color={scheme === 'dark' ? palette.accent[400] : palette.accent[600]} />
              </View>
              <Text className="text-caption font-jakarta-bold text-foreground">{t('premium.brand')}</Text>
            </View>
            <Text accessibilityRole="header" className="text-h1 font-jakarta-bold text-foreground">
              {t('premium.title')}
            </Text>
            <Text className="text-body font-sans text-muted">{t('premium.subtitle')}</Text>
          </View>

          <View className="gap-3.5">
            {FEATURES.map((key) => (
              <View key={key} className="flex-row items-start gap-3">
                <Check size={20} color={emphasis} strokeWidth={2.6} />
                <View className="flex-1">
                  <Text className="text-body font-jakarta-bold text-foreground">{t(`premium.features.${key}.title`)}</Text>
                  <Text className="text-caption font-sans text-muted">{t(`premium.features.${key}.description`)}</Text>
                </View>
              </View>
            ))}
            <View className="flex-row items-start gap-3">
              <Clock size={20} color={semanticColors[scheme].textSecondary} />
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className="text-body font-jakarta-bold text-foreground">{t('premium.features.ai.title')}</Text>
                  <View className="rounded-badge bg-surface-2 px-2 py-0.5">
                    <Text className="text-[11px] font-jakarta-bold text-muted">{t('premium.soon')}</Text>
                  </View>
                </View>
                <Text className="text-caption font-sans text-muted">{t('premium.features.ai.description')}</Text>
              </View>
            </View>
          </View>

          {premium.isPremium ? (
            <View className="mt-auto rounded-card border border-line bg-chip p-4">
              <Text className="text-body font-jakarta-bold text-foreground">{t('premium.alreadyPremium')}</Text>
            </View>
          ) : (
            <View className="mt-auto gap-2.5">
              <View accessibilityRole="radiogroup" className="gap-2">
                {PERIODS.map((period) => {
                  const selected = premium.period === period;
                  return (
                    <Pressable
                      key={period}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => premium.setPeriod(period)}
                      className={`flex-row items-center gap-3 rounded-card bg-surface px-4 py-3.5 ${
                        selected ? 'border-2 border-foreground' : 'border border-line'
                      }`}>
                      <View
                        className={`h-[22px] w-[22px] rounded-full ${
                          selected ? 'border-[6px] border-foreground' : 'border-2 border-neutral-400'
                        }`}
                      />
                      <View className="flex-1">
                        <Text className="text-body font-jakarta-bold text-foreground">{t(`premium.periods.${period}.name`)}</Text>
                        {period === 'yearly' ? (
                          <Text className="text-caption font-sans text-muted">{t('premium.periods.yearly.perMonth')}</Text>
                        ) : null}
                      </View>
                      <View className="items-end">
                        <Text className="text-h2 font-jakarta-bold text-foreground">{t(`premium.periods.${period}.price`)}</Text>
                        {period === 'yearly' ? (
                          <Text className="text-[11px] font-jakarta-bold text-emphasis">{t('premium.periods.yearly.saving')}</Text>
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !premium.canPurchase }}
                disabled={!premium.canPurchase}
                className={`h-[54px] items-center justify-center rounded-button bg-accent-500 ${
                  premium.canPurchase ? 'active:opacity-90' : 'opacity-60'
                }`}>
                <Text className="text-button font-jakarta-bold text-neutral-950">
                  {premium.canPurchase ? t(`premium.subscribe.${premium.period}`) : t('premium.comingSoon')}
                </Text>
              </Pressable>
              <Text className="text-center text-caption font-sans text-muted">{t('premium.renewal')}</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
