<template>
  <article>
    <section class="title">
      <h2>{{ $t('profilePage.account') }}</h2>
      <div class="actions">
        <font-awesome-icon @click="deleteOpen = true" class="delete" :icon="['fas', 'trash-can']" />
      </div>
    </section>
    <form>
      <InputField
        name="profileEmail"
        :placeholder="getAuth().currentUser?.email ?? ''"
        :ariaLabel="$t('profilePage.ariaLabel.userEmail')"
        type="email"
        :disabled="true"
        autocomplete="email"
      />
      <button @click="handleSignOut" type="button">
        {{ $t('profilePage.logout') }}
      </button>
    </form>
  </article>
</template>

<script setup lang="ts">
import { getAuth } from 'firebase/auth';
import { handleSignOut } from '@/utils/global/authentication';
import InputField from '@/components/form/InputField.vue';

const deleteOpen = defineModel<boolean>('deleteOpen', { required: true });
</script>
