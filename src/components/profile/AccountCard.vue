<template>
  <section>
    <div>
      <h2>{{ $t('profilePage.account') }}</h2>
      <div>
        <Button :type="ButtonType.BUTTON" :iconOnly="true" :variant="ColorVariant.WARNING">
          <font-awesome-icon @click="deleteOpen = true" :icon="['fas', 'trash-can']" />
        </Button>
      </div>
    </div>
    <form>
      <InputField
        name="profileEmail"
        :variant="ColorVariant.PRIMARY"
        :placeholder="email"
        :ariaLabel="$t('profilePage.ariaLabel.userEmail')"
        type="email"
        :disabled="true"
        :autocomplete="AutoCompleteVariant.EMAIL"
      />
      <ErrorMessage v-model:message="userStore.errorMessage" />
      <Button @click="useLogout" :type="ButtonType.BUTTON" :variant="ColorVariant.SECONDARY">
        {{ $t('profilePage.logout') }}
      </Button>
    </form>
  </section>
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
import InputField from '@/components/form/InputField.vue';
import { AutoCompleteVariant, ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from '../form/Button.vue';
import { useLogout } from '@/composables/useAuthentication.js';
import { onMounted, ref } from 'vue';
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import { useUserStore } from '@/stores/useUserStore';

const userStore = useUserStore();
const deleteOpen = ref<boolean>(false);
const email = ref<string>('');

onMounted(async () => {
  if (userStore.user) {
    email.value = userStore.user.email ?? '';
  }
});

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
