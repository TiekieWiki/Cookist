/**
 * Sets the color scheme of the application by adding or removing the 'dark' class on the document's root element.
 * @param colorScheme - The color scheme to set ('light' or 'dark').
 */
export function setColorScheme(colorScheme: 'light' | 'dark'): void {
  if (colorScheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
}
