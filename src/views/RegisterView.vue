<template>
  <main class="register">
    <article class="row">
      <section class="card">
        <h2>{{ $t('registerPage.title') }}</h2>
        <form>
          <InputField
            name="emailRegister"
            :placeholder="$t('loginPage.placeholder.email')"
            :ariaLabel="$t('loginPage.ariaLabel.emailRegister')"
            type="email"
            :autocomplete="AutoCompleteVariant.EMAIL"
            v-model:input="email"
          />
          <InputField
            name="passwordRegister"
            :placeholder="$t('loginPage.placeholder.password')"
            :ariaLabel="$t('loginPage.ariaLabel.passwordRegister')"
            type="password"
            :autocomplete="AutoCompleteVariant.NEW_PASSWORD"
            v-model:input="password"
          />
          <ErrorMessage v-model:message="errorMessagePasswordRegister" />
          <Button
            @click.prevent="handleRegister"
            :type="ButtonType.SUBMIT"
            :variant="ColorVariant.SECONDARY"
          >
            {{ $t('registerPage.title') }}
          </Button>
          <p>
            {{ $t('registerPage.alreadyAccount') }}
            <router-link to="/login" tabindex="0" :class="ColorVariant.SECONDARY">{{
              $t('registerPage.signIn')
            }}</router-link>
          </p>
        </form>
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePasswordRegister } from '@/composables/useAuthentication';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import InputField from '@/components/form/InputField.vue';
import { AutoCompleteVariant, ButtonType, ColorVariant } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';

const email = ref<string>('');
const password = ref<string>('');
const { errorMessagePasswordRegister, passwordRegister } = usePasswordRegister();

/**
 * Handle the register button click
 */
function handleRegister(): void {
  passwordRegister(email.value, password.value);
}
</script>
