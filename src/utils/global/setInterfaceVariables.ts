import { ColorScheme, Handedness } from '../types/enums';
import type { Profile } from '../types/profile';

/**
 * Sets the color scheme of the application
 * @param colorScheme - The color scheme to set.
 */
export function setColorScheme(colorScheme: Profile['colorscheme']): void {
  if (colorScheme === ColorScheme.LIGHT) {
    document.documentElement.classList.add(ColorScheme.LIGHT);
    document.documentElement.classList.remove(ColorScheme.DARK);
  } else {
    document.documentElement.classList.add(ColorScheme.DARK);
    document.documentElement.classList.remove(ColorScheme.LIGHT);
  }
}

/**
 * Sets the handedness of the application
 * @param handedness - The handedness to set.
 */
export function setHandedness(handedness: Profile['handedness']): void {
  if (handedness === Handedness.LEFT) {
    document.documentElement.classList.add(Handedness.LEFT);
  } else {
    document.documentElement.classList.remove(Handedness.LEFT);
  }
}

/**
 * Removes the color scheme and handedness, so the system defaults are used again
 */
export function clearInterfaceVariables(): void {
  document.documentElement.classList.remove(ColorScheme.LIGHT, ColorScheme.DARK, Handedness.LEFT);
}
