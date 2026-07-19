import { vars } from 'nativewind';
import { semanticColors, type ColorScheme } from '@shared/theme/tokens';

function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

/**
 * Construye el set de --color-* (mismas claves que src/global.css) para el
 * scheme dado, listo para inyectar vía `vars()` en el root de la app. Tiene
 * prioridad de cascada sobre el @media (prefers-color-scheme) de global.css,
 * así es como Ajustes → Tema puede forzar claro/oscuro sin depender del SO.
 */
export function buildThemeVars(scheme: ColorScheme) {
  const c = semanticColors[scheme];
  return vars({
    '--color-bg-base': hexToRgbTriplet(c.bgBase),
    '--color-bg-surface': hexToRgbTriplet(c.bgSurface),
    '--color-surface-2': hexToRgbTriplet(c.surface2),
    '--color-text-primary': hexToRgbTriplet(c.textPrimary),
    '--color-text-secondary': hexToRgbTriplet(c.textSecondary),
    '--color-text-faint': hexToRgbTriplet(c.textFaint),
    '--color-emphasis': hexToRgbTriplet(c.emphasis),
    '--color-chip': hexToRgbTriplet(c.chip),
    '--color-accent-soft': hexToRgbTriplet(c.accentSoft),
    '--color-danger-soft': hexToRgbTriplet(c.dangerSoft),
    '--color-border': hexToRgbTriplet(c.border),
    '--color-border-strong': hexToRgbTriplet(c.borderStrong),
  });
}
