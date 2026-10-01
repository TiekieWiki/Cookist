import { watchEffect } from 'vue';
import { createI18n } from 'vue-i18n';
import { Language } from '@/utils/types/enums';

export type TranslationNamespace =
  | 'general'
  | 'home'
  | 'login'
  | 'profile'
  | 'recipes'
  | 'recipe'
  | 'editRecipe'
  | 'groceryList'
  | 'notFound';

const loaders = import.meta.glob<{ default: Record<string, unknown> }>('./locales/*/*.ts');
const loading = new Map<string, Promise<void>>();
const requested = new Set<TranslationNamespace>(['general']);

/**
 * Get the supported language that matches the browser's language
 * @returns {Language} Dutch for Dutch browsers, English otherwise
 */
export function getSystemLanguage(): Language {
  return navigator.language.startsWith(Language.NL) ? Language.NL : Language.EN;
}

const i18n = createI18n({
  legacy: false,
  locale: getSystemLanguage(),
  fallbackLocale: Language.EN,
  globalInjection: true
});

/**
 * Load the translations of a namespace in a language, once
 * @param locale Language to load
 * @param namespace Translation file to load
 */
function loadNamespace(locale: Language, namespace: TranslationNamespace): Promise<void> {
  const key = `${locale}/${namespace}`;
  const cached = loading.get(key);
  if (cached) return cached;

  const promise = loaders[`./locales/${key}.ts`]()
    .then((module) => {
      i18n.global.mergeLocaleMessage(locale, module.default);
    })
    .catch((error) => {
      loading.delete(key);
      throw error;
    });

  loading.set(key, promise);
  return promise;
}

/**
 * Load translation files in the current language. They are remembered, so they are also loaded
 * when the language changes.
 * @param namespaces Translation files to load
 */
export async function loadTranslations(namespaces: TranslationNamespace[]): Promise<void> {
  namespaces.forEach((namespace) => requested.add(namespace));

  const locale = i18n.global.locale.value as Language;
  await Promise.all(namespaces.map((namespace) => loadNamespace(locale, namespace)));
}

/**
 * Switch language after the translation files in use are loaded in that language, so the page
 * never shows missing translations
 * @param locale Language to switch to
 */
export async function setLocale(locale: Language): Promise<void> {
  let namespaces: TranslationNamespace[];

  do {
    namespaces = [...requested];
    await Promise.all(namespaces.map((namespace) => loadNamespace(locale, namespace)));
  } while (requested.size !== namespaces.length);

  i18n.global.locale.value = locale;
}

watchEffect(() => {
  document.documentElement.lang = i18n.global.locale.value;
});

export default i18n;
