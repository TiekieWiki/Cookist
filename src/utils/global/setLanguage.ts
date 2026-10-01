import { getSystemLanguage, setLocale } from '@/i18n/index';
import type { Language } from '@/utils/types/enums';
import type { Profile } from '@/utils/types/profile';

export { getSystemLanguage };

/**
 * Set the user's language based on the user's language in the database
 * @param language The language to set
 */
export async function setUserLanguage(language: Profile['language']): Promise<void> {
  await setLocale(language as Language);
}

/**
 * Set the system language to the user's language
 */
export async function setSystemLanguage(): Promise<void> {
  await setUserLanguage(getSystemLanguage());
}
