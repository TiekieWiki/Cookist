import { watchEffect } from 'vue';
import { createI18n } from 'vue-i18n';
import { en } from './locales/en';
import { nl } from './locales/nl';

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

watchEffect(() => {
  document.documentElement.lang = i18n.global.locale.value;
});

export default i18n;
