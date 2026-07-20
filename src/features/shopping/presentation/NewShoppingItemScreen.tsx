import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { BackButton } from '@shared/ui/atoms/BackButton';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useNewShoppingItem } from '@features/shopping/presentation/useNewShoppingItem';
import { NewItemForm } from '@features/shopping/presentation/organisms/NewItemForm';

export function NewShoppingItemScreen() {
  const { t } = useTranslation();
  const { control, onSubmit, isPending, isValid, errorMessage, goBack } = useNewShoppingItem();

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <View className="flex-row items-center gap-2.5 px-6 pb-2 pt-2">
            <BackButton onPress={goBack} />
            <Text className="text-body font-jakarta-bold text-foreground">
              {t('shopping.newItem.title')}
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled">
            <View className="rounded-[24px] border border-line bg-surface p-6 shadow-card">
              <NewItemForm
                control={control}
                onSubmit={onSubmit}
                isPending={isPending}
                isValid={isValid}
                errorMessage={errorMessage}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
