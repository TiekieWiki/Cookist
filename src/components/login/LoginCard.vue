<template>
  <article>
    <h2>{{ $t('loginPage.login') }}</h2>
    <form>
      <InputField
        name="emailLogin"
        :placeholder="$t('loginPage.placeholder.email')"
        :ariaLabel="$t('loginPage.ariaLabel.emailLogin')"
        type="text"
        autocomplete="email"
        v-model:input="emailLogin"
      />
      <InputField
        name="passwordLogin"
        :placeholder="$t('loginPage.placeholder.password')"
        :ariaLabel="$t('loginPage.ariaLabel.passwordLogin')"
        type="password"
        autocomplete="current-password"
        v-model:input="passwordLogin"
      />
      <ErrorMessage v-model:message="errorMessageLogin" />
      <button @click.prevent="handleLogin" type="submit">
        {{ $t('loginPage.login') }}
      </button>
      <button @click.prevent="signInWithGoogle" type="submit">
        {{ $t('loginPage.googleLogin') }}
      </button>
    </form>
  </article>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/useAuthentication';
import { ref } from 'vue';
import { signInWithGoogle } from '@/utils/global/authentication';
import ErrorMessage from '../form/ErrorMessage.vue';
import InputField from '../form/InputField.vue';

// Login
const emailLogin = ref<string>('');
const passwordLogin = ref<string>('');
const { errorMessageLogin, login } = useLogin();

/**
 * Handle the login button click
 */
function handleLogin(): void {
  login(emailLogin.value, passwordLogin.value);
}
</script>
