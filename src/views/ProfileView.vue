<template>
  <main>
    <SettingsCard />
    <AccountCard v-model:deleteOpen="deleteAccountOpen" />
  </main>
  <ConfirmPopUp
    :title="$t('profilePage.deleteAccount')"
    :section="$t('profilePage.confirmDelete')"
    :cancel="'profilePage.cancel'"
    :confirm="'profilePage.delete'"
    v-model:openPopUp="deleteAccountOpen"
    @confirm="deleteAccount()"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { deleteAccount } from '@/utils/profile/deleteAccount';
import SettingsCard from '@/components/profile/SettingsCard.vue';
import AccountCard from '@/components/profile/AccountCard.vue';
import ConfirmPopUp from '@/components/form/ConfirmPopUp.vue';

// Delete account
const deleteAccountOpen = ref<boolean>(false);
</script>
