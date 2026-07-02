/**
 * Sets the color scheme of the application
 * @param colorScheme - The color scheme to set ('light' or 'dark').
 */
export function setColorScheme(colorScheme: 'light' | 'dark'): void {
  if (colorScheme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
}

/**
 * Sets the handedness of the application
 * @param handedness - The handedness to set ('left', 'right' or 'ambidextrous').
 */
export function setHandedness(handedness: 'left' | 'right' | 'ambidextrous'): void {
  if (handedness === 'left') {
    document.documentElement.classList.add('left');
  } else {
    document.documentElement.classList.remove('left');
  }
}
