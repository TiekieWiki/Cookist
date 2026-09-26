import { lazyLoadLocaleMessages } from '@/i18n/index';
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
 */
export async function setUserLanguage(language: string): Promise<void> {
  await lazyLoadLocaleMessages(language);
}

/**
 * Set the system language to the user's language
 */
export async function setSystemLanguage(): Promise<void> {
  await setUserLanguage(getSystemLanguage());
}
