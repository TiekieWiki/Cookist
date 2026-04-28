<template>
  <section class="card">
    <h2>{{ $t('loginPage.register') }}</h2>
    <form>
      <InputField
        name="emailRegister"
        :placeholder="$t('loginPage.placeholder.email')"
        :ariaLabel="$t('loginPage.ariaLabel.emailRegister')"
        type="email"
        :autocomplete="AutoCompleteVariant.EMAIL"
        v-model:input="emailRegister"
      />
      <InputField
        name="passwordRegister"
        :placeholder="$t('loginPage.placeholder.password')"
        :ariaLabel="$t('loginPage.ariaLabel.passwordRegister')"
        type="password"
        :autocomplete="AutoCompleteVariant.NEW_PASSWORD"
        v-model:input="passwordRegister"
      />
      <ErrorMessage v-model:message="errorMessageRegister" />
      <Button @click.prevent="handleRegister" :type="ButtonType.SUBMIT">
        {{ $t('loginPage.register') }}
      </Button>
      <Button @click.prevent="signInWithGoogle" :type="ButtonType.SUBMIT">
        {{ $t('loginPage.googleRegister') }}
      </Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { signInWithGoogle } from '@/utils/global/authentication';
import { useRegister } from '@/composables/useAuthentication';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import InputField from '@/components/form/InputField.vue';
import { AutoCompleteVariant, ButtonType } from '@/utils/types/enums';
import Button from '../form/Button.vue';

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
