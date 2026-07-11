#!/usr/bin/env bash
#
# Compila e instala la app en un TELÉFONO FÍSICO conectado por USB
# (reemplaza a Expo Go). Usa el flag --device de Expo.
#
# Uso:
#   ./scripts/install-on-device.sh android            # dev build -> Android conectado
#   ./scripts/install-on-device.sh ios                # dev build -> iPhone conectado
#   ./scripts/install-on-device.sh both
#   ./scripts/install-on-device.sh android --release  # APK release standalone
#   ./scripts/install-on-device.sh ios --release
#
# Requisitos:
#   - Node >= 24 (usa nvm/.nvmrc).
#   - Android: Android SDK + adb; teléfono con "Depuración USB" activada.
#   - iOS:     macOS + Xcode + Apple ID en Xcode (FIRMA obligatoria); iPhone confiado.
#   - Un DEV build arranca Metro solo, al final, en esta misma terminal
#     (Ctrl+C para salir). No hace falta correr `expo start` aparte.
set -euo pipefail

export BUILD_TARGET=device
# shellcheck source=lib/expo-build.sh
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/expo-build.sh"
run_expo_build "$@"
