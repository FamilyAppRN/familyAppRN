import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { semanticColors } from '@shared/theme/tokens';
import { useAppColorScheme } from '@shared/theme/useAppColorScheme';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useNewShoppingItem } from '@features/shopping/presentation/useNewShoppingItem';
import { NewItemForm } from '@features/shopping/presentation/organisms/NewItemForm';

export function NewShoppingItemScreen() {
  const { t } = useTranslation();
  const scheme = useAppColorScheme();
  const { control, onSubmit, isPending, isValid, hasError, added, goBack } = useNewShoppingItem();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-row items-center justify-between px-5 pb-2 pt-2">
            <Text accessibilityRole="header" className="text-h2 font-jakarta-bold text-foreground">
              {t('shopping.newItem.title')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t(added.length ? 'shopping.newItem.done' : 'shopping.newItem.close')}
              onPress={goBack}
              className="h-11 min-w-[44px] items-center justify-center rounded-full bg-surface-2 px-3">
              {added.length ? (
                <Text className="text-caption font-jakarta-bold text-foreground">{t('shopping.newItem.done')}</Text>
              ) : (
                <X size={18} color={semanticColors[scheme].textPrimary} />
              )}
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 16 }} keyboardShouldPersistTaps="handled">
            {added.length > 0 ? (
              <View accessibilityLiveRegion="polite" className="flex-row flex-wrap items-center gap-1.5 rounded-button bg-chip px-3 py-2">
                <Check size={14} color={semanticColors[scheme].emphasis} strokeWidth={3} />
                <Text className="flex-1 text-caption font-jakarta-semibold text-emphasis" numberOfLines={2}>
                  {t('shopping.newItem.added', { items: added.join(', ') })}
                </Text>
              </View>
            ) : null}

            <NewItemForm control={control} onSubmit={onSubmit} isPending={isPending} isValid={isValid} hasError={hasError} />

            <Text className="text-center text-caption font-sans text-muted">{t('shopping.newItem.keepsOpen')}</Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
