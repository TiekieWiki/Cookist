<template>
  <section class="card">
    <div class="header">
      <h2>{{ $t('profilePage.account') }}</h2>
      <div class="actions">
        <Button :type="ButtonType.BUTTON" :iconOnly="true" :variant="ColorVariant.WARNING">
          <font-awesome-icon @click="deleteOpen = true" :icon="['fas', 'trash-can']" />
        </Button>
      </div>
    </div>
    <form>
      <InputField
        name="profileEmail"
        :variant="ColorVariant.PRIMARY"
        :placeholder="getAuth().currentUser?.email ?? ''"
        :ariaLabel="$t('profilePage.ariaLabel.userEmail')"
        type="email"
        :disabled="true"
        :autocomplete="AutoCompleteVariant.EMAIL"
      />
      <Button @click="useLogout" :type="ButtonType.BUTTON" :variant="ColorVariant.SECONDARY">
        {{ $t('profilePage.logout') }}
      </Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import InputField from '@/components/form/InputField.vue';
import { AutoCompleteVariant, ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from '../form/Button.vue';
import { useLogout } from '@/composables/useAuthentication.js';

const deleteOpen = defineModel<boolean>('deleteOpen', { required: true });
</script>
