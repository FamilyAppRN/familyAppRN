import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Stub temporal — se reemplaza en Etapa 1 (RegisterScreen del feature auth).
export default function RegisterRoute() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-base">
      <Text className="text-h1 font-jakarta-bold text-foreground">Registrarme</Text>
      <Text className="mt-2 text-body font-sans text-muted">Próximamente</Text>
    </SafeAreaView>
  );
}
