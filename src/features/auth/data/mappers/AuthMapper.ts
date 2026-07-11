import type { User } from '@features/auth/domain/models/User';
import type { AuthUser } from '@features/auth/data/schemas/authSchema';

export const AuthMapper = {
  toDomain(rawUser: AuthUser): User {
    return {
      id: rawUser.id,
      email: rawUser.email,
      name: rawUser.name,
      plan: rawUser.plan,
    };
  },
};
