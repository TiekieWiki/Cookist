<template>
  <article>
    <h2>{{ $t('profilePage.settings') }}</h2>
    <form>
      <SelectField
        :ariaLabel="$t('profilePage.ariaLabel.language')"
        :items="languages"
        labelPrefix="profilePage.languages."
        v-model:selected="selectedLanguage"
      />
      <SelectField
        :ariaLabel="$t('profilePage.ariaLabel.colorScheme')"
        :items="colorSchemes"
        labelPrefix="profilePage.colorSchemes."
        v-model:selected="selectedColorScheme"
      />
      <SelectField
        :ariaLabel="$t('profilePage.ariaLabel.handedness')"
        :items="handedness"
        labelPrefix="profilePage.handedness."
        v-model:selected="selectedHandedness"
      />
      <Transition name="fade">
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </Transition>
      <Button @click="saveSettings" :type="ButtonType.BUTTON">
        {{ $t('profilePage.save') }}
      </Button>
    </form>
  </article>
</template>

<script setup lang="ts">
import { useSuccessTransition } from '@/composables/useSuccess';
import i18n from '@/i18n/index';
import { getData, updateData } from '@/utils/global/db';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';
import SelectField from '@/components/form/SelectField.vue';
import { setColorScheme, setHandedness } from '@/utils/global/setInterfaceVariables';
import { ref, onMounted, watch } from 'vue';
import Button from '../form/Button.vue';
import { ButtonType } from '@/utils/types/enums';

// Set language dropdown to user language
const languages = [
  { value: 'en', label: 'en' },
  { value: 'nl', label: 'nl' }
];
const selectedLanguage = ref<string>();
const colorSchemes = [
  { value: 'light', label: 'light' },
  { value: 'dark', label: 'dark' }
];
const selectedColorScheme = ref<'light' | 'dark'>();
const handedness = [
  { value: 'left', label: 'left' },
  { value: 'right', label: 'right' },
  { value: 'ambidextrous', label: 'ambidextrous' }
];
const selectedHandedness = ref<'left' | 'right' | 'ambidextrous'>('right');

// Get user from database and set dropdowns to user settings
onMounted(async () => {
  getData('users', where('id', '==', getAuth().currentUser?.uid))
    .then((users) => {
      if (users.length > 0) {
        selectedLanguage.value = users[0].language;
        selectedColorScheme.value = users[0].colorScheme;
        selectedHandedness.value = users[0].handedness || 'right';
      }
    })
    .catch((error: any) => {
      console.error('Error getting user from database:', error);
    });
});

// Watch for changes in selected language and update i18n
watch(selectedLanguage, () => {
  i18n.global.locale.value = (selectedLanguage.value as 'en' | 'nl') || 'en';
});

// Watch for changes in selected color scheme and update color scheme
watch(selectedColorScheme, () => {
  setColorScheme(selectedColorScheme.value || 'dark');
});

// Watch for changes in selected handedness and update database
watch(selectedHandedness, () => {
  setHandedness(selectedHandedness.value || 'right');
});

// Save settings to database
const successMessage = ref<string>('');

/**
 * Save the user settings to the database
 */
function saveSettings(): void {
  Promise.all([
    updateData('users', where('id', '==', getAuth().currentUser?.uid), {
      language: selectedLanguage.value,
      colorScheme: selectedColorScheme.value,
      handedness: selectedHandedness.value
    }),
    useSuccessTransition(successMessage, 'profilePage.saveSuccess')
  ]).catch((error: any) => {
    console.error('Error saving settings:', error);
  });
}
</script>
