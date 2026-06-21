import { Pressable, Text, View } from 'react-native';
import { SUPPORTED_LANGUAGES, useLanguage } from '@core/i18n/useLanguage';

/** Toggle ES | EN. shared → core está permitido. */
export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <View className="flex-row rounded-full border border-line bg-surface p-0.5">
      {SUPPORTED_LANGUAGES.map((lng) => {
        const active = language === lng;
        return (
          <Pressable
            key={lng}
            accessibilityRole="button"
            onPress={() => setLanguage(lng)}
            className={`rounded-full px-3 py-1 ${active ? 'bg-brand-500' : ''}`}>
            <Text
              className={`text-caption font-jakarta-semibold ${active ? 'text-white' : 'text-muted'}`}>
              {lng.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
