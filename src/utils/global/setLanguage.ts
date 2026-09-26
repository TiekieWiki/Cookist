import i18n from '@/i18n/index';
import { Language } from '@/utils/types/enums';

/**
 * Get the supported language that matches the browser's language
 * @returns {Language} Dutch for Dutch browsers, English otherwise
 */
export function getSystemLanguage(): Language {
  return navigator.language.startsWith(Language.NL) ? Language.NL : Language.EN;
}

/**
 * Set the user's language based on the user's language in the database
 * @param language The language to set
 */
export function setUserLanguage(language: Language): void {
  i18n.global.locale.value = language;
}

/**
 * Set the system language to the user's language
 */
export function setSystemLanguage(): void {
  setUserLanguage(getSystemLanguage());
}
