<template>
  <main class="login">
    <article class="row">
      <section class="card">
        <h2>{{ $t('loginPage.login') }}</h2>
        <form>
          <InputField
            name="emailLogin"
            :placeholder="$t('loginPage.placeholder.email')"
            :ariaLabel="$t('loginPage.ariaLabel.emailLogin')"
            type="text"
            :autocomplete="AutoCompleteVariant.EMAIL"
            v-model:input="email"
          />
          <InputField
            name="passwordLogin"
            :placeholder="$t('loginPage.placeholder.password')"
            :ariaLabel="$t('loginPage.ariaLabel.passwordLogin')"
            type="password"
            :autocomplete="AutoCompleteVariant.CURRENT_PASSWORD"
            v-model:input="password"
          />
          <ErrorMessage v-model:message="errorMessage" />
          <Button
            @click.prevent="handleLogin"
            :type="ButtonType.SUBMIT"
            :variant="ColorVariant.SECONDARY"
          >
            {{ $t('loginPage.login') }}
          </Button>
          <p>
            {{ $t('loginPage.noAccount') }}
            <router-link to="/register" tabindex="0" :class="ColorVariant.SECONDARY">{{
              $t('loginPage.signUp')
            }}</router-link>
          </p>
        </form>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { usePasswordLogin } from '@/composables/useAuthentication';
import { ref } from 'vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import InputField from '@/components/form/InputField.vue';
import { AutoCompleteVariant, ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';

const email = ref<string>('');
const password = ref<string>('');
const { errorMessage, passwordLogin } = usePasswordLogin();

/**
 * Handle the login button click
 */
function handleLogin(): void {
  passwordLogin(email.value, password.value);
}
</script>
