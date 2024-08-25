import i18n from '@/i18n';
import type { Ref } from 'vue';

export const useSuccessTransition = (successMessage: Ref<string>, messageHandle: string): void => {
  successMessage.value = i18n.global.t(messageHandle);
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};
