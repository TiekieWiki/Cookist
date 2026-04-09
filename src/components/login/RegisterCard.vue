<template>
  <article>
    <h2>{{ $t('loginPage.register') }}</h2>
    <form>
      <InputField
        name="emailRegister"
        :placeholder="$t('loginPage.placeholder.email')"
        :ariaLabel="$t('loginPage.ariaLabel.emailRegister')"
        type="email"
        autocomplete="email"
        v-model:input="emailRegister"
      />
      <InputField
        name="passwordRegister"
        :placeholder="$t('loginPage.placeholder.password')"
        :ariaLabel="$t('loginPage.ariaLabel.passwordRegister')"
        type="password"
        autocomplete="new-password"
        v-model:input="passwordRegister"
      />
      <ErrorMessage v-model:message="errorMessageRegister" />
      <button @click.prevent="handleRegister" type="submit">
        {{ $t('loginPage.register') }}
      </button>
      <button @click.prevent="signInWithGoogle" type="submit">
        {{ $t('loginPage.googleRegister') }}
      </button>
    </form>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithGoogle } from '@/utils/global/authentication';
import { useRegister } from '@/composables/useAuthentication';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import InputField from '@/components/form/InputField.vue';

// Register
const emailRegister = ref<string>('');
const passwordRegister = ref<string>('');
const { errorMessageRegister, register } = useRegister();

/**
 * Handle the register button click
 */
function handleRegister(): void {
  register(emailRegister.value, passwordRegister.value);
}
</script>
