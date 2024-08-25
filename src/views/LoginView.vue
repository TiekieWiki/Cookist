<template>
  <main class="two-columns">
    <article>
      <h2>{{ $t('loginPage.login') }}</h2>
      <form>
        <input
          type="text"
          :placeholder="$t('loginPage.email')"
          v-model="emailLogin"
          name="emailLogin"
          autocomplete="email"
          :aria-label="$t('loginPage.ariaLabel.emailLogin')"
        />
        <input
          type="password"
          :placeholder="$t('loginPage.password')"
          v-model="passwordLogin"
          name="passwordLogin"
          autocomplete="current-password"
          :aria-label="$t('loginPage.ariaLabel.passwordLogin')"
        />
        <p v-if="errorMessageLogin">
          {{ $t(errorMessageLogin) }}
        </p>
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
        <input
          type="text"
          :placeholder="$t('loginPage.email')"
          v-model="emailRegister"
          name="emailRegister"
          autocomplete="email"
          :aria-label="$t('loginPage.ariaLabel.emailRegister')"
        />
        <input
          type="password"
          :placeholder="$t('loginPage.password')"
          v-model="passwordRegister"
          name="passwordRegister"
          autocomplete="new-password"
          :aria-label="$t('loginPage.ariaLabel.passwordRegister')"
        />
        <p v-if="errorMessageRegister">
          {{ $t(errorMessageRegister) }}
        </p>
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

/** Register */
const emailRegister = ref<string>('');
const passwordRegister = ref<string>('');
const { errorMessageRegister, register } = useRegister();

function handleRegister() {
  register(emailRegister.value, passwordRegister.value);
}

/** Login */
const emailLogin = ref<string>('');
const passwordLogin = ref<string>('');
const { errorMessageLogin, login } = useLogin();

function handleLogin() {
  login(emailLogin.value, passwordLogin.value);
}
</script>
