import { createI18n } from 'vue-i18n';
import { en } from './locales/en.ts';
import { nextTick } from 'vue';

// Create a new instance of the i18n plugin
const i18n = createI18n({
  legacy: false,
  locale: import.meta.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  globalInjection: true,
  messages: {
    en
  }
});

export default i18n;

// Lazy load locale messages
export async function lazyLoadLocaleMessages(locale: string) {
  if (!i18n.global.availableLocales.includes(locale)) {
    const messages = await import(`@/i18n/locales/${locale}.ts`);
    i18n.global.setLocaleMessage(locale, messages.default);
  }

  return nextTick();
}
