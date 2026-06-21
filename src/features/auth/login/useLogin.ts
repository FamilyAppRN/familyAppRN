import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { getAuthRepository } from '@features/auth/data/authFactory';
import { useAuthStore } from '@features/auth/store/useAuthStore';
import { authQueryKeys } from '@features/auth/data/queryKeys';
import { loginFormSchema, type LoginFormData } from '@features/auth/login/loginFormSchema';

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const authRepo = getAuthRepository();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: '', password: '' },
  });

  const mutation = useMutation({
    mutationFn: ({ email, password }: LoginFormData) => authRepo.login(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.currentUser(), user);
      setUser(user);
      router.replace('/(main)/home');
    },
  });

  return {
    control: form.control,
    onSubmit: form.handleSubmit((data) => mutation.mutate(data)),
    isPending: mutation.isPending,
    errorMessage: mutation.error?.message,
    goToRegister: () => router.navigate('/(auth)/register'),
    goToForgot: () => {}, // TODO: flujo de recuperar contraseña
    onGoogle: () => {}, // TODO: OAuth Google
    onApple: () => {}, // TODO: OAuth Apple
  };
}
