import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getAuthRepository } from '@features/auth/data/authFactory';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { authQueryKeys } from '@features/auth/data/queryKeys';
import { registerFormSchema, type RegisterFormData } from '@features/auth/register/registerFormSchema';

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const authRepo = getAuthRepository();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
    mode: 'onChange', // valida en vivo: borde rojo + botón disabled/enabled reactivos
  });

  const mutation = useMutation({
    mutationFn: ({ name, email, password }: RegisterFormData) =>
      authRepo.register(name, email, password),
    onSuccess: ({ user, households }) => {
      queryClient.setQueryData(authQueryKeys.currentUser(), user);
      setUser(user, households);
      if (households && households.length > 0) {
        router.replace('/(main)/shopping');
      } else {
        router.replace('/(auth)/household-onboarding');
      }
    },
  });

  return {
    control: form.control,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    isPending: mutation.isPending,
    isValid: form.formState.isValid,
    errorMessage: mutation.error?.message,
    // El back siempre va a Welcome (no se anida Login↔Register entre sí).
    goBack: () => router.replace('/(auth)/welcome'),
    goToLogin: () => router.navigate('/(auth)/login'),
  };
}
