import i18n from '@/i18n/index';
import type { Ref } from 'vue';

/**
 * Set success message and clear it after 5 seconds
 * @param successMessage Success message ref
 * @param messageHandle Message handle
 */
export const useSuccessTransition = (successMessage: Ref<string>, messageHandle: string): void => {
  successMessage.value = i18n.global.t(messageHandle);
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};
