import { createI18n } from 'vue-i18n';
import { en } from './locales/en';
import { nl } from './locales/nl';
import { nextTick } from 'vue';

// Create a new instance of the i18n plugin
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    nl
  }
});

export default i18n;

/**
 * Lazy load locale messages
 * @param locale - The locale to load
 */
export async function lazyLoadLocaleMessages(locale: string) {
  if (!(i18n.global.availableLocales as string[]).includes(locale)) {
    const messages = await import(`@/i18n/locales/${locale}.ts`);
    i18n.global.setLocaleMessage(locale, messages.default);
  }
  i18n.global.locale.value = locale as typeof i18n.global.locale.value;

  return nextTick();
}
