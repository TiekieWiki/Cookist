<template>
  <main class="two-columns">
    <article>
      <h2>{{ $t('loginPage.login') }}</h2>
      <form>
        <input-field
          name="emailLogin"
          :placeholder="$t('loginPage.email')"
          :ariaLabel="$t('loginPage.ariaLabel.emailLogin')"
          type="text"
          autocomplete="email"
          v-model:input="emailLogin"
        />
        <input-field
          name="passwordLogin"
          :placeholder="$t('loginPage.password')"
          :ariaLabel="$t('loginPage.ariaLabel.passwordLogin')"
          type="password"
          autocomplete="current-password"
          v-model:input="passwordLogin"
        />
        <error-message v-model:message="errorMessageLogin" />
        <button @click.prevent="handleLogin" type="submit">
          {{ $t('loginPage.login') }}
        </button>
        <button @click.prevent="signInWithGoogle" type="submit">
          {{ $t('loginPage.googleLogin') }}
        </button>
      </form>
    </article>
    <article>
      <h2>{{ $t('loginPage.register') }}</h2>
      <form>
        <input-field
          name="emailRegister"
          :placeholder="$t('loginPage.email')"
          :ariaLabel="$t('loginPage.ariaLabel.emailRegister')"
          type="email"
          autocomplete="email"
          v-model:input="emailRegister"
        />
        <input-field
          name="passwordRegister"
          :placeholder="$t('loginPage.password')"
          :ariaLabel="$t('loginPage.ariaLabel.passwordRegister')"
          type="password"
          autocomplete="new-password"
          v-model:input="passwordRegister"
        />
        <error-message v-model:message="errorMessageRegister" />
        <button @click.prevent="handleRegister" type="submit">
          {{ $t('loginPage.register') }}
        </button>
        <button @click.prevent="signInWithGoogle" type="submit">
          {{ $t('loginPage.googleRegister') }}
        </button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithGoogle } from '@/utils/authentication';
import { useLogin, useRegister } from '@/composables/useAuthentication';
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
