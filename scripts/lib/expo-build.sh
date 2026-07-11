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

# Si queda un Metro corriendo de una corrida anterior (o de otra terminal),
# `expo run:*` lo detecta, lo reutiliza en vez de arrancar uno propio, y esta
# sesión termina sin logs en vivo ("Skipping dev server"). Lo liberamos antes
# de compilar para que el Metro final SIEMPRE quede en esta misma terminal.
free_metro_port() {
  local port="${EXPO_METRO_PORT:-8081}"
  local pid
  pid="$(lsof -ti:"$port" 2>/dev/null || true)"
  if [ -n "$pid" ]; then
    warn "Puerto $port ocupado por un Metro anterior — liberándolo…"
    kill -9 $pid 2>/dev/null || true
    sleep 1
  fi
}

# --- Android SDK (ANDROID_HOME) ---
# ~/.zshrc solo se carga en shells interactivos; este script puede correr en
# uno no-interactivo (CI, subprocess) donde ANDROID_HOME no llega aunque esté
# exportado ahí. Lo resolvemos nosotros mismos, con fallback a la ruta default.
ensure_android_home() {
  if [ -z "${ANDROID_HOME:-}" ] && [ -z "${ANDROID_SDK_ROOT:-}" ]; then
    for candidate in "$HOME/Library/Android/sdk" "$HOME/Android/Sdk"; do
      if [ -d "$candidate" ]; then
        export ANDROID_HOME="$candidate"
        break
      fi
    done
  fi
  : "${ANDROID_HOME:=${ANDROID_SDK_ROOT:-}}"
  if [ -n "${ANDROID_HOME:-}" ]; then
    export ANDROID_SDK_ROOT="$ANDROID_HOME"
    export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator"
    info "Android SDK: $ANDROID_HOME"
  else
    err "No encontré el Android SDK. Instálalo o exporta ANDROID_HOME manualmente."
    exit 1
  fi
}

_android_device_lines() {
  adb devices -l | sed -n '2,$p' | awk '$2=="device"'
}

_has_android_target() {
  [ -n "$(_android_device_lines)" ]
}

_build_android() {
  local release="$1"
  ensure_android_home
  if ! command -v adb >/dev/null 2>&1; then
    err "adb no está en el PATH. Instala Android SDK / Platform-Tools."
    exit 1
  fi

  # Array (no palabra-split) para el flag --device: `expo run:android --device`
  # sin valor abre un picker interactivo, que cuelga en un shell no-TTY.
  # Expo empareja por el NOMBRE de modelo (adb devices -l → model:XXX), no por
  # el serial — con un solo dispositivo lo tomamos de ahí automáticamente.
  local device_flag=()
  if [ "$BUILD_TARGET" = "device" ]; then
    local lines count model
    lines="$(_android_device_lines)"
    count="$(printf '%s\n' "$lines" | grep -c . || true)"
    if [ -n "${EXPO_ANDROID_DEVICE_NAME:-}" ]; then
      device_flag=(--device "$EXPO_ANDROID_DEVICE_NAME")
    elif [ "$count" -eq 1 ]; then
      model="$(printf '%s\n' "$lines" | grep -oE 'model:[^ ]+' | cut -d: -f2)"
      device_flag=(--device "$model")
    elif [ "$count" -eq 0 ]; then
      err "No detecto ningún dispositivo Android por adb. Conéctalo con 'Depuración USB' activada."
      exit 1
    else
      err "Hay $count dispositivos Android conectados. Especifica cuál usar:"
      printf '%s\n' "$lines" >&2
      err "EXPO_ANDROID_DEVICE_NAME=<model> npm run device:android"
      exit 1
    fi
  else
    _has_android_target || warn "No hay emulador Android corriendo; Expo intentará seleccionar/arrancar uno."
  fi

  if [ "$release" -eq 1 ]; then
    info "Android ($BUILD_TARGET): build RELEASE e instalación…"
    npx expo run:android "${device_flag[@]}" --variant release
  else
    ensure_dev_client
    info "Android ($BUILD_TARGET): DEV build (dev-client) e instalación…"
    npx expo run:android "${device_flag[@]}"
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

  [ "$release" -eq 0 ] && free_metro_port

  case "$platform" in
    android) setup_node; _build_android "$release" ;;
    ios)     setup_node; _build_ios "$release" ;;
    both)    setup_node; _build_android "$release"; _build_ios "$release" ;;
    *) err "Uso: <android|ios|both> [--release]"; exit 1 ;;
  esac

  info "Listo."

  if [ "$release" -eq 0 ]; then
    # exec (no un subproceso aparte): reemplaza este script por Metro, así
    # los logs quedan en ESTA MISMA terminal — no hace falta un 2º comando,
    # y Ctrl+C corta todo limpio.
    info "Arrancando Metro (dev client) en esta misma terminal — Ctrl+C para salir…"
    exec npx expo start --dev-client
  fi

  return 0
}
