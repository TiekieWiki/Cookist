<template>
  <section class="card">
    <h2>{{ $t('loginPage.login') }}</h2>
    <form>
      <InputField
        name="emailLogin"
        :placeholder="$t('loginPage.placeholder.email')"
        :ariaLabel="$t('loginPage.ariaLabel.emailLogin')"
        type="text"
        :autocomplete="AutoCompleteVariant.EMAIL"
        v-model:input="emailLogin"
      />
      <InputField
        name="passwordLogin"
        :placeholder="$t('loginPage.placeholder.password')"
        :ariaLabel="$t('loginPage.ariaLabel.passwordLogin')"
        type="password"
        :autocomplete="AutoCompleteVariant.CURRENT_PASSWORD"
        v-model:input="passwordLogin"
      />
      <ErrorMessage v-model:message="errorMessageLogin" />
      <Button @click.prevent="handleLogin" :type="ButtonType.SUBMIT">
        {{ $t('loginPage.login') }}
      </Button>
      <Button @click.prevent="signInWithGoogle" :type="ButtonType.SUBMIT">
        {{ $t('loginPage.googleLogin') }}
      </Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/useAuthentication';
import { ref } from 'vue';
import { signInWithGoogle } from '@/utils/global/authentication';
import ErrorMessage from '../form/ErrorMessage.vue';
import InputField from '../form/InputField.vue';
import { AutoCompleteVariant, ButtonType } from '@/utils/types/enums';
import Button from '../form/Button.vue';

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
