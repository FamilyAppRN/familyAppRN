/**
 * @react-native-firebase/app usa módulos nativos de iOS/Android; no corre en
 * react-native-web. No-op en este target (evita importar el paquete nativo
 * desde el bundle de web).
 */
export function initFirebase(): void {}
