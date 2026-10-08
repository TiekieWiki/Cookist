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
    title="profilePage.deleteAccount"
    section="profilePage.confirmDelete"
    cancel="general.actions.cancel"
    confirm="general.actions.delete"
    :loading="userStore.isLoadingAction('deleteUser')"
    :error="userStore.errorFor('deleteUser')"
    v-model:openPopUp="deleteOpen"
    @confirm="deleteUserAccount()"
  />
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore';
import { ref, watch } from 'vue';
import { useLogout } from '@/composables/useAuthentication.js';
import Button from '@/components/form/Button.vue';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import ConfirmPopUp from '@/components/general/ConfirmPopUp.vue';

const userStore = useUserStore();
const deleteOpen = ref<boolean>(false);

/**
 * Delete the user account and log out the user. When it fails, the pop-up stays open and shows why.
 */
async function deleteUserAccount(): Promise<void> {
  if (!(await userStore.deleteUser())) return;

  deleteOpen.value = false;
  await useLogout();
}

watch(deleteOpen, (open) => {
  if (open) userStore.clearError('deleteUser');
});
</script>
