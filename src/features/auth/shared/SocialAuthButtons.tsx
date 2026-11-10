import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { palette } from '@shared/theme/tokens';
import { AppleIcon, GoogleIcon } from '@features/auth/shared/SocialIcons';

interface SocialAuthButtonsProps {
  onGoogle: () => void;
  onApple: () => void;
  /** "stacked": dos botones a lo ancho (login). "row": lado a lado (registro). */
  layout?: 'stacked' | 'row';
}

/** Google y Apple con el mismo peso visual que el correo, como en el rediseño. */
export function SocialAuthButtons({ onGoogle, onApple, layout = 'stacked' }: SocialAuthButtonsProps) {
  const { t } = useTranslation();
  const stacked = layout === 'stacked';

  return (
    <View className={stacked ? 'gap-2.5' : 'flex-row gap-2.5'}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('auth.social.google')}
        onPress={onGoogle}
        className={`h-[52px] flex-row items-center justify-center gap-2.5 rounded-button border border-line bg-surface active:opacity-80 ${
          stacked ? '' : 'flex-1'
        }`}>
        <GoogleIcon />
        <Text className="text-button font-jakarta-bold text-foreground">
          {stacked ? t('auth.social.google') : 'Google'}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('auth.social.apple')}
        onPress={onApple}
        className={`h-[52px] flex-row items-center justify-center gap-2.5 rounded-button border border-line bg-neutral-950 active:opacity-90 ${
          stacked ? '' : 'flex-1'
        }`}>
        <AppleIcon color={palette.neutral[0]} />
        <Text className="text-button font-jakarta-bold text-white">{stacked ? t('auth.social.apple') : 'Apple'}</Text>
      </Pressable>
    </View>
  );
}

/** Separador "o con tu correo". */
export function EmailDivider() {
  const { t } = useTranslation();
  return (
    <View className="flex-row items-center gap-3">
      <View className="h-px flex-1 bg-line" />
      <Text className="text-caption font-sans text-muted">{t('auth.social.divider')}</Text>
      <View className="h-px flex-1 bg-line" />
    </View>
  );
}
