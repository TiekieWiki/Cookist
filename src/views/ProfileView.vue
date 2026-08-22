<template>
  <main class="profile">
    <article>
      <section class="userCard">
        <div class="user">
          <h3 class="userBrand">{{ email.slice(0, 1).toLocaleUpperCase() }}</h3>
          <div class="userName">
            <h2>{{ email.split('@')[0] }}</h2>
            <p>{{ email }}</p>
          </div>
        </div>
        <div class="actions">
          <Button
            @click="useLogout"
            :type="ButtonType.BUTTON"
            :variant="ColorVariant.SECONDARY"
            :size="Size.LARGE"
          >
            <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
            {{ $t('profilePage.logout') }}
          </Button>
        </div>
      </section>
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
      <Button
        @click="deleteOpen = true"
        :type="ButtonType.BUTTON"
        :variant="ColorVariant.TERTIARY"
        :size="Size.LARGE"
      >
        <font-awesome-icon :icon="['fas', 'trash-can']" />
        {{ $t('profilePage.deleteAccount') }}
      </Button>
    </article>
  </main>
  <ConfirmPopUp
    :title="$t('profilePage.deleteAccount')"
    :section="$t('profilePage.confirmDelete')"
    :cancel="'profilePage.cancel'"
    :confirm="'profilePage.delete'"
    v-model:openPopUp="deleteOpen"
    @confirm="deleteUserAccount()"
  />
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore';
import { onMounted, ref, watch } from 'vue';
import Button from '@/components/form/Button.vue';
import {
  ButtonType,
  ColorScheme,
  ColorVariant,
  Handedness,
  Language,
  Size
} from '@/utils/types/enums';
import { useLogout } from '@/composables/useAuthentication.js';
import { useProfileStore } from '@/stores/useProfileStore';
import i18n from '@/i18n';
import { setColorScheme, setHandedness } from '@/utils/global/setInterfaceVariables';
import SelectField from '@/components/form/SelectField.vue';
import Toggle from '@/components/form/Toggle.vue';
import SuccessMessage from '@/components/form/SuccessMessage.vue';
import ErrorMessage from '@/components/form/ErrorMessage.vue';
import ConfirmPopUp from '@/components/general/ConfirmPopUp.vue';

const userStore = useUserStore();
const profileStore = useProfileStore();
const email = ref<string>('');
const deleteOpen = ref<boolean>(false);
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

onMounted(async () => {
  if (userStore.user) {
    email.value = userStore.user.email ?? '';
  }
});

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
  console.log('test');
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

/**
 * Delete the user account and log out the user
 */
async function deleteUserAccount(): Promise<void> {
  await userStore.deleteUser();

  deleteOpen.value = false;

  if (!userStore.errorMessage) {
    await useLogout();
  }
}
</script>
