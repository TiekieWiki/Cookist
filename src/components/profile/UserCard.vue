<template>
  <section class="title">
    <div class="user">
      <h3 class="userBrand">{{ email.slice(0, 1).toLocaleUpperCase() }}</h3>
      <div class="userName">
        <h2>{{ email.split('@')[0] }}</h2>
        <p>{{ email }}</p>
      </div>
    </div>
    <div class="actions">
      <Button
        @click="useLogout"
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.SECONDARY"
        :size="Size.LARGE"
      >
        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
        {{ $t('profilePage.logout') }}
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore';
import { onMounted, ref } from 'vue';
import { useLogout } from '@/composables/useAuthentication.js';
import { ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import Button from '../form/Button.vue';

const userStore = useUserStore();
const email = ref<string>('');

onMounted(async () => {
  if (userStore.user) {
    email.value = userStore.user.email ?? '';
  }
});
</script>
