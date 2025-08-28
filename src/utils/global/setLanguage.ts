import i18n, { lazyLoadLocaleMessages } from '@/i18n/index';

/**
 * Set the user's language based on the user's language in the database
 */
export async function setUserLanguage(language: string): Promise<void> {
  i18n.global.locale.value = language;
  lazyLoadLocaleMessages(i18n.global.locale.value);
}

/**
 * Set the system language to the user's language
 */
export async function setSystemLanguage(): Promise<void> {
  navigator.language.includes('nl')
    ? (i18n.global.locale.value = 'nl')
    : navigator.language.includes('en')
      ? (i18n.global.locale.value = 'en')
      : (i18n.global.locale.value = 'en');
}
