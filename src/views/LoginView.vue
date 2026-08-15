<template>
  <main class="login">
    <article class="banner">
      <div class="title">
        <h2>
          {{ $t('loginPage.banner.title') }}
        </h2>
        <p>
          {{ $t('loginPage.banner.subtitle') }}
        </p>
      </div>
      <p class="quote">{{ $t('loginPage.banner.quote') }}</p>
    </article>
    <article class="loginForm">
      <section>
        <div>
          <h2>
            {{ isRegistering ? $t('loginPage.register.title') : $t('loginPage.login.title') }}
          </h2>
          <p>
            {{ isRegistering ? $t('loginPage.register.subtitle') : $t('loginPage.login.subtitle') }}
          </p>
        </div>
        <Switch
          :textLeft="$t('loginPage.login.toggle')"
          :textRight="$t('loginPage.register.toggle')"
          v-model:input="isRegistering"
        />
        <form>
          <InputField
            name="email"
            :label="$t('loginPage.email')"
            :placeholder="$t('loginPage.placeholder.email')"
            :ariaLabel="$t('loginPage.ariaLabel.email')"
            type="text"
            :autocomplete="AutoCompleteVariant.EMAIL"
            v-model:input="email"
          />
          <InputField
            name="password"
            :label="$t('loginPage.password')"
            :placeholder="$t('loginPage.placeholder.password')"
            :ariaLabel="$t('loginPage.ariaLabel.password')"
            type="password"
            :autocomplete="AutoCompleteVariant.CURRENT_PASSWORD"
            v-model:input="password"
          />
          <ErrorMessage v-model:message="loginErrorMessage" />
          <ErrorMessage v-model:message="registerErrorMessage" />
          <Button
            @click.prevent="handleLogin"
            :type="ButtonType.SUBMIT"
            :variant="ColorVariant.PRIMARY"
            :size="Size.LARGE"
          >
            {{ isRegistering ? $t('loginPage.register.button') : $t('loginPage.login.button') }}
          </Button>
        </form>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { usePasswordLogin, usePasswordRegister } from '@/composables/useAuthentication';
import { ref } from 'vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import InputField from '@/components/form/InputField.vue';
import { AutoCompleteVariant, ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';
import Switch from '@/components/general/Switch.vue';

const isRegistering = ref<boolean>(false);
const email = ref<string>('');
const password = ref<string>('');
const { errorMessage: loginErrorMessage, passwordLogin } = usePasswordLogin();
const { errorMessage: registerErrorMessage, passwordRegister } = usePasswordRegister();

/**
 * Handle the login button click
 */
function handleLogin(): void {
  if (isRegistering.value) {
    passwordRegister(email.value, password.value);
  } else {
    passwordLogin(email.value, password.value);
  }
}
</script>
