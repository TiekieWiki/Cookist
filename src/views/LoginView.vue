<template>
  <main class="two-columns">
    <article>
      <h2>{{ $t('loginPage.login') }}</h2>
      <form>
        <text-input
          name="emailLogin"
          :placeholder="$t('loginPage.email')"
          :ariaLabel="$t('loginPage.ariaLabel.emailLogin')"
          type="text"
          autocomplete="email"
          v-model="emailLogin"
        />
        <text-input
          name="passwordLogin"
          :placeholder="$t('loginPage.password')"
          :ariaLabel="$t('loginPage.ariaLabel.passwordLogin')"
          type="password"
          autocomplete="current-password"
          v-model="passwordLogin"
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
        <text-input
          name="emailRegister"
          :placeholder="$t('loginPage.email')"
          :ariaLabel="$t('loginPage.ariaLabel.emailRegister')"
          type="email"
          autocomplete="email"
          v-model="emailRegister"
        />
        <text-input
          name="passwordRegister"
          :placeholder="$t('loginPage.password')"
          :ariaLabel="$t('loginPage.ariaLabel.passwordRegister')"
          type="password"
          autocomplete="new-password"
          v-model="passwordRegister"
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
import TextInput from '@/components/form/TextInput.vue';

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
