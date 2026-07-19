/** @type {import('tailwindcss').Config} */
// Fuente canónica de tokens para estilos por className (NativeWind).
// Mantener en sync con src/shared/theme/tokens/*.ts (usados en estilos imperativos).
module.exports = {
  // 'media': los --color-* de global.css siguen el esquema del SO por defecto.
  // El override manual (Ajustes → Tema) NO usa el `dark:`/class de NativeWind
  // (colorScheme.set() solo alterna una clase en web, no re-evalúa los valores
  // de @media en 'system', y en general no hay selector `.dark` real en RN) —
  // en su lugar, @core/theme inyecta los --color-* vía `vars()` en el root,
  // que tiene prioridad sobre @media. Ver ThemeVarsProvider.
  darkMode: 'media',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F1F8F4',
          100: '#DCEFE2',
          300: '#9BCFAE',
          500: '#4F9E6B',
          600: '#3D7F54',
          700: '#2E6240',
          900: '#1A3A26',
        },
        accent: { 400: '#FF9D6C', 500: '#FF7A47', 600: '#E85F2C' },
        success: { 100: '#DCF5E3', 500: '#22A357', 700: '#15723D' },
        warning: { 100: '#FFF3DC', 500: '#E8A93D', 700: '#A8731D' },
        danger: { 100: '#FDE2E1', 500: '#E5483F', 700: '#A82E27' },
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAF8',
          100: '#F2F1ED',
          200: '#E4E2DB',
          400: '#9C988E',
          600: '#5C594F',
          800: '#332F28',
          950: '#171510',
        },
        // Semánticos — resuelven light/dark vía CSS vars (ver src/global.css).
        // Uso: bg-base, bg-surface, bg-surface-2, text-foreground, text-muted,
        //      text-faint, text-emphasis, bg-chip, border-line, border-line-strong.
        base: 'rgb(var(--color-bg-base) / <alpha-value>)', // fondo de pantalla
        surface: 'rgb(var(--color-bg-surface) / <alpha-value>)', // tarjetas (elevado)
        'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)', // inputs / fills secundarios
        foreground: 'rgb(var(--color-text-primary) / <alpha-value>)', // texto primario
        muted: 'rgb(var(--color-text-secondary) / <alpha-value>)', // texto secundario
        faint: 'rgb(var(--color-text-faint) / <alpha-value>)', // terciario / placeholder
        emphasis: 'rgb(var(--color-emphasis) / <alpha-value>)', // texto/ícono de marca (flip)
        chip: 'rgb(var(--color-chip) / <alpha-value>)', // fondo verde suave (chips)
        'accent-soft': 'rgb(var(--color-accent-soft) / <alpha-value>)', // fondo coral suave
        'danger-soft': 'rgb(var(--color-danger-soft) / <alpha-value>)', // fondo rojo suave (logout)
        line: 'rgb(var(--color-border) / <alpha-value>)', // bordes
        'line-strong': 'rgb(var(--color-border-strong) / <alpha-value>)', // bordes visibles
      },
      fontFamily: {
        // 'sans' = default; usar font-jakarta-semibold / font-jakarta-bold para pesos
        // (no usar font-semibold/font-bold: en RN no cambian el archivo de fuente).
        sans: ['PlusJakartaSans_400Regular'],
        'jakarta-semibold': ['PlusJakartaSans_600SemiBold'],
        'jakarta-bold': ['PlusJakartaSans_700Bold'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '40px' }],
        h1: ['24px', { lineHeight: '32px' }],
        h2: ['18px', { lineHeight: '24px' }],
        body: ['16px', { lineHeight: '24px' }],
        caption: ['13px', { lineHeight: '18px' }],
        button: ['16px', { lineHeight: '20px' }],
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '10px',
        badge: '999px',
        avatar: '999px',
      },
      boxShadow: {
        card: '0px 2px 8px rgba(23, 21, 16, 0.06)',
        modal: '0px 8px 24px rgba(23, 21, 16, 0.12)',
      },
    },
  },
  plugins: [],
};
