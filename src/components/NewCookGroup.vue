<template>
  <main class="editCookGroup">
    <article>
      <div class="header">
        <h2>{{ $t('editCookGroupPage.title') }}</h2>
        <h2>
          <font-awesome-icon @click="$emit('closePopUp')" :icon="['fas', 'xmark']" />
        </h2>
      </div>
      <input-field
        id="name"
        name="name"
        :label="$t('editCookGroupPage.name')"
        :placeholder="$t('editCookGroupPage.name')"
        :ariaLabel="$t('editCookGroupPage.ariaLabel.name')"
        type="text"
        :required="true"
        v-model:input="cookGroup.name"
      />
      <input-list
        id="inviteeEmails"
        :label="$t('editCookGroupPage.inviteeEmails')"
        v-model:items="cookGroup.invitees"
        v-slot="{ index }"
      >
        <input-field
          :name="'invitee email ' + index"
          :placeholder="$t('editCookGroupPage.inviteeEmails')"
          :ariaLabel="$t('editCookGroupPage.ariaLabel.inviteeEmails')"
          type="text"
          v-model:input="cookGroup.invitees[index]"
          @input="addInputRow(cookGroup.invitees, index, '')"
        />
      </input-list>
      <error-message v-model:message="errorMessage" />
      <div class="footer">
        <button @click="closePopUp" type="button">
          {{ $t('editCookGroupPage.cancel') }}
        </button>
        <button @click.prevent="saveCookGroup" type="submit">
          {{ $t('editCookGroupPage.save') }}
        </button>
      </div>
    </article>
  </main>
</template>

<script lang="ts" setup>
import { capitalize, onMounted, ref } from 'vue';
import InputField from './form/InputField.vue';
import InputList from './form/InputList.vue';
import ErrorMessage from './form/ErrorMessage.vue';
import { addInputRow } from '@/utils/newRecipe/list';
import { validateCookGroup } from '@/utils/cookGroups/validateCookGroup';
import { emptyCookGroup, type CookGroup } from '@/utils/types/cookgroup';
import { addData, updateData } from '@/utils/db';
import i18n from '@/i18n/index';
import { getAuth } from 'firebase/auth';
import { where } from 'firebase/firestore';

const props = defineProps<{
  cookGroup?: CookGroup;
}>();
const emit = defineEmits<{ closePopUp: []; refreshCookGroups: [] }>();

const auth = getAuth();

const cookGroup = ref<CookGroup>(emptyCookGroup());
const errorMessage = ref<string>('');

// Add cook group to edit if it exists
onMounted(() => {
  if (props.cookGroup) {
    cookGroup.value = JSON.parse(JSON.stringify(props.cookGroup));
    cookGroup.value.name = capitalize(cookGroup.value.name);
    cookGroup.value.invitees.push('');
  }
});

/**
 * Save the new cook group
 * @returns {Promise<void>} - A promise that resolves when the cook group is saved
 */
async function saveCookGroup(): Promise<void> {
  errorMessage.value = validateCookGroup(cookGroup.value);
  const invitees = cookGroup.value.invitees.filter((invitee) => invitee !== '');
  if (errorMessage.value === '') {
    if (!props.cookGroup) {
      cookGroup.value.id = crypto.randomUUID();
      cookGroup.value.owner = auth.currentUser?.uid || '';
      cookGroup.value.personal = false;
    }
    cookGroup.value.name = cookGroup.value.name.toLowerCase();
    cookGroup.value.invitees = [...new Set(invitees.map((invitee) => invitee.toLowerCase()))];

    // Save the cook group to the database
    try {
      // Check if the user is editing an existing cook group
      if (props.cookGroup) {
        await updateData('cookGroups', where('id', '==', cookGroup.value.id), cookGroup.value);
      } else {
        await addData('cookGroups', cookGroup.value);
      }

      // Reset the form
      cookGroup.value = emptyCookGroup();
      errorMessage.value = '';

      // Emit the event to close the pop-up
      emit('refreshCookGroups');
      emit('closePopUp');
    } catch (error) {
      errorMessage.value = i18n.global.t('editCookGroupPage.errors.save');
    }
  }
}

/**
 * Close the pop-up and reset the form
 */
function closePopUp(): void {
  emit('closePopUp');
  cookGroup.value = emptyCookGroup();
  errorMessage.value = '';
}
</script>
