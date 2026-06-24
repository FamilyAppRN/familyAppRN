import type { User } from '@features/auth/domain/models/User';
import type { MeResponse } from '@features/auth/data/schemas/authSchema';

export const AuthMapper = {
  toDomain(res: MeResponse): User {
    return {
      id: res.data.user.id,
      email: res.data.user.email,
      name: res.data.user.name,
      // Se puede mapear avatar si el backend lo empieza a proveer
    };
  },
};
