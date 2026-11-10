import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { BackButton } from '@shared/ui/atoms/BackButton';
import { ThemeVarsProvider } from '@core/theme/ThemeVarsProvider';
import { useTaskForm } from '@features/tasks/presentation/useTaskForm';
import { TaskForm } from '@features/tasks/presentation/organisms/TaskForm';

/** Crear tarea, o editarla si la ruta trae `?id=`. */
export function TaskFormScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { goBack, isEditing, ...formProps } = useTaskForm(id);

  return (
    <ThemeVarsProvider>
      <SafeAreaView className="flex-1 bg-base" edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-row items-center gap-2.5 px-6 pb-2 pt-2">
            <BackButton onPress={goBack} />
            <Text className="text-body font-jakarta-bold text-foreground">
              {t(isEditing ? 'tasks.form.editTitle' : 'tasks.new')}
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
            <View className="rounded-[24px] border border-line bg-surface p-6 shadow-card">
              <TaskForm isEditing={isEditing} {...formProps} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemeVarsProvider>
  );
}
