import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { House, Users } from 'lucide-react-native';

import { Button } from '@shared/ui/atoms/Button';
import { palette } from '@shared/theme/tokens';
import { useWelcome } from '@features/auth/welcome/useWelcome';

export function WelcomeScreen() {
  const { goToLogin, goToRegister } = useWelcome();

  return (
    <SafeAreaView className="flex-1 bg-base">
      <View className="flex-1 justify-between px-4 py-6">
        {/* Header: logo + nombre */}
        <View className="items-center pt-4">
          <View className="mb-2 rounded-card border border-line bg-surface p-2 shadow-card">
            <House size={36} color={palette.brand[700]} strokeWidth={2} />
          </View>
          <Text className="text-h2 font-jakarta-semibold text-foreground">Asistente Familiar</Text>
        </View>

        {/* Hero + copy */}
        <View className="flex-1 items-center justify-center py-6">
          {/* TODO(imagen): reemplazar placeholder por la ilustración definitiva en la fase de diseño de imágenes. */}
          <View className="mb-8 aspect-square w-full max-w-[320px] items-center justify-center rounded-[32px] border-4 border-surface bg-brand-100">
            <Users size={96} color={palette.brand[500]} strokeWidth={1.5} />
          </View>

          <View className="items-center px-2">
            <Text className="mb-3 text-center text-display font-jakarta-bold text-foreground">
              Organiza tu hogar sin esfuerzo
            </Text>
            <Text className="max-w-[280px] text-center text-body font-sans text-muted">
              El espacio digital cálido y seguro para coordinar las tareas y conectar con tu familia.
            </Text>
          </View>
        </View>

        {/* Footer: CTAs */}
        <View className="gap-3 pb-2">
          <Button title="Iniciar Sesión" variant="primary" onPress={goToLogin} />
          <Button title="Registrarme" variant="secondary" onPress={goToRegister} />
        </View>
      </View>
    </SafeAreaView>
  );
}
