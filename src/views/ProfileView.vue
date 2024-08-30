<template>
  <main class="two-columns">
    <article>
      <h2>{{ $t('profilePage.settings') }}</h2>
      <form>
        <select-field
          :ariaLabel="$t('profilePage.ariaLabel.language')"
          :items="languages"
          v-model:selected="selectedLanguage"
        />
        <transition name="fade">
          <p v-if="successMessage" class="success">{{ successMessage }}</p>
        </transition>
        <button @click="saveSettings" type="button">
          {{ $t('profilePage.save') }}
        </button>
      </form>
    </article>
    <article>
      <h2>{{ $t('profilePage.account') }}</h2>
      <form>
        <input-field
          name="profileEmail"
          :placeholder="auth.currentUser?.email ?? ''"
          :ariaLabel="$t('profilePage.ariaLabel.userEmail')"
          type="email"
          :disabled="true"
          autocomplete="email"
        />
        <button @click="handleSignOut" type="button">
          {{ $t('profilePage.logout') }}
        </button>
      </form>
    </article>
  </main>
</template>

<script setup lang="ts">
import { useSuccessTransition } from '@/composables/useSuccess';
import i18n from '@/i18n';
import { getData, updateData } from '@/utils/db';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { ref, onMounted, watch } from 'vue';
import { handleSignOut } from '@/utils/authentication';
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';

const auth = getAuth();

// Set language dropdown to user language
const languages = [
  { value: 'system', label: 'profilePage.languages.system' },
  { value: 'en', label: 'profilePage.languages.english' },
  { value: 'nl', label: 'profilePage.languages.dutch' }
];
const selectedLanguage = ref<{ value: string; label: string }>(languages[0]);

// Get user from database and set dropdowns to user settings
onMounted(async () => {
  try {
    const users = await getData('users', where('id', '==', auth.currentUser?.uid));
    if (users.length > 0) {
      selectedLanguage.value = users[0].language;
    }
  } catch (error: any) {
    alert(error.message);
  }
});

// Watch for changes in selected language and update i18n
watch(selectedLanguage, (newLanguage) => {
  i18n.global.locale.value = newLanguage;
});

// Save settings to database
const successMessage = ref<string>('');

function saveSettings() {
  const user = {
    language: selectedLanguage.value
  };

  try {
    updateData('users', where('id', '==', auth.currentUser?.uid), user);
    useSuccessTransition(successMessage, 'profilePage.saveSuccess');
  } catch (error: any) {
    alert(error.message);
  }
}
</script>
