import { createI18n, type LocaleMessages, type VueMessageType } from 'vue-i18n';

/**
 * Load locale messages
 */
async function loadLocaleMessages(): Promise<{ [x: string]: LocaleMessages<VueMessageType> }> {
  const messages: { [x: string]: LocaleMessages<VueMessageType> } = {};

  // List of all locales
  const locales = ['en', 'nl'];

  // Iterate over each locale
  for (const locale of locales) {
    messages[locale] = messages[locale] || {};

    // List of files for each locale
    const files = ['all', 'home', 'recipes', 'login'];

    // Dynamically import each JSON file
    for (const file of files) {
      const module = await import(`./locales/${locale}/${file}.json`);
      messages[locale] = { ...messages[locale], ...module.default };
    }
  }

  return messages;
}

export default createI18n({
  legacy: false,
  locale: import.meta.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: await loadLocaleMessages()
});
