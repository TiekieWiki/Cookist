<template>
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
      <form novalidate>
        <InputField
          id="email"
          name="email"
          :label="$t('loginPage.email')"
          :placeholder="$t('loginPage.placeholder.email')"
          :ariaLabel="$t('loginPage.ariaLabel.email')"
          type="email"
          :autocomplete="AutoCompleteVariant.EMAIL"
          :error="fieldErrors.email"
          v-model:input="email"
        />
        <InputField
          id="password"
          name="password"
          :label="$t('loginPage.password')"
          :placeholder="$t('loginPage.placeholder.password')"
          :ariaLabel="$t('loginPage.ariaLabel.password')"
          type="password"
          :autocomplete="
            isRegistering ? AutoCompleteVariant.NEW_PASSWORD : AutoCompleteVariant.CURRENT_PASSWORD
          "
          :error="fieldErrors.password"
          v-model:input="password"
        />
        <ErrorMessage :error="formError" />
        <Button
          @click.prevent="submit(isRegistering, email, password)"
          :disabled="isSubmitting"
          :aria-busy="isSubmitting"
          :type="ButtonType.SUBMIT"
          :variant="ColorVariant.PRIMARY"
          :size="Size.LARGE"
        >
          {{ isRegistering ? $t('loginPage.register.button') : $t('loginPage.login.button') }}
        </Button>
        <p class="small">{{ $t('loginPage.policy') }}</p>
      </form>
    </section>
  </article>
</template>

<script setup lang="ts">
import { useAuthentication } from '@/composables/useAuthentication';
import { ref, watch } from 'vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import InputField from '@/components/form/InputField.vue';
import { AutoCompleteVariant, ButtonType, ColorVariant, Size } from '@/utils/types/enums';
import Button from '@/components/form/Button.vue';
import Switch from '@/components/general/Switch.vue';

const isRegistering = ref<boolean>(false);
const email = ref<string>('');
const password = ref<string>('');
const { fieldErrors, formError, isSubmitting, submit, clearFieldError, clearAllErrors } =
  useAuthentication();

watch(email, () => clearFieldError('email'));
watch(password, () => clearFieldError('password'));
watch(isRegistering, clearAllErrors);
</script>
