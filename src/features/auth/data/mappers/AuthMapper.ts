import type { User } from '@features/auth/domain/models/User';
import type { AuthResponse } from '@features/auth/data/schemas/authSchema';

export const AuthMapper = {
  toDomain(res: AuthResponse): User {
    return {
      id: res.user.user_id,
      email: res.user.email_address,
      firstName: res.user.first_name,
      lastName: res.user.last_name,
      avatarUrl: res.user.avatar_url ?? undefined,
    };
  },
};
