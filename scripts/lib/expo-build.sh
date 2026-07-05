#!/usr/bin/env bash
#
# Lógica compartida de build/instalación. La cargan (source) los wrappers
# install-on-device.sh e install-on-emulator.sh, que definen BUILD_TARGET.
#
#   BUILD_TARGET=device    -> teléfono físico (usa --device)
#   BUILD_TARGET=emulator  -> emulador Android / simulador iOS (sin --device)
set -euo pipefail

c_green='\033[0;32m'; c_yellow='\033[1;33m'; c_red='\033[0;31m'; c_reset='\033[0m'
info() { printf "${c_green}▸ %s${c_reset}\n" "$1"; }
warn() { printf "${c_yellow}! %s${c_reset}\n" "$1"; }
err()  { printf "${c_red}✗ %s${c_reset}\n" "$1" >&2; }

# Raíz del proyecto = dos niveles arriba de este archivo (scripts/lib/..).
_LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$_LIB_DIR/../.." && pwd)"

# --- Node vía nvm (el proyecto exige Node >= 24) ---
setup_node() {
  cd "$ROOT"
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    # shellcheck disable=SC1091
    . "$NVM_DIR/nvm.sh"
    nvm use >/dev/null 2>&1 || nvm use 24 >/dev/null 2>&1 || true
  fi
  local major
  major="$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)"
  if [ "$major" -lt 20 ]; then
    err "Node $(node -v 2>/dev/null || echo '?') es muy viejo. Usa Node >= 24 (nvm use 24)."
    exit 1
  fi
  info "Node $(node -v)"
}

# Instala expo-dev-client si falta (solo se necesita para DEV builds).
ensure_dev_client() {
  if ! node -e "require.resolve('expo-dev-client')" >/dev/null 2>&1; then
    info "Instalando expo-dev-client (reemplazo de Expo Go)…"
    npx expo install expo-dev-client
  fi
}

_has_android_target() {
  [ -n "$(adb devices | sed -n '2,$p' | awk '$2=="device"{print $1}')" ]
}

_build_android() {
  local release="$1"
  if ! command -v adb >/dev/null 2>&1; then
    err "adb no está en el PATH. Instala Android SDK / Platform-Tools."
    exit 1
  fi

  local device_flag=""
  if [ "$BUILD_TARGET" = "device" ]; then
    device_flag="--device"
    _has_android_target || warn "No detecto un dispositivo Android por adb. Conéctalo con 'Depuración USB' activada."
  else
    _has_android_target || warn "No hay emulador Android corriendo; Expo intentará seleccionar/arrancar uno."
  fi

  if [ "$release" -eq 1 ]; then
    info "Android ($BUILD_TARGET): build RELEASE e instalación…"
    # shellcheck disable=SC2086
    npx expo run:android $device_flag --variant release
  else
    ensure_dev_client
    info "Android ($BUILD_TARGET): DEV build (dev-client) e instalación…"
    # shellcheck disable=SC2086
    npx expo run:android $device_flag
  fi
}

_build_ios() {
  local release="$1"
  if [ "$(uname)" != "Darwin" ]; then
    err "Los builds de iOS requieren macOS."
    exit 1
  fi
  if ! command -v xcodebuild >/dev/null 2>&1; then
    err "Xcode no está instalado (falta xcodebuild)."
    exit 1
  fi

  local device_flag=""
  [ "$BUILD_TARGET" = "device" ] && device_flag="--device"
  # El simulador NO requiere firma; el dispositivo físico sí (Apple ID en Xcode).

  local config_flag=""
  [ "$release" -eq 1 ] && config_flag="--configuration Release"

  if [ "$release" -eq 1 ]; then
    info "iOS ($BUILD_TARGET): build RELEASE e instalación…"
  else
    ensure_dev_client
    info "iOS ($BUILD_TARGET): DEV build (dev-client) e instalación…"
  fi
  # shellcheck disable=SC2086
  npx expo run:ios $device_flag $config_flag
}

# run_expo_build <android|ios|both> [--release]
run_expo_build() {
  : "${BUILD_TARGET:?BUILD_TARGET no definido (device|emulator)}"

  local platform="${1:-}"
  shift || true
  local release=0
  for arg in "$@"; do
    case "$arg" in
      --release) release=1 ;;
      *) warn "Argumento ignorado: $arg" ;;
    esac
  done

  case "$platform" in
    android) setup_node; _build_android "$release" ;;
    ios)     setup_node; _build_ios "$release" ;;
    both)    setup_node; _build_android "$release"; _build_ios "$release" ;;
    *) err "Uso: <android|ios|both> [--release]"; exit 1 ;;
  esac

  info "Listo."
  [ "$release" -eq 0 ] && info "DEV build: arranca Metro con  →  npx expo start --dev-client"
  return 0
}
