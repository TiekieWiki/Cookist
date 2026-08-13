<template>
  <section>
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
      <SuccessMessage v-model:message="successMessage" />
      <ErrorMessage v-model:message="profileStore.errorMessage" />
      <Button @click="saveSettings" :type="ButtonType.BUTTON" :variant="ColorVariant.SECONDARY">
        {{ $t('profilePage.save') }}
      </Button>
    </form>
  </section>
</template>

<script setup lang="ts">
import i18n from '@/i18n/index';
import SelectField from '@/components/form/SelectField.vue';
import { setColorScheme, setHandedness } from '@/utils/global/setInterfaceVariables';
import { ref, onMounted, watch } from 'vue';
import Button from '../form/Button.vue';
import { ButtonType, ColorScheme, ColorVariant, Handedness, Language } from '@/utils/types/enums';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import SuccessMessage from '../form/SuccessMessage.vue';
import { useProfileStore } from '@/stores/useProfileStore.js';

const profileStore = useProfileStore();
const languages = [
  { value: 'en', label: 'en' },
  { value: 'nl', label: 'nl' }
];
const selectedLanguage = ref<Language>();
const colorSchemes = [
  { value: 'light', label: 'light' },
  { value: 'dark', label: 'dark' }
];
const selectedColorScheme = ref<ColorScheme>();
const handedness = [
  { value: 'left', label: 'left' },
  { value: 'right', label: 'right' },
  { value: 'ambidextrous', label: 'ambidextrous' }
];
const selectedHandedness = ref<Handedness>();
const successMessage = ref<string>('');

// Set dropdowns to profile settings
onMounted(async () => {
  if (profileStore.profile) {
    selectedLanguage.value = profileStore.profile.language;
    selectedColorScheme.value = profileStore.profile.colorscheme;
    selectedHandedness.value = profileStore.profile.handedness;
  }
});

watch(selectedLanguage, () => {
  i18n.global.locale.value = (selectedLanguage.value as 'en' | 'nl') || 'en';
});

watch(selectedColorScheme, () => {
  setColorScheme(selectedColorScheme.value || 'dark');
});

watch(selectedHandedness, () => {
  setHandedness(selectedHandedness.value || 'right');
});

/**
 * Save the user settings to the database
 */
async function saveSettings(): Promise<void> {
  await profileStore.setProfile(
    selectedLanguage.value || Language.EN,
    selectedColorScheme.value || ColorScheme.DARK,
    selectedHandedness.value || Handedness.RIGHT
  );

  if (!profileStore.errorMessage) {
    successMessage.value = i18n.global.t('profilePage.saveSuccess');
  }
}
</script>
