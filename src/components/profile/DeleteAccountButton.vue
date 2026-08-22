<template>
  <Button
    @click="deleteOpen = true"
    :type="ButtonType.BUTTON"
    :variant="ColorVariant.TERTIARY"
    :size="Size.LARGE"
  >
    <font-awesome-icon :icon="['fas', 'trash-can']" />
    {{ $t('profilePage.deleteAccount') }}
  </Button>
  <ConfirmPopUp
    :title="$t('profilePage.deleteAccount')"
    :section="$t('profilePage.confirmDelete')"
    :cancel="'profilePage.cancel'"
    :confirm="'profilePage.delete'"
    v-model:openPopUp="deleteOpen"
    @confirm="deleteUserAccount()"
  />
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore';
import { ref } from 'vue';
import { useLogout } from '@/composables/useAuthentication.js';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import ConfirmPopUp from '@/components/general/ConfirmPopUp.vue';

const userStore = useUserStore();
const deleteOpen = ref<boolean>(false);

/**
 * Delete the user account and log out the user
 */
async function deleteUserAccount(): Promise<void> {
  await userStore.deleteUser();

  deleteOpen.value = false;

  if (!userStore.errorMessage) {
    await useLogout();
  }
}
</script>
