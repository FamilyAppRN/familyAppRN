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
    defaultValues: { name: '', email: '', password: '', terms: false },
  });

  const mutation = useMutation({
    mutationFn: ({ name, email, password }: RegisterFormData) =>
      authRepo.register(name, email, password),
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
    goToLogin: () => router.navigate('/(auth)/login'),
  };
}
