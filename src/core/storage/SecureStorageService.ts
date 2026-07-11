import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper sobre expo-secure-store (Keychain en iOS / Keystore en Android) para
 * datos SENSIBLES como los tokens de auth. Mismo contrato que StorageService.
 *
 * En web SecureStore no existe (módulo nativo vacío) → fallback a AsyncStorage
 * (localStorage). Web no es target de producción y no tiene almacén cifrado
 * de todos modos.
 *
 * OJO: las keys de SecureStore solo admiten [A-Za-z0-9._-] (sin '@').
 */
export class SecureStorageService {
  private readonly isWeb = Platform.OS === 'web';

  get(key: string): Promise<string | null> {
    return this.isWeb ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key);
  }

  set(key: string, value: string): Promise<void> {
    return this.isWeb ? AsyncStorage.setItem(key, value) : SecureStore.setItemAsync(key, value);
  }

  remove(key: string): Promise<void> {
    return this.isWeb ? AsyncStorage.removeItem(key) : SecureStore.deleteItemAsync(key);
  }
}
