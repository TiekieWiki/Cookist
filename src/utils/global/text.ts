/**
 * Capitalizes the first letter of a string
 * @param text The text to capitalize
 * @returns {string} The text with the first letter capitalized
 */
export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
