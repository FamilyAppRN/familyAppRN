import { Stack } from 'expo-router';

// Placeholder del área autenticada. En Etapa 2 pasa a tabs (shopping/tasks/notes).
export default function MainLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
