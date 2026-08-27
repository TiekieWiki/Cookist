<template>
  <section class="preferencesCard">
    <h3>{{ $t('profilePage.preferences') }}</h3>
    <div class="preference">
      <div class="name">
        <p>{{ $t('profilePage.language') }}</p>
        <p class="small">{{ $t('profilePage.languageDescription') }}</p>
      </div>
      <SelectField
        :ariaLabel="$t('profilePage.ariaLabel.language')"
        :items="languages"
        :variant="ColorVariant.PRIMARY"
        labelPrefix="profilePage.languages."
        v-model:selected="selectedLanguage"
      />
    </div>
    <div class="preference">
      <div class="name">
        <p>{{ $t('profilePage.colorScheme') }}</p>
        <p class="small">{{ $t('profilePage.colorSchemeDescription') }}</p>
      </div>
      <Toggle v-model:input="darkModeOn" />
    </div>
    <div class="preference">
      <div class="name">
        <p>{{ $t('profilePage.handedness') }}</p>
        <p class="small">{{ $t('profilePage.handednessDescription') }}</p>
      </div>
      <SelectField
        :ariaLabel="$t('profilePage.ariaLabel.handedness')"
        :items="handedness"
        :variant="ColorVariant.PRIMARY"
        labelPrefix="profilePage.handednessType."
        v-model:selected="selectedHandedness"
      />
    </div>
    <SuccessMessage v-model:message="successMessage" />
    <ErrorMessage v-model:message="profileStore.errorMessage" />
    <Button
      @click="saveSettings"
      :type="ButtonType.BUTTON"
      :variant="ColorVariant.PRIMARY"
      :size="Size.LARGE"
    >
      {{ $t('profilePage.save') }}
    </Button>
  </section>
</template>

<script setup lang="ts">
import i18n from '@/i18n';
import { useProfileStore } from '@/stores/useProfileStore';
import { setColorScheme, setHandedness } from '@/utils/global/setInterfaceVariables';
import {
  ButtonType,
  ColorScheme,
  ColorVariant,
  Handedness,
  Language,
  Size
} from '@/utils/types/enums';
import { ref, watch } from 'vue';
import Button from '@/components/form/Button.vue';
import SelectField from '../form/SelectField.vue';
import SuccessMessage from '../form/SuccessMessage.vue';
import ErrorMessage from '../form/ErrorMessage.vue';
import Toggle from '../form/Toggle.vue';

const profileStore = useProfileStore();
const languages = [
  { value: 'en', label: 'en' },
  { value: 'nl', label: 'nl' }
];
const selectedLanguage = ref<Language>();
const darkModeOn = ref<boolean>();
const handedness = [
  { value: 'left', label: 'left' },
  { value: 'right', label: 'right' },
  { value: 'ambidextrous', label: 'ambidextrous' }
];
const selectedHandedness = ref<Handedness>();
const successMessage = ref<string>('');

watch(
  () => profileStore.profile,
  (profile) => {
    if (!profile) return;

    selectedLanguage.value = profile.language;
    darkModeOn.value = profile.colorscheme === ColorScheme.DARK;
    selectedHandedness.value = profile.handedness;
  },
  { immediate: true }
);

watch(selectedLanguage, () => {
  i18n.global.locale.value = (selectedLanguage.value as 'en' | 'nl') || 'en';
});

watch(darkModeOn, () => {
  setColorScheme(!darkModeOn.value ? ColorScheme.LIGHT : ColorScheme.DARK);
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
    !darkModeOn.value ? ColorScheme.LIGHT : ColorScheme.DARK,
    selectedHandedness.value || Handedness.RIGHT
  );

  if (!profileStore.errorMessage) {
    successMessage.value = i18n.global.t('profilePage.saveSuccess');
  }
}
</script>
