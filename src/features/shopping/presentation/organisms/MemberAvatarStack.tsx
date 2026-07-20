import { View } from 'react-native';

import { Avatar } from '@shared/ui/molecules/Avatar';
import type { ResolvedMember } from '@features/household/useHouseholdMembers';

interface MemberAvatarStackProps {
  members: ResolvedMember[];
  /** Cuántos mostrar antes de cortar (evita desbordar el header). */
  max?: number;
}

/** Avatares del hogar superpuestos, para la cabecera. */
export function MemberAvatarStack({ members, max = 3 }: MemberAvatarStackProps) {
  if (members.length === 0) return null;

  return (
    <View className="flex-row items-center">
      {members.slice(0, max).map((member, index) => (
        <View key={member.id} style={index > 0 ? { marginLeft: -10 } : undefined}>
          <Avatar name={member.name} size={30} color={member.color} />
        </View>
      ))}
    </View>
  );
}
