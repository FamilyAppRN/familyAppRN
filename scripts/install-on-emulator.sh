#!/usr/bin/env bash
#
# Compila e instala la app en un EMULADOR Android / SIMULADOR iOS
# (reemplaza a Expo Go). NO usa --device: Expo elige el emulador/simulador.
#
# Uso:
#   ./scripts/install-on-emulator.sh android            # dev build -> emulador Android
#   ./scripts/install-on-emulator.sh ios                # dev build -> simulador iOS
#   ./scripts/install-on-emulator.sh both
#   ./scripts/install-on-emulator.sh android --release  # APK release en emulador
#   ./scripts/install-on-emulator.sh ios --release
#
# Requisitos:
#   - Node >= 24 (usa nvm/.nvmrc).
#   - Android: un emulador (AVD) corriendo o disponible + adb.
#   - iOS:     macOS + Xcode (Simulator). El simulador NO requiere firma/Apple ID.
#   - Un DEV build arranca Metro solo, al final, en esta misma terminal
#     (Ctrl+C para salir). No hace falta correr `expo start` aparte.
set -euo pipefail

export BUILD_TARGET=emulator
# shellcheck source=lib/expo-build.sh
. "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/expo-build.sh"
run_expo_build "$@"
