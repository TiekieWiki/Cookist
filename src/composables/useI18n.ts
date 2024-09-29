import i18n from "@/i18n";

/**
 * Set the user's language based on the user's language in the database
 */
export async function useSetUserLanguage(language: string) {
  i18n.global.locale.value = language;
}

/**
 * Set the system language to English
 */
export async function useSetSystemLanguage() {
  i18n.global.locale.value = "en";
}
