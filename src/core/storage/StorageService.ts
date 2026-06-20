import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Wrapper delgado sobre AsyncStorage. Es el único punto de la app que
 * habla con AsyncStorage directamente.
 */
export class StorageService {
  get(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }
  set(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }
  remove(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
  clear(): Promise<void> {
    return AsyncStorage.clear();
  }
}
