<template>
  <main class="two-columns">
    <article>
      <h2>{{ $t('profilePage.settings') }}</h2>

      <form>
        <select-field
          :ariaLabel="$t('profilePage.ariaLabel.language')"
          :items="languages"
          labelPrefix="profilePage.languages."
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
      <section class="title">
        <h2>{{ $t('profilePage.account') }}</h2>
        <div class="actions">
          <font-awesome-icon
            @click="deleteAccountOpen = true"
            class="delete"
            :icon="['fas', 'trash-can']"
          />
        </div>
      </section>
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
  <teleport to="body" v-if="deleteAccountOpen">
    <main class="modal">
      <article>
        <section class="header">
          <h2>{{ $t('profilePage.deleteAccount') }}</h2>
          <h2>
            <font-awesome-icon @click="deleteAccountOpen = false" :icon="['fas', 'xmark']" />
          </h2>
        </section>
        <section class="content">
          <p>{{ $t('profilePage.confirmDelete') }}</p>
        </section>
        <section class="footer">
          <button @click="deleteAccountOpen = false" type="button">
            {{ $t('profilePage.cancel') }}
          </button>
          <button @click.prevent="deleteAccount()" type="submit">
            {{ $t('profilePage.delete') }}
          </button>
        </section>
      </article>
    </main>
  </teleport>
</template>

<script setup lang="ts">
import { useSuccessTransition } from '@/composables/useSuccess';
import i18n from '@/i18n/index';
import { deleteData, getData, updateData } from '@/utils/db';
import { deleteUser, getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';
import { ref, onMounted, watch } from 'vue';
import { handleSignOut } from '@/utils/authentication';
import InputField from '@/components/form/InputField.vue';
import SelectField from '@/components/form/SelectField.vue';
import { useRouter } from 'vue-router';

const auth = getAuth();
const router = useRouter();

// Set language dropdown to user language
const languages = [
  { value: 'en', label: 'en' },
  { value: 'nl', label: 'nl' }
];
const selectedLanguage = ref<string>();

// Get user from database and set dropdowns to user settings
onMounted(async () => {
  getData('users', where('id', '==', auth.currentUser?.uid))
    .then((users) => {
      if (users.length > 0) {
        selectedLanguage.value = users[0].language;
      }
    })
    .catch((error: any) => {
      console.error('Error getting user from database:', error);
    });
});

// Watch for changes in selected language and update i18n
watch(selectedLanguage, (newLanguage) => {
  i18n.global.locale.value = newLanguage;
});

// Save settings to database
const successMessage = ref<string>('');

/**
 * Save the user settings to the database
 */
function saveSettings(): void {
  const user = {
    language: selectedLanguage.value
  };

  Promise.all([
    updateData('users', where('id', '==', auth.currentUser?.uid), user),
    useSuccessTransition(successMessage, 'profilePage.saveSuccess')
  ]).catch((error: any) => {
    console.error('Error saving settings:', error);
  });
}

// Delete account
const deleteAccountOpen = ref<boolean>(false);

/*
 * Delete the account
 */
async function deleteAccount(): Promise<void> {
  // Delete the user from the database
  deleteData('users', where('id', '==', auth.currentUser?.uid))
    .then(() => {
      // Delete the user
      deleteUser(auth.currentUser as any);
    })
    .then(() => {
      // Redirect to recipes page
      router.push({ path: '/' });
    })
    .catch((error) => {
      console.error('Error deleting account:', error);
    });
}
</script>
